"use client";

import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { Award, GraduationCap, Sparkles } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Anos — não fazem parte do conteúdo traduzível (números universais),
// casados por índice com t.certificates.items.
const years = ["2025", "2026", "-", "-", "-", "-"];

export function CertificatesContent() {
  const t = useTranslations();
  const headlineSequence = t.certificates.headlineSequence.flatMap(
    (text) => [text, 2000],
  );

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-background px-6 py-4">
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] md:h-[450px] md:w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div
        className="
          absolute inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex justify-center">
          <span
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-cyan-500/20
              bg-cyan-500/10
              px-4 py-2
              text-sm
              text-accent
            "
          >
            <Sparkles size={16} />
            {t.certificates.badge}
          </span>
        </div>

        <div className="mt-8 text-center">
          <h1 className="min-h-[60px] text-3xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
              <AnimatedHeadline sequence={headlineSequence} />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            {t.certificates.description}
          </p>
        </div>

        <div
          className="
            mx-auto
            mt-6
            max-w-4xl
            rounded-3xl
            border
            border-cyan-500/10
            bg-surface
            p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-4">
            <GraduationCap size={36} className="text-accent" />

            <div>
              <h2 className="font-semibold text-text-primary">
                {t.certificates.formationTitle}
              </h2>

              <p className="text-sm text-text-secondary">
                {t.certificates.formationDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-text-primary">
            {t.certificates.coursesTitle}
          </h2>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {t.certificates.items.map((certificate, index) => (
              <div
                key={certificate.title}
                className="
                  group
                  rounded-3xl
                  border
                  border-border
                  bg-surface
                  p-5
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-500/40
                  hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
                "
              >
                <Award
                  size={28}
                  className="
                    mb-4
                    text-accent
                    transition-transform
                    group-hover:scale-110
                  "
                />

                <h3 className="font-semibold text-text-primary">
                  {certificate.title}
                </h3>

                <p className="mt-2 text-sm text-text-secondary">
                  {certificate.institution}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="
                      rounded-full
                      border
                      border-cyan-500/20
                      bg-cyan-500/10
                      px-3
                      py-1
                      text-xs
                      text-cyan-300
                    "
                  >
                    {certificate.status}
                  </span>

                  <span className="text-xs text-text-secondary">
                    {years[index]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="mb-5 text-2xl font-bold text-text-primary">
            {t.certificates.studyingTitle}
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {t.certificates.studyingItems.map((item) => (
              <span
                key={item}
                className="
                  rounded-2xl
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-4
                  py-2
                  text-sm
                  text-cyan-300
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
