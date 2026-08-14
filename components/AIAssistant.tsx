"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Minus,
  Paperclip,
  Bot,
  Globe,
  Zap,
  Code2,
  MessageSquareText,
  FolderOpen,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE,
  isAllowedAttachmentType,
} from "@/lib/attachments/validation";

const GENERIC_ERROR_MESSAGE =
  "Não consegui responder agora. Tente novamente.";

const WELCOME_MESSAGE = `Olá! 👋

Sou o ZTech AI, assistente da ZTech Solutions.

Posso ajudar você a conhecer nossos serviços, projetos e soluções digitais.

Como posso ajudar?`;

const ATTACHMENT_ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(",");

type QuickAction = {
  icon: typeof Globe;
  label: string;
  message: string;
};

const quickActions: QuickAction[] = [
  { icon: Globe, label: "Criar um site", message: "Quero criar um site" },
  { icon: Bot, label: "Agentes de IA", message: "Quero um agente de IA" },
  {
    icon: Zap,
    label: "Automação WhatsApp",
    message: "Quero automatizar meu WhatsApp",
  },
  { icon: Code2, label: "Sistemas Web", message: "Quero um sistema web" },
  {
    icon: MessageSquareText,
    label: "Falar com especialista",
    message: "Quero falar com um especialista",
  },
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  attachmentName?: string;
  attachmentNote?: string;
};

type PendingAttachment = {
  file: File;
  previewUrl: string | null;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [attachment, setAttachment] = useState<PendingAttachment | null>(
    null,
  );
  const [attachmentError, setAttachmentError] = useState<string | null>(
    null,
  );

  const [leadSaved, setLeadSaved] = useState(false);

  const [lead, setLead] = useState({
    nome: "",
    whatsapp: "",
    interesse: "",
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const prefersReducedMotion = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);

  // AUTO-SCROLL para a mensagem mais recente
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isTyping]);

  // Ajusta a altura do campo de mensagem conforme o texto (até um limite),
  // sincronizando com o DOM — não envolve estado do React.
  useEffect(() => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [message]);

  // Foco vai para o campo de mensagem ao abrir (e não estar minimizado).
  useEffect(() => {
    if (open && !isMinimized) {
      textareaRef.current?.focus();
    }
  }, [open, isMinimized]);

  // ESC fecha o chat.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Ao fechar, devolve o foco para o botão que abriu o chat.
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      openButtonRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  // Libera a URL de preview do anexo sempre que ela mudar/for removida.
  useEffect(() => {
    const url = attachment?.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [attachment]);

  // MONITORA E SALVA O LEAD NO SUPABASE
  useEffect(() => {
    // Evita salvar mais de uma vez
    if (leadSaved) return;

    // Só salva quando tiver nome e WhatsApp
    if (!lead.nome || !lead.whatsapp) return;

    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    })
      .then(() => {
        setLeadSaved(true);

        setLead({
          nome: "",
          whatsapp: "",
          interesse: "",
        });
      })
      .catch((err) => {
        console.error("ERRO AO SALVAR LEAD:", err);
      });
  }, [lead, leadSaved]);

  const isPhoneNumber = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    return numbers.length >= 10;
  };

  // CAPTURA NOME
  const isName = (text: string) => {
    const msg = text.toLowerCase();

    if (
      msg.includes("site") ||
      msg.includes("automacao") ||
      msg.includes("automação") ||
      msg.includes("whatsapp") ||
      msg.includes("ia") ||
      msg.includes("agente") ||
      msg.includes("sistema")
    ) {
      return false;
    }

    const words = text.trim().split(" ");

    return words.length >= 2 && words.length <= 4 && !isPhoneNumber(text);
  };

  // CAPTURA INTERESSE
  const getInterest = (text: string) => {
    const msg = text.toLowerCase();

    if (msg.includes("site")) return "site";
    if (msg.includes("automação")) return "automacao";
    if (msg.includes("automacao")) return "automacao";
    if (msg.includes("whatsapp")) return "automacao";
    if (msg.includes("ia")) return "ia";
    if (msg.includes("agente")) return "ia";
    if (msg.includes("sistema")) return "sistema";

    return "";
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!isAllowedAttachmentType(file.type)) {
      setAttachmentError("Este tipo de arquivo não é permitido.");
      setAttachment(null);
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentError("Este arquivo é muito grande. O limite é 10 MB.");
      setAttachment(null);
      return;
    }

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    setAttachmentError(null);
    setAttachment({ file, previewUrl });
  };

  // Aceita um texto opcional (usado pelas quick actions) para não duplicar
  // a lógica de captura de lead + chamada ao /api/chat. Quick actions nunca
  // carregam anexo.
  const sendMessage = async (textOverride?: string) => {
    const currentMessage = (textOverride ?? message).trim();
    const currentAttachment = textOverride ? null : attachment;

    if ((!currentMessage && !currentAttachment) || isTyping) return;

    // CAPTURA INTERESSE
    const interest = getInterest(currentMessage);

    if (interest) {
      setLead((prev) => ({
        ...prev,
        interesse: interest,
      }));
    }

    // CAPTURA WHATSAPP
    if (isPhoneNumber(currentMessage)) {
      setLead((prev) => ({
        ...prev,
        whatsapp: currentMessage,
      }));
    }

    // CAPTURA NOME
    if (isName(currentMessage) && !lead.nome) {
      setLead((prev) => ({
        ...prev,
        nome: currentMessage,
      }));
    }

    const historyBeforeThisTurn = messages;

    const updatedMessages: ChatMessage[] = [
      ...historyBeforeThisTurn,
      {
        role: "user",
        content: currentMessage,
        attachmentName: currentAttachment?.file.name,
      },
    ];

    setMessages(updatedMessages);

    setMessage("");
    removeAttachment();
    setIsTyping(true);

    try {
      const response = currentAttachment
        ? await (() => {
            const formData = new FormData();
            formData.append("message", currentMessage);
            formData.append(
              "messages",
              JSON.stringify(historyBeforeThisTurn),
            );
            formData.append("file", currentAttachment.file);

            return fetch("/api/chat", {
              method: "POST",
              body: formData,
            });
          })()
        : await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentMessage,
              messages: historyBeforeThisTurn,
            }),
          });

      const data = await response.json().catch(() => null);

      if (!response.ok || typeof data?.reply !== "string") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              typeof data?.error === "string"
                ? data.error
                : GENERIC_ERROR_MESSAGE,
            isError: true,
          },
        ]);
        return;
      }

      let attachmentNote: string | undefined;

      if (currentAttachment) {
        if (currentAttachment.file.type === "application/pdf") {
          attachmentNote =
            "A leitura automática do conteúdo de PDF ainda não está disponível nesta versão.";
        } else if (currentAttachment.file.type.startsWith("image/")) {
          attachmentNote =
            "A análise visual de imagens ainda não está disponível nesta versão.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          attachmentNote,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: GENERIC_ERROR_MESSAGE,
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const showQuickActions = messages.length === 1;
  const canSend = (message.trim().length > 0 || attachment !== null) && !isTyping;

  const panelTransition = {
    duration: prefersReducedMotion ? 0.1 : 0.2,
    ease: "easeOut" as const,
  };

  return (
    <>
      {!open && (
        <motion.button
          ref={openButtonRef}
          type="button"
          title="Abrir assistente virtual ZTech AI"
          aria-label="Abrir assistente virtual ZTech AI"
          aria-expanded={open}
          aria-controls="ztech-ai-panel"
          onClick={() => setOpen(true)}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          transition={panelTransition}
          className="
ai-glow
fixed
bottom-24
right-6
z-[9999]
w-14
h-14
rounded-full
bg-gradient-to-br
from-cyan-500
to-blue-600
text-white
flex
items-center
justify-center
shadow-xl
border
border-cyan-400/20
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-cyan-500/60
"
        >
          <Sparkles size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            id="ztech-ai-panel"
            role="dialog"
            aria-label="Chat com ZTech AI"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            transition={panelTransition}
            className="
            fixed
            top-0
            left-0
            right-0
            bottom-0

            z-[99999]

            w-full
            h-full

            bg-slate-900

            flex
            flex-col

            md:top-auto
            md:left-auto
            md:right-6
            md:bottom-24

            md:w-[380px]
            md:h-[600px]

            md:rounded-2xl
            md:border
            md:border-cyan-500/20
            md:shadow-2xl
          "
          >
            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between gap-2 rounded-t-none bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white md:rounded-t-2xl">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <Bot size={18} />
                </span>

                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">ZTech AI</span>
                  <span className="flex items-center gap-1.5 text-xs text-cyan-50/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Assistente virtual • Online
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title={isMinimized ? "Expandir chat" : "Minimizar chat"}
                  aria-label={isMinimized ? "Expandir chat" : "Minimizar chat"}
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Minus size={18} />
                </button>

                <button
                  type="button"
                  title="Fechar chat"
                  aria-label="Fechar chat"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* MENSAGENS */}
                <div
                  ref={messagesContainerRef}
                  className="
          flex-1
          overflow-y-auto
          p-4
          space-y-4
          scroll-smooth
          "
                >
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`flex items-end gap-2 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            msg.isError
                              ? "bg-red-500/20 text-red-300"
                              : "bg-cyan-500/20 text-cyan-300"
                          }`}
                        >
                          {msg.isError ? (
                            <AlertCircle size={12} />
                          ) : (
                            <Bot size={12} />
                          )}
                        </span>
                      )}

                      <div
                        className={`flex max-w-[80%] flex-col ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-3.5 py-2.5 break-words text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-cyan-500 text-white rounded-2xl rounded-br-md"
                              : msg.isError
                                ? "bg-red-950/40 text-red-100 border border-red-500/30 rounded-2xl rounded-bl-md"
                                : "bg-slate-800 text-slate-100 rounded-2xl rounded-bl-md"
                          }`}
                        >
                          {msg.attachmentName && (
                            <div
                              className={`mb-1.5 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs ${
                                msg.role === "user"
                                  ? "bg-black/10"
                                  : "bg-white/5"
                              }`}
                            >
                              <Paperclip size={12} className="shrink-0" />
                              <span className="truncate">
                                {msg.attachmentName}
                              </span>
                            </div>
                          )}

                          {msg.content && <span>{msg.content}</span>}
                        </div>

                        {msg.attachmentNote && (
                          <p className="mt-1 px-1 text-[11px] text-zinc-500">
                            {msg.attachmentNote}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* QUICK ACTIONS — só no início da conversa */}
                  {showQuickActions && (
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="flex flex-col gap-2 pl-8"
                    >
                      {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => sendMessage(action.message)}
                            className="
                              flex items-center gap-2
                              rounded-xl border border-white/10 bg-white/5
                              px-3.5 py-2.5 text-left text-sm text-zinc-200
                              transition-all duration-200
                              hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
                            "
                          >
                            <Icon size={16} className="shrink-0 text-cyan-400" />
                            {action.label}
                          </button>
                        );
                      })}

                      <Link
                        href="/projects"
                        className="
                          flex items-center gap-2
                          rounded-xl border border-white/10 bg-white/5
                          px-3.5 py-2.5 text-left text-sm text-zinc-200
                          transition-all duration-200
                          hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
                        "
                      >
                        <FolderOpen size={16} className="shrink-0 text-cyan-400" />
                        Ver projetos
                      </Link>
                    </motion.div>
                  )}

                  {isTyping && (
                    <div className="flex items-end justify-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
                        <Bot size={12} />
                      </span>

                      <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
                        {prefersReducedMotion ? (
                          <span className="text-xs text-zinc-400">
                            ZTech AI está digitando…
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PREVIEW DO ANEXO PENDENTE */}
                {(attachment || attachmentError) && (
                  <div className="shrink-0 border-t border-slate-700 px-3 pt-3">
                    <AnimatePresence>
                      {attachment && (
                        <motion.div
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, y: 6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: -6 }
                          }
                          transition={{ duration: 0.15 }}
                          className="mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
                        >
                          {attachment.previewUrl ? (
                            // Preview local do arquivo (blob: URL), não é upload.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={attachment.previewUrl}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                              <FileText size={16} />
                            </span>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-white">
                              {attachment.file.name}
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              {formatFileSize(attachment.file.size)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={removeAttachment}
                            title="Remover anexo"
                            aria-label="Remover anexo"
                            className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {attachmentError && (
                      <p role="alert" className="mb-2 text-xs text-red-400">
                        {attachmentError}
                      </p>
                    )}
                  </div>
                )}

                {/* COMPOSER */}
                <div className="flex shrink-0 items-end gap-2 border-t border-slate-700 p-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ATTACHMENT_ACCEPT}
                    onChange={handleFileSelect}
                    className="hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Anexar arquivo"
                    aria-label="Anexar arquivo"
                    disabled={isTyping}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Paperclip size={18} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    aria-label="Mensagem para o ZTech AI"
                    disabled={isTyping}
                    className="
              flex-1
              min-w-0
              max-h-32
              resize-none
              px-4
              py-3
              bg-slate-800
              rounded-lg
              text-white
              text-sm
              outline-none
              focus-visible:ring-2 focus-visible:ring-cyan-500/60
              disabled:opacity-60
  "
                  />

                  <button
                    type="button"
                    title={isTyping ? "Enviando..." : "Enviar mensagem"}
                    aria-label={isTyping ? "Enviando..." : "Enviar mensagem"}
                    onClick={() => sendMessage()}
                    disabled={!canSend}
                    className="
              w-11
              h-11
              shrink-0
              rounded-lg
              bg-cyan-500
              text-white
              flex
              items-center
              justify-center
              transition-opacity
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500/60
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
                  >
                    {isTyping ? (
                      <Loader2
                        size={18}
                        className={
                          prefersReducedMotion ? "" : "animate-spin"
                        }
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
