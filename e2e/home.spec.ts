import { test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { BASE, WA_OFFICIAL, createCheck, finish, newPage, scrollThrough } from "./support/helpers";

// Home: ordem das seções, Hero (H1 + mockup do produto), reveals, carrossel,
// conteúdo sem números inventados, links, tema claro, idiomas e reduced
// motion. (54 verificações)

const SECTION_ORDER = ["inicio", "capacidades", "problemas", "solucoes", "produto", "cases", "processo", "tecnologias", "ia", "contato"];

async function openHome(browser: Browser, width: number, opts: { reducedMotion?: "reduce"; theme?: "light" } = {}) {
  const opened = await newPage(browser, width, { height: 900, ...opts });
  await opened.page.goto(BASE + "/", { waitUntil: "networkidle" });
  return opened;
}

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`Home ${width}px: seções, Hero, reveals e carrossel`, async ({ browser }) => {
    const check = createCheck();
    const { context, page, errors } = await openHome(browser, width);
    await scrollThrough(page, 500, 60);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${width}px sem overflow horizontal`, overflow <= 0, `excesso=${overflow}`);

    const order = await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id));
    check(`${width}px ordem das seções`, JSON.stringify(order) === JSON.stringify(SECTION_ORDER), order);

    const hero = await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      const r = h1.getBoundingClientRect();
      const fr = document.querySelector("#inicio figure")!.getBoundingClientRect();
      return {
        h1: h1.textContent ?? "",
        h1Top: Math.round(r.top),
        h1Visible: getComputedStyle(h1).opacity,
        mockupW: Math.round(fr.width),
        mockupLeft: Math.round(fr.left),
        mockupRight: Math.round(fr.right),
        vw: innerWidth,
      };
    });
    check(`${width}px H1 do Hero visível`, hero.h1.startsWith("Software que transforma") && hero.h1Visible === "1", hero.h1);
    check(`${width}px mockup do produto visível e dentro da tela`, hero.mockupW > 250 && hero.mockupLeft >= 0 && hero.mockupRight <= hero.vw, hero);

    // Reveals: nada deve ficar invisível após rolar a página
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("main *")].filter((el) => {
          const s = getComputedStyle(el);
          return el.children.length === 0 && (el.textContent ?? "").trim() && parseFloat(s.opacity) < 0.05 && el.closest('[aria-roledescription="slide"]') === null;
        }).length,
    );
    check(`${width}px nenhum texto preso invisível após o scroll`, hidden === 0, hidden);

    // Carrossel da Home
    await page.locator("#cases").scrollIntoViewIfNeeded();
    await page.click('#cases button[aria-label="Próximo projeto"]');
    await page.waitForTimeout(700);
    const live = await page.evaluate(() => document.querySelector("#cases [aria-live]")?.textContent ?? "");
    check(`${width}px carrossel da Home avança`, live.includes("2 de 6"), live);

    check(`${width}px sem erros de console`, errors.length === 0, errors.slice(0, 2));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: test.info().outputPath(`home-${width}-full.png`), fullPage: true });
    await page.screenshot({ path: test.info().outputPath(`home-${width}-hero.png`) });

    await context.close();
    finish(check);
  });
}

test("Home: conteúdo sem dados inventados e links reais", async ({ browser }) => {
  const check = createCheck();
  const { context, page } = await openHome(browser, 1440);
  await scrollThrough(page, 500, 60);

  const mock = await page.evaluate(() => document.querySelector("#inicio figure")?.textContent ?? "");
  check("mockup do Hero sem números/métricas (só rótulos reais)", !/\d/.test(mock.replace("ZLift", "")), mock.slice(0, 160));
  const flow = await page.evaluate(() => document.querySelector("#produto ol")?.textContent ?? "");
  check("fluxo do ZLift só com etapas reais", flow.includes("Ordens de serviço") && flow.includes("Assinatura") && flow.includes("Relatório"));
  const wa = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="https://wa.me"]')].map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
  );
  check(
    `${wa.length} CTAs de WhatsApp na Home com a mensagem oficial, _blank e noopener`,
    wa.length > 0 && wa.every((l) => l.href === WA_OFFICIAL && l.target === "_blank" && l.rel.includes("noopener")),
    wa.length,
  );
  const github = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("main a")].filter((a) => a.href.includes("github.com")).length);
  check("Home sem links de GitHub como CTA", github === 0, github);
  const internal = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href^='/'], main a[href^='#']")].map((a) => a.getAttribute("href")))]);
  check("links internos só para rotas/âncoras reais", internal.every((h) => ["/projects", "/services", "/contact", "#cases"].includes(h ?? "")), internal);
  await page.click('#inicio a[href="#cases"]');
  await page.waitForTimeout(900);
  const casesTop = await page.evaluate(() => Math.round(document.getElementById("cases")!.getBoundingClientRect().top));
  check('"Explorar projetos" leva à seção de cases (abaixo da Top Bar)', casesTop >= 56 && casesTop < 200, casesTop);

  await context.close();
  finish(check);
});

test("Home: tema claro e idiomas EN/ES", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440, { theme: "light" });
  await scrollThrough(page, 500, 60);
  await page.screenshot({ path: test.info().outputPath("home-light-1440-full.png"), fullPage: true });
  check("tema claro sem erros", errors.length === 0, errors.slice(0, 2));

  const langs: [string, string][] = [["en", "Software that turns"], ["es", "Software que transforma procesos"]];
  for (const [code, h1] of langs) {
    await page.evaluate((c) => localStorage.setItem("language", c), code);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const text = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent ?? "",
      strip: (document.querySelector("#capacidades")?.textContent ?? "").slice(0, 60),
    }));
    check(`idioma ${code.toUpperCase()}: Home traduzida`, text.h1.startsWith(h1), text);
  }
  await page.evaluate(() => localStorage.setItem("language", "pt"));

  await context.close();
  finish(check);
});

test("Home: prefers-reduced-motion sem deslocamento e sem erros", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440, { reducedMotion: "reduce" });
  await page.evaluate(() => document.getElementById("processo")!.scrollIntoView());
  await page.waitForTimeout(150);
  const early = await page.evaluate(() => ({
    fill: getComputedStyle(document.querySelector("#processo .origin-left")!).transform,
    stepTransform: getComputedStyle(document.querySelector("#processo ol li")!).transform,
  }));
  check(
    "reduced motion: sem deslocamento (timeline cheia, etapas sem translate)",
    (early.fill === "none" || early.fill.startsWith("matrix(1,")) && early.stepTransform === "none",
    early,
  );
  await page.waitForTimeout(1200);
  const late = await page.evaluate(() => getComputedStyle(document.querySelector("#processo ol li:last-child")!).opacity);
  check("reduced motion: etapas visíveis após o fade (opacidade permitida)", late === "1", late);
  check("reduced motion: Home sem erros de console (sem #418)", errors.length === 0, errors.slice(0, 2));

  await context.close();
  finish(check);
});
