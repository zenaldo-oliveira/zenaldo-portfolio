"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const WHATSAPP_NUMBER = "5565992832422";
const GENERIC_ERROR_MESSAGE =
  "Não foi possível registrar seu contato agora. Tente novamente em instantes.";

export function ContactForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evita envio duplicado enquanto uma tentativa já está em andamento.
    if (isSubmitting) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          whatsapp,
          interesse: message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setStatus("error");
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        return;
      }

      setStatus("success");

      const text = `


🚀 Novo contato pelo Portfólio

👤 Nome: ${name}

📱 WhatsApp: ${whatsapp}

📧 E-mail: ${email}

💬 Mensagem:
${message}
`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

      window.open(url, "_blank");

      setName("");
      setWhatsapp("");
      setEmail("");
      setMessage("");

      // Volta ao estado normal após a confirmação, liberando um novo envio.
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setErrorMessage(
        "Não foi possível registrar seu contato agora. Verifique sua conexão e tente novamente.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
              disabled:opacity-60
            "
      />

      <input
        type="tel"
        required
        placeholder="Seu WhatsApp (com DDD)"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
              disabled:opacity-60
            "
      />

      <input
        type="email"
        required
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-2.5
                text-sm
                text-white
                outline-none
                transition-all
                focus:border-cyan-500
                disabled:opacity-60
              "
      />

      <textarea
        rows={3}
        required
        placeholder="Descreva seu projeto..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
              disabled:opacity-60
            "
      />

      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <p role="status" className="text-sm text-emerald-400">
          Contato registrado! Abrindo o WhatsApp...
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.01]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-500/60
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:scale-100
          "
      >
        <Send size={16} />
        {isSubmitting ? "Enviando..." : "Enviar para WhatsApp"}
      </button>
    </form>
  );
}
