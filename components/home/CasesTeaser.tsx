import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";

const cases = [
  {
    title: "🛗 ZLift Manager",
    category: "Plataforma / SaaS",
    description:
      "Plataforma própria que centraliza a operação de empresas de manutenção de elevadores: clientes, técnicos, ordens de serviço e relatórios.",
    status: "Produto próprio",
  },
  {
    title: "🥗 Dieta IA",
    category: "Aplicativo Mobile",
    description:
      "App mobile com Inteligência Artificial (Gemini AI) que gera dietas personalizadas a partir dos dados do usuário.",
    status: "🏆 Projeto Principal",
  },
  {
    title: "🐾 Pet Shop Premium",
    category: "Site Institucional",
    description:
      "Site profissional com integração direta ao WhatsApp para captação de clientes.",
    status: "🌐 Online",
  },
];

export function CasesTeaser() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid gap-4 md:grid-cols-3">
        {cases.map((item) => (
          <div
            key={item.title}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
          >
            <Code2 size={22} className="mb-3 text-cyan-400" />

            <span className="w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {item.category}
            </span>

            <h3 className="mt-3 text-lg font-bold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">{item.description}</p>

            <span className="mt-4 text-xs text-zinc-400">{item.status}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Ver todos os cases
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
