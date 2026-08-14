import Link from "next/link";
import {
  Brain,
  Building2,
  Code2,
  Layers3,
  Plug,
  Workflow,
  ArrowRight,
} from "lucide-react";

const solutions = [
  { icon: Building2, title: "Sistemas Empresariais" },
  { icon: Layers3, title: "SaaS" },
  { icon: Brain, title: "Inteligência Artificial" },
  { icon: Workflow, title: "Automação" },
  { icon: Code2, title: "Sistemas Web" },
  { icon: Plug, title: "Integrações" },
];

export function SolutionsTeaser() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution) => {
          const Icon = solution.icon;

          return (
            <div
              key={solution.title}
              className="group flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <Icon
                size={22}
                className="shrink-0 text-cyan-400 transition-transform group-hover:scale-110"
              />
              <span className="text-sm font-medium text-white">
                {solution.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/services"
          className="flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Ver todos os serviços
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
