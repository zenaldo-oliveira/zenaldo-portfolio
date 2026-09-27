"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/site";

const CHANNEL_LINK_CLASS =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Página de conversão: WhatsApp como canal principal (mensagem oficial em
// lib/contact/whatsapp), expectativa de resposta, outros canais e o
// formulário — o ContactForm continua exatamente o mesmo (fluxo de leads).
export function ContactContent() {
  const t = useTranslations();
  const c = t.contact;

  return (
    <section className="px-4 pb-24 pt-12 sm:px-6 lg:pt-20">
      <Container>
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {c.eyebrow}
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {t.home.finalCta.description}
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Canais */}
          <Reveal className="space-y-6">
            <div className="rounded-2xl border border-border-accent bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
                  <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-text-primary">{c.channelsTitle}</h2>
              </div>

              <WhatsAppCta label={c.whatsappCta} ariaLabel={t.cta.whatsappAriaLabel} className="mt-6 w-full sm:w-auto" />

              <p className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
                <Clock size={14} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{c.responseLabel}</span>
                {c.responseValue}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{c.otherChannels}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={CHANNEL_LINK_CLASS}>
                    <FaLinkedin size={14} aria-hidden="true" />
                    LinkedIn
                  </a>
                  <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={CHANNEL_LINK_CLASS}>
                    <FaGithub size={14} aria-hidden="true" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* O que acontece depois do contato: o processo real da ZTech. */}
            <div className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{t.home.howWeWork.title}</p>
              <ol className="mt-4 space-y-3.5">
                {t.home.howWeWork.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">{step.title}</span> — {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Formulário (inalterado) */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold tracking-tight text-text-primary">{c.formTitle}</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
