"use client";

import { useState, useEffect, useRef } from "react";

import { Sparkles, X, Send } from "lucide-react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [leadSaved, setLeadSaved] = useState(false);

  const [lead, setLead] = useState({
    nome: "",
    whatsapp: "",
    interesse: "",
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: `🚀 Olá! Sou o assistente virtual da ZDTech.

    Posso ajudar com:

    1️⃣ Criação de Sites
    2️⃣ Agentes de IA
    3️⃣ Automação para WhatsApp
    4️⃣ Sistemas Web

    Qual solução você procura?`,
    },
  ]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isTyping]);

  // MONITORA E SALVA O LEAD NO SUPABASE
  // MONITORA E SALVA O LEAD NO SUPABASE
  useEffect(() => {
    console.log("LEAD:", lead);

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
      .then((data) => {
        console.log("LEAD SALVO:", data);

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

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

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

    const updatedMessages: {
      role: "user" | "assistant";
      content: string;
    }[] = [
      ...messages,
      {
        role: "user",
        content: currentMessage,
      },
    ];

    setMessages(updatedMessages);

    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          messages,
        }),
      });
      console.log("STATUS:", response.status);

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          title="Abrir assistente virtual"
          aria-label="Abrir assistente virtual"
          onClick={() => setOpen(true)}
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
transition-all
duration-300
hover:scale-110
border
border-cyan-400/20
"
        >
          <Sparkles size={24} />
        </button>
      )}

      {open && (
        <div
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

            sm:top-auto
            sm:left-auto
            sm:right-6
            sm:bottom-24

            sm:w-[380px]
            sm:h-[600px]

            sm:rounded-2xl
            sm:border
            sm:border-cyan-500/20
          "
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 flex justify-between items-center">
            <span>ZDTech AI</span>

            <button
              type="button"
              title="Fechar chat"
              aria-label="Fechar chat"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="
          flex-1
          overflow-y-auto
          p-4
          space-y-3
          scroll-smooth
          "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[65%] px-3 py-2 break-words text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white rounded-2xl rounded-br-md"
                      : "bg-slate-800 text-white rounded-2xl rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Digite sua mensagem..."
              className="
              flex-1
              min-w-0
              h-12
              px-4
              bg-slate-800
              rounded-lg
              text-white
              outline-none
  "
            />

            <button
              type="button"
              title="Enviar mensagem"
              aria-label="Enviar mensagem"
              onClick={sendMessage}
              className="
              w-12
              h-12
              rounded-lg
              bg-cyan-500
              text-white
              flex
              items-center
              justify-center
            "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
