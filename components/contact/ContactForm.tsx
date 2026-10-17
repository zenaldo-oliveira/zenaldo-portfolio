"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { useTranslations } from "@/lib/i18n/LanguageContext";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactData = {
  name: string;
  whatsapp: string;
  email: string;
  message: string;
};

// Mensagem enviada ao WhatsApp da ZTech com os dados do formulário — usada
// depois de registrar o contato e, se o registro falhar, como alternativa.
function buildContactWhatsAppUrl({ name, whatsapp, email, message }: ContactData): string {
  const text = `


🚀 Novo contato pelo Portfólio

👤 Nome: ${name}

📱 WhatsApp: ${whatsapp}

📧 E-mail: ${email}

💬 Mensagem:
${message}
`;

  return buildWhatsAppUrl(text);
}

export function ContactForm() {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evita envio duplicado enquanto uma tentativa já está em andamento.
    if (isSubmitting) return;

    setStatus("submitting");
    setErrorMessage("");
    setWhatsappUrl(null);

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
        setErrorMessage(t.contactForm.errorMessage);
        return;
      }

      setStatus("success");

      const url = buildContactWhatsAppUrl({ name, whatsapp, email, message });

      // window.open depois de um await perde o gesto do usuário e é bloqueado
      // no Safari iOS e nos navegadores internos do Instagram/Facebook. A
      // tentativa automática fica só como conveniência (funciona em alguns
      // desktops); o caminho garantido é o link exibido abaixo, que é um
      // clique real do usuário.
      setWhatsappUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");

      setName("");
      setWhatsapp("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage(t.contactForm.errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder={t.contactForm.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              py-2.5
              text-sm
              text-text-primary
              outline-none
              transition-all
              focus:border-accent
              focus-visible:ring-2
              focus-visible:ring-ring
              disabled:opacity-60
            "
      />

      <input
        type="tel"
        required
        placeholder={t.contactForm.whatsappPlaceholder}
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              py-2.5
              text-sm
              text-text-primary
              outline-none
              transition-all
              focus:border-accent
              focus-visible:ring-2
              focus-visible:ring-ring
              disabled:opacity-60
            "
      />

      <input
        type="email"
        required
        placeholder={t.contactForm.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="
                w-full
                rounded-xl
                border
                border-border
                bg-surface
                px-4
                py-2.5
                text-sm
                text-text-primary
                outline-none
                transition-all
                focus:border-accent
                disabled:opacity-60
              "
      />

      <textarea
        rows={3}
        required
        placeholder={t.contactForm.messagePlaceholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
        className="
              w-full
              resize-none
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              py-2.5
              text-sm
              text-text-primary
              outline-none
              transition-all
              focus:border-accent
              focus-visible:ring-2
              focus-visible:ring-ring
              disabled:opacity-60
            "
      />

      {/* Falha ao registrar: os campos continuam preenchidos e o visitante
          pode enviar os mesmos dados pelo WhatsApp. Não afirma que o contato
          foi salvo. */}
      {status === "error" && (
        <div role="alert" className="space-y-3">
          <p className="text-sm text-red-400">{errorMessage}</p>
          <p className="text-sm text-text-secondary">{t.contactForm.errorWhatsappHint}</p>
          <a
            href={buildContactWhatsAppUrl({ name, whatsapp, email, message })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/60 px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-[#25D366]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle size={16} aria-hidden="true" />
            {t.contactForm.sendViaWhatsapp}
          </a>
        </div>
      )}

      {status === "success" && whatsappUrl && (
        <div role="status" className="space-y-3">
          <p className="text-sm text-emerald-400">
            {t.contactForm.successMessage}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#25D366]
              px-4
              py-3
              text-sm
              font-semibold
              text-black
              transition-all
              duration-300
              hover:scale-[1.01]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
            "
          >
            <MessageCircle size={16} />
            {t.contactForm.openWhatsapp}
          </a>
        </div>
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
            bg-cta
            hover:bg-cta-hover
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
            focus-visible:ring-ring
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:scale-100
          "
      >
        <Send size={16} />
        {isSubmitting ? t.contactForm.submitSending : t.contactForm.submitIdle}
      </button>
    </form>
  );
}
