import { expect, test } from "@playwright/test";
import type { Browser, BrowserContext, BrowserContextOptions, Page } from "@playwright/test";

// Utilitários compartilhados pelas suítes E2E.

export const BASE = `http://localhost:${process.env.E2E_PORT ?? 3920}`;

export const WIDTHS = [360, 390, 768, 1024, 1280, 1440];
export const ROUTES = ["/", "/services", "/plans", "/build", "/how-it-works", "/projects", "/about", "/contact"];

// Projetos reais cadastrados em lib/projects/data.ts, na mesma ordem. Lista
// explícita (os testes não importam a aplicação: os dados importam imagens
// .webp que o Node não carrega) — se o cadastro mudar, este é o lugar a
// revisar, e os testes de /projects passam a acusar a diferença.
export const PROJECT_TITLES = [
  "ZLift Manager",
  "Dieta IA",
  "Pet Shop Premium",
  "Barber Shop Premium",
  "Text To Voice AI",
  "EasyCar Mobile",
  "Cafeteria",
  "Turismo",
] as const;

// Mensagem oficial do WhatsApp (lib/contact/whatsapp.ts).
export const WA_MESSAGE =
  "Olá! Conheci a ZTech pelo site e gostaria de conversar sobre um projeto para minha empresa.";
export const WA_OFFICIAL = new URL(`https://wa.me/5565992832422?text=${encodeURIComponent(WA_MESSAGE)}`).href;

// Home, caminho "Já tenho um site": mensagem contextual própria.
export const WA_EXISTING_SITE = new URL(
  `https://wa.me/5565992832422?text=${encodeURIComponent("Olá! Já tenho um site e gostaria de solicitar uma análise da ZTech. Endereço do site:")}`,
).href;

export type Check = ((name: string, ok: unknown, detail?: unknown) => void) & {
  count: () => number;
};

// Cada verificação vira uma asserção "soft": o teste continua e lista todas as
// falhas, com o mesmo nome/detalhe usados nas suítes originais. Ao final,
// `finish()` registra quantas verificações o teste executou (somadas pelo
// checks-reporter para provar a cobertura total).
export function createCheck(): Check {
  let total = 0;
  const check = ((name: string, ok: unknown, detail: unknown = "") => {
    total += 1;
    const suffix = detail === "" || detail === undefined ? "" : ` — ${typeof detail === "string" ? detail : JSON.stringify(detail)}`;
    expect.soft(Boolean(ok), `${name}${suffix}`).toBe(true);
  }) as Check;
  check.count = () => total;
  return check;
}

export function finish(check: Check) {
  test.info().annotations.push({ type: "checks", description: String(check.count()) });
}

// Contexto isolado que nunca abre o WhatsApp de verdade.
export async function newContext(browser: Browser, options: BrowserContextOptions = {}): Promise<BrowserContext> {
  const context = await browser.newContext(options);
  await context.route("https://wa.me/**", (route) => route.abort());
  return context;
}

// Página com coleta de erros de console e exceções não tratadas.
export async function newPage(
  browser: Browser,
  width: number,
  opts: { height?: number; reducedMotion?: "reduce" | "no-preference"; theme?: "light" | "dark"; lang?: "pt" | "en" | "es" } = {},
) {
  const context = await newContext(browser, {
    viewport: { width, height: opts.height ?? 800 },
    reducedMotion: opts.reducedMotion ?? "no-preference",
  });
  if (opts.theme) await context.addInitScript((t) => localStorage.setItem("theme", t), opts.theme);
  if (opts.lang) await context.addInitScript((l) => localStorage.setItem("language", l), opts.lang);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return { context, page, errors };
}

// Rola a página inteira para disparar as animações de entrada (whileInView).
export async function scrollThrough(page: Page, step = 500, pause = 50, settleMs = 900) {
  await page.evaluate(
    async ({ step, pause }) => {
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, pause));
      }
      window.scrollTo(0, 0);
    },
    { step, pause },
  );
  await page.waitForTimeout(settleMs);
}

export const settle = (page: Page, ms = 350) => page.waitForTimeout(ms);

// Texto do título como o leitor de tela recebe: sem a camada visual da
// animação (letras com aria-hidden do AnimatedH1), com espaços normalizados.
export const headingText = (page: Page, selector = "h1") =>
  page.locator(selector).first().evaluate((heading) => {
    const copy = heading.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
    return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
  });
