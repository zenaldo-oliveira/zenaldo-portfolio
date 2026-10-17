import { test } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import { BASE, WA_OFFICIAL, createCheck, finish, newContext, scrollThrough } from "./support/helpers";

// Todas as rotas: SEO (H1 estático, metadata), overflow, texto invisível,
// WhatsApp oficial, índice de /services, filtros de /projects, formulário de
// /contact (API de leads SIMULADA — nenhum lead real é criado), reduced
// motion e tema claro. (124 verificações)

// H1 esperado de cada rota (idioma padrão: PT).
const ROUTES: Record<string, string> = {
  "/": "Software que transforma processos",
  "/services": "Construímos soluções digitais",
  "/projects": "Projetos que construímos",
  "/about": "Tecnologia para transformar problemas reais",
  "/contact": "Vamos conversar sobre seu projeto.",
  "/skills": "Capacidades técnicas",
  "/certificates": "Formação e certificações",
};
const PATHS = Object.keys(ROUTES);

const ctx = (browser: Browser, width: number, opts: { reducedMotion?: "reduce"; theme?: "light" } = {}) =>
  newContext(browser, { viewport: { width, height: 900 }, reducedMotion: opts.reducedMotion ?? "no-preference" }).then(async (context) => {
    if (opts.theme) await context.addInitScript((t) => localStorage.setItem("theme", t), opts.theme);
    return context;
  });

const fileName = (route: string) => (route === "/" ? "home" : route.slice(1));

test("SEO: H1 único e estático no HTML do servidor + metadata", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 1440);
  for (const [route, h1] of Object.entries(ROUTES)) {
    const html = await (await context.request.get(BASE + route)).text();
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, ""));
    check(`${route}: H1 único e estático no HTML do servidor`, h1s.length === 1 && h1s[0].includes(h1), h1s);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    check(
      `${route}: title/description/canonical sem tom pessoal`,
      title.includes("ZTech") && desc.length > 40 && canonical.startsWith("https://www.zenaldodev.com.br") && !/freela|Desenvolvedor Full Stack/i.test(title + desc),
      { title, canonical },
    );
  }
  await context.close();
  finish(check);
});

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`${width}px: 7 rotas sem overflow, sem texto invisível e sem erros`, async ({ browser }) => {
    const check = createCheck();
    const context = await ctx(browser, width);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`${page.url()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(e.message));

    for (const route of PATHS) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${width}px ${route}: sem overflow horizontal`, overflow <= 0, `excesso=${overflow}`);
      const hidden = await page.evaluate(
        () =>
          [...document.querySelectorAll("main *")].filter(
            (el) =>
              el.children.length === 0 &&
              (el.textContent ?? "").trim() &&
              parseFloat(getComputedStyle(el).opacity) < 0.05 &&
              !el.closest('[aria-roledescription="slide"]') &&
              !el.closest("[aria-hidden='true']"),
          ).length,
      );
      check(`${width}px ${route}: nenhum texto preso invisível`, hidden === 0, hidden);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: test.info().outputPath(`${fileName(route)}-${width}-full.png`), fullPage: true });
      }
    }
    check(`${width}px: sem erros de console em nenhuma rota`, errors.length === 0, errors.slice(0, 2));

    await context.close();
    finish(check);
  });
}

test("WhatsApp: todos os CTAs com a mensagem oficial, _blank e noopener", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 1440);
  const page = await context.newPage();
  for (const route of PATHS) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const links = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me"]')].map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
    );
    const bad = links.filter((l) => l.href !== WA_OFFICIAL || l.target !== "_blank" || !l.rel.includes("noopener"));
    check(`${route}: ${links.length} links de WhatsApp com a mensagem oficial, _blank e noopener`, links.length > 0 && bad.length === 0, bad.slice(0, 2));
  }
  await context.close();
  finish(check);
});

test("/services: catálogo de 7 soluções e índice com âncoras", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 1440);
  const page = await context.newPage();
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  const n = await page.evaluate(() => document.querySelectorAll("main article[id]").length);
  check("/services: 7 soluções no catálogo", n === 7, n);
  await page.click('nav a[href="#integracoes"]');
  await page.waitForTimeout(900);
  const top = await page.evaluate(() => Math.round(document.getElementById("integracoes")!.getBoundingClientRect().top));
  check("/services: índice rola até a solução (abaixo da Top Bar)", top >= 56 && top < 200, top);
  await context.close();
  finish(check);
});

test("/projects: filtro por categoria", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 1440);
  const page = await context.newPage();
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  const count = () => page.evaluate(() => document.querySelectorAll('[aria-roledescription="slide"]').length);

  check("/projects: 6 cases com filtro 'Todos'", (await count()) === 6);
  await page.click('button[aria-pressed]:has-text("Aplicativo Mobile")');
  await page.waitForTimeout(500);
  const names = await page.evaluate(() => [...document.querySelectorAll('[aria-roledescription="slide"]')].map((s) => s.getAttribute("aria-label")));
  check("/projects: filtro 'Aplicativo Mobile' → Dieta IA e EasyCar", names.length === 2 && names.join().includes("Dieta IA") && names.join().includes("EasyCar Mobile"), names);
  check("/projects: botão do filtro ativo com aria-pressed", await page.evaluate(() => document.querySelector('button[aria-pressed="true"]')?.textContent === "Aplicativo Mobile"));
  await page.click('button[aria-pressed]:has-text("Ferramenta Web")');
  await page.waitForTimeout(500);
  const single = await page.evaluate(() => ({
    slides: document.querySelectorAll('[aria-roledescription="slide"]').length,
    arrows: document.querySelectorAll('[aria-roledescription="carousel"] button[aria-label="Próximo projeto"]').length,
  }));
  check("/projects: filtro com 1 case esconde setas/indicadores", single.slides === 1 && single.arrows === 0, single);
  await page.click('button[aria-pressed]:has-text("Todos")');
  await page.waitForTimeout(500);
  check("/projects: voltar para 'Todos' → 6", (await count()) === 6);

  await context.close();
  finish(check);
});

async function submitContactForm(page: Page) {
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.fill('input[placeholder="Seu nome"]', "Teste Validação");
  await page.fill('input[placeholder="Seu WhatsApp (com DDD)"]', "65999999999");
  await page.fill('input[placeholder="Seu e-mail"]', "teste@example.com");
  await page.fill('textarea[placeholder="Descreva seu projeto..."]', "Mensagem de teste.");
  await page.click('form button[type="submit"]');
  await page.waitForTimeout(1200);
}

test("/contact: formulário (API de leads simulada) — sucesso e erro", async ({ browser }) => {
  const check = createCheck();
  const cases: [string, number, object][] = [["sucesso", 200, { success: true }], ["erro", 500, { error: "x" }]];
  for (const [mode, status, body] of cases) {
    const context = await ctx(browser, 1440);
    await context.route("**/api/leads", (r) => r.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }));
    const page = await context.newPage();
    page.on("popup", (p) => {
      p.close().catch(() => {});
    });
    await submitContactForm(page);
    if (mode === "sucesso") {
      const link = await page.evaluate(() => [...document.querySelectorAll("form a[href^='https://wa.me']")].map((a) => (a.textContent ?? "").trim()));
      check("/contact: formulário (sucesso) mostra 'Abrir conversa no WhatsApp'", link.some((t) => t.includes("Abrir conversa no WhatsApp")), link);
    } else {
      const err = await page.evaluate(() => document.querySelector("form")?.innerText ?? "");
      check("/contact: formulário (erro) mostra mensagem de erro", err.includes("Não foi possível registrar"), err.slice(0, 80));
      const fallback = await page.evaluate(() => {
        const link = document.querySelector<HTMLAnchorElement>('form [role="alert"] a[href^="https://wa.me/5565992832422"]');
        const text = link ? decodeURIComponent(new URL(link.href).searchParams.get("text") ?? "") : "";
        return { label: link?.textContent?.trim() ?? null, target: link?.target, carriesData: text.includes("Teste Validação") && text.includes("teste@example.com") && text.includes("Mensagem de teste.") };
      });
      check("/contact: formulário (erro) oferece WhatsApp com os dados preenchidos, sem dizer que salvou", fallback.label === "Enviar pelo WhatsApp" && fallback.target === "_blank" && fallback.carriesData && !err.includes("registrado"), fallback);
      const kept = await page.evaluate(() => (document.querySelector<HTMLInputElement>('input[placeholder="Seu nome"]')?.value ?? ""));
      check("/contact: formulário (erro) preserva os campos preenchidos", kept === "Teste Validação", kept);
    }
    await context.close();
  }
  finish(check);
});

test("reduced motion: 7 rotas sem erros de console", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 390, { reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${page.url()}: ${m.text().slice(0, 60)}`);
  });
  for (const route of PATHS) await page.goto(BASE + route, { waitUntil: "networkidle" });
  check("reduced motion: 7 rotas sem erros de console (sem #418)", errors.length === 0, errors.slice(0, 3));
  await context.close();
  finish(check);
});

test("tema claro: 7 rotas sem erros (com prints)", async ({ browser }) => {
  const check = createCheck();
  const context = await ctx(browser, 1440, { theme: "light" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of PATHS) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await scrollThrough(page);
    await page.screenshot({ path: test.info().outputPath(`light-${fileName(route)}-1440-full.png`), fullPage: true });
  }
  check("tema claro: 7 rotas sem erros", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});
