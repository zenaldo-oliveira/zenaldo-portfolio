import OpenAI from "openai";
import {
  MAX_ATTACHMENT_SIZE,
  isAllowedAttachmentType,
  matchesFileSignature,
} from "@/lib/attachments/validation";
import {
  computeQualificationScore,
  classifyQualification,
} from "@/lib/leads/scoring";
import { normalizeWhatsapp } from "@/lib/leads/normalizeWhatsapp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_ATTACHMENT_FILENAME_LENGTH = 80;
const MAX_ATTACHMENT_TEXT_CHARS = 4000;
const MAX_EXTRACTED_FIELD_LENGTH = 200;

// Rate limit em memória (best-effort): funciona por instância do servidor.
// Em ambientes serverless com múltiplas instâncias o limite é por instância,
// não global — suficiente como primeira camada de proteção contra abuso.
const requestTimestamps = new Map<string, number[]>();

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestTimestamps.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestTimestamps.set(ip, recent);
  return false;
}

type ChatMessage = { role: string; content: string };

function isValidChatMessage(value: unknown): value is ChatMessage {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as ChatMessage).role === "string" &&
    typeof (value as ChatMessage).content === "string" &&
    (value as ChatMessage).content.length <= MAX_MESSAGE_LENGTH
  );
}

type AttachmentContextResult = { context: string } | { error: string };

// Monta o trecho de contexto sobre o arquivo anexado para o prompt atual.
// Nunca confia no MIME/nome informado pelo cliente — revalida tamanho e
// assinatura real dos bytes. Não processa nem envia imagens/PDF para a IA
// (o modelo/API atual não foi adaptado para isso) — apenas informa que o
// arquivo foi recebido, para não fingir uma capacidade que não existe.
async function buildAttachmentContext(
  file: File,
): Promise<AttachmentContextResult> {
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return { error: "Este arquivo é muito grande. O limite é 10 MB." };
  }

  const type = file.type;

  if (!isAllowedAttachmentType(type)) {
    return { error: "Este tipo de arquivo não é permitido." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!matchesFileSignature(type, bytes)) {
    return {
      error: "O conteúdo do arquivo não corresponde ao tipo informado.",
    };
  }

  const safeName = file.name.slice(0, MAX_ATTACHMENT_FILENAME_LENGTH);

  if (type === "text/plain") {
    const text = new TextDecoder("utf-8", { fatal: false })
      .decode(bytes)
      .slice(0, MAX_ATTACHMENT_TEXT_CHARS);

    return {
      context: `\n\nO usuário anexou um arquivo de texto ("${safeName}"). Conteúdo do arquivo:\n${text}`,
    };
  }

  if (type === "application/pdf") {
    return {
      context: `\n\nO usuário anexou um arquivo PDF ("${safeName}"). A extração de texto de PDF ainda não está disponível nesta versão — não invente o conteúdo, apenas reconheça que recebeu o arquivo.`,
    };
  }

  // Imagens (png/jpeg/webp)
  return {
    context: `\n\nO usuário anexou uma imagem ("${safeName}"). A análise visual de imagens ainda não está disponível nesta versão — não invente o que a imagem contém, apenas reconheça que a recebeu.`,
  };
}

type LeadExtraction = {
  name: string | null;
  whatsapp: string | null;
  interest: string | null;
  projectType: string | null;
  need: string | null;
  urgency: string | null;
  budget: string | null;
  intent: string | null;
};

// Nunca confia no que a IA devolveu: normaliza tipo e tamanho de cada campo,
// descartando qualquer coisa que não seja string não vazia. O WhatsApp passa
// pela normalização própria (dígitos + DDI), que também funciona como uma
// validação leve — valores claramente inválidos viram null.
function sanitizeExtractedField(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  return trimmed.slice(0, MAX_EXTRACTED_FIELD_LENGTH);
}

function sanitizeLeadExtraction(raw: unknown): LeadExtraction {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;

  const whatsappField = sanitizeExtractedField(source.whatsapp);

  return {
    name: sanitizeExtractedField(source.name),
    whatsapp: whatsappField ? normalizeWhatsapp(whatsappField) : null,
    interest: sanitizeExtractedField(source.interest),
    projectType: sanitizeExtractedField(source.projectType),
    need: sanitizeExtractedField(source.need),
    urgency: sanitizeExtractedField(source.urgency),
    budget: sanitizeExtractedField(source.budget),
    intent: sanitizeExtractedField(source.intent),
  };
}

// Structured output (Responses API) — a IA sempre devolve reply + os campos
// de qualificação (nulos quando ainda não identificados). additionalProperties
// false e todos os campos em "required" são exigidos pelo modo strict.
const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    name: { type: ["string", "null"] },
    whatsapp: { type: ["string", "null"] },
    interest: { type: ["string", "null"] },
    projectType: { type: ["string", "null"] },
    need: { type: ["string", "null"] },
    urgency: { type: ["string", "null"] },
    budget: { type: ["string", "null"] },
    intent: { type: ["string", "null"] },
  },
  required: [
    "reply",
    "name",
    "whatsapp",
    "interest",
    "projectType",
    "need",
    "urgency",
    "budget",
    "intent",
  ],
  additionalProperties: false,
};

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return Response.json(
        {
          error: "Muitas mensagens em pouco tempo. Tente novamente em instantes.",
        },
        { status: 429 },
      );
    }

    const contentType = req.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    let rawMessage: unknown;
    let rawMessages: unknown;
    let file: File | null = null;

    if (isMultipart) {
      // Caminho novo: mensagem + anexo. O formato de {message, messages}
      // continua o mesmo, só o transporte muda para acomodar o arquivo.
      const formData = await req.formData().catch(() => null);

      if (!formData) {
        return Response.json({ error: "Mensagem inválida" }, { status: 400 });
      }

      rawMessage = formData.get("message");

      const messagesField = formData.get("messages");
      try {
        rawMessages =
          typeof messagesField === "string" ? JSON.parse(messagesField) : [];
      } catch {
        rawMessages = [];
      }

      const fileField = formData.get("file");
      if (fileField instanceof File && fileField.size > 0) {
        file = fileField;
      }
    } else {
      // Caminho original — inalterado.
      const body = await req.json().catch(() => null);

      if (!body) {
        return Response.json({ error: "Mensagem inválida" }, { status: 400 });
      }

      rawMessage = body.message;
      rawMessages = body.messages;
    }

    if (typeof rawMessage !== "string") {
      return Response.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    const message = rawMessage.trim();

    // Com anexo, a mensagem de texto pode ficar vazia; sem anexo, continua obrigatória.
    if ((!message && !file) || message.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    const messages: ChatMessage[] = Array.isArray(rawMessages)
      ? rawMessages.filter(isValidChatMessage).slice(-MAX_HISTORY_MESSAGES)
      : [];

    let attachmentContext = "";

    if (file) {
      const result = await buildAttachmentContext(file);

      if ("error" in result) {
        return Response.json({ error: result.error }, { status: 400 });
      }

      attachmentContext = result.context;
    }

    // MONTA O HISTÓRICO DA CONVERSA
    const conversation = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      max_output_tokens: 400,
      text: {
        format: {
          type: "json_schema",
          name: "chat_response",
          strict: true,
          schema: CHAT_RESPONSE_SCHEMA,
        },
      },
      input: `
Histórico da conversa:

${conversation}

Nova mensagem do usuário:

${message}${attachmentContext}
`,
      instructions: `

Você é o Consultor Comercial da ZTech Solutions.

A ZTech Solutions ajuda empresas a vender mais, automatizar processos e fortalecer sua presença digital através de:

* Sites Profissionais
* Landing Pages
* Sistemas Web
* Automação para WhatsApp
* Agentes de Inteligência Artificial
* Integrações e Soluções Personalizadas

MENSAGEM INICIAL

👋 Bem-vindo à ZTech Solutions!

Ajudamos empresas a vender mais, automatizar processos e economizar tempo com tecnologia.

Como posso ajudar você hoje?

MISSÃO

Seu objetivo é identificar rapidamente a necessidade do visitante e encaminhá-lo para um orçamento ou atendimento especializado.

COMPORTAMENTO

* Seja cordial, profissional e objetivo.
* Escreva de forma simples.
* Evite termos técnicos.
* Responda em até 2 frases.
* Faça apenas uma pergunta por vez.
* Nunca repita perguntas já respondidas.
* Nunca reinicie a conversa.
* Conduza naturalmente para orçamento ou WhatsApp.

FOCO

O cliente não está comprando tecnologia.

O cliente quer:

* Mais vendas
* Mais clientes
* Mais agilidade
* Menos trabalho manual
* Mais profissionalismo

Sempre fale dos benefícios.

PREÇOS

Nunca invente valores.

Quando perguntarem preço:

"O valor depende das necessidades do seu projeto. Posso encaminhar você para um especialista da ZTech Solutions realizar uma avaliação sem compromisso."

ATENDIMENTO HUMANO

Se o visitante mencionar:

* orçamento
* preço
* valor
* contratar
* especialista
* consultor
* humano
* atendente
* WhatsApp

Considere que existe intenção comercial.

Nesses casos:

1. Não continue qualificando.
2. Não faça novas perguntas técnicas.
3. Solicite apenas nome e WhatsApp.

Exemplo:

"Perfeito! Para que um especialista da ZTech Solutions entre em contato, poderia me informar seu nome e WhatsApp?"

LEADS

Após receber nome e WhatsApp:

Responda:

"Obrigado! Seu contato foi registrado. Em breve um especialista da ZTech Solutions entrará em contato para entender melhor seu projeto."

EXEMPLOS

Cliente:
"Quanto custa um site?"

Resposta:
"O valor varia conforme o projeto. Posso solicitar que um especialista faça uma avaliação sem compromisso. Qual seu nome e WhatsApp?"

Cliente:
"Quero automatizar meu WhatsApp."

Resposta:
"Ótima ideia. Podemos ajudar sua empresa a atender clientes automaticamente e gerar mais oportunidades de venda. Qual seu nome e WhatsApp?"

Cliente:
"Tenho uma padaria."

Resposta:
"Perfeito. Podemos ajudar sua padaria a atrair mais clientes e facilitar o atendimento. Qual seu nome e WhatsApp?"

Cliente:
"Quero falar com um humano."

Resposta:
"Claro! Para que um especialista da ZTech Solutions entre em contato, poderia me informar seu nome e WhatsApp?"

REGRAS IMPORTANTES

* Nunca diga que é uma IA.
* Nunca diga que é ChatGPT.
* Nunca invente preços.
* Nunca peça informações técnicas.
* Nunca faça mais de uma pergunta por resposta.
* Nunca volte para perguntas já respondidas.
* Quando identificar interesse comercial, peça apenas nome e WhatsApp.
* Seu objetivo principal é gerar oportunidades de negócio para a ZTech Solutions.

EXTRAÇÃO DE DADOS (campos estruturados da resposta, além de "reply")

Preencha os campos abaixo com o que você identificar em TODA a conversa
(histórico + mensagem atual), não só na última mensagem:

* name: nome da pessoa, se ela disse.
* whatsapp: número de WhatsApp, se ela disse.
* interest: o que ela busca (ex: "site institucional", "automação de atendimento").
* projectType: tipo de projeto (ex: "SaaS", "sistema interno", "landing page").
* need: o problema/necessidade real por trás do pedido.
* urgency: urgência mencionada (ex: "para o mês que vem", "com urgência").
* budget: orçamento ou faixa de valor, SOMENTE se a pessoa mencionar espontaneamente — nunca pergunte por iniciativa própria além do que já é natural na conversa.
* intent: preencha com uma frase curta SOMENTE quando a pessoa expressar intenção clara de contratar/fechar negócio (ex: "quero contratar", "vamos fechar").

Deixe um campo como null quando a informação não foi mencionada em nenhum momento da conversa. Nunca invente valores.

`,
    });

    let parsed: Record<string, unknown> = {};

    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      parsed = {};
    }

    const reply =
      typeof parsed.reply === "string" && parsed.reply.trim()
        ? parsed.reply
        : "Desculpe, não consegui processar sua mensagem agora. Pode reformular?";

    const signals = sanitizeLeadExtraction(parsed);
    const score = computeQualificationScore(signals);
    const status = classifyQualification(score);

    return Response.json({
      reply,
      lead: {
        ...signals,
        score,
        status,
        qualified: status !== "cold",
      },
    });
  } catch (error) {
    console.error("Erro ao processar mensagem no /api/chat:", error);

    return Response.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 },
    );
  }
}
