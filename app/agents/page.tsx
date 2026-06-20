"use client";

import { Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function AgentsPage() {
  // Referência do container do chat
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mensagem digitada pelo usuário
  const [message, setMessage] = useState("");

  // Indicador "digitando..."
  const [isTyping, setIsTyping] = useState(false);

  // Histórico do chat
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "👋 Olá! Sou o assistente virtual da ZDTech. Como posso ajudar você hoje?",
    },
  ]);

  // Auto scroll sempre que chegar uma nova mensagem
  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isTyping]);

  // Enviar mensagem
  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    // Adiciona mensagem do usuário
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);

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
        }),
      });

      const data = await response.json();

      // Adiciona resposta da IA
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
          content: "Ocorreu um erro ao processar sua mensagem.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-4 text-white">
        ZDTech AI Assistant
      </h1>

      <p className="text-gray-400 mb-8">
        Assistente virtual para atendimento e qualificação de clientes.
      </p>

      {/* Container principal */}
      <div className="h-[700px] flex flex-col border border-cyan-500/20 rounded-2xl overflow-hidden bg-slate-950">
        {/* Área das mensagens */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
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
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-md"
                    : "bg-slate-800 text-white rounded-2xl rounded-bl-md shadow-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Indicador digitando */}
          {/* Indicador digitando */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>

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

        {/* Campo de envio */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex gap-2">
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
                h-12
                px-4
                rounded-xl
                bg-slate-900
                text-white
                border
                border-slate-700
                outline-none
              "
            />

            <button
              type="button"
              onClick={sendMessage}
              className="
                w-12
                h-12
                rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-600
                hover:bg-cyan-600
                text-white
                flex
                items-center
                justify-center
              "
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
