import { test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { BASE, PROJECT_TITLES, createCheck, finish, newContext } from "./support/helpers";

// Carrossel de /projects (Embla): slide central, vizinhos, setas, loop,
// indicadores, teclado, arraste, links reais preservados e reduced motion.

// Projetos reais cadastrados (PROJECT_TITLES, na ordem de
// lib/projects/data.ts); o rótulo de cada slide é "N de TOTAL: título".
const TOTAL = PROJECT_TITLES.length;
const slideLabel = (n: number) => `${n} de ${TOTAL}: ${PROJECT_TITLES[n - 1]}`;

// Links reais de lib/projects/data.ts — devem continuar todos lá, sem extras.
// (Os CTAs de WhatsApp dos cards são verificados em pages.spec.ts.)
const EXPECTED_LINKS = [
  "https://expo.dev/accounts/zenaldo/projects/Dieta-mobile/builds/95262f1b-a2c4-4227-8709-fa5574c90d8d",
  "https://github.com/zenaldo-oliveira/dietaapp-mobile",
  "https://petshop-zenaldo.netlify.app/",
  "https://github.com/zenaldo-oliveira/petshop-blad",
  "https://barber-premium-site.netlify.app/",
  "https://github.com/zenaldo-oliveira/BARBER",
  "https://conversortxt.netlify.app/",
  "https://github.com/zenaldo-oliveira/Text-to-Voice",
  "https://github.com/zenaldo-oliveira/Frontend-easycar-mobile",
];

const CAROUSEL = '[aria-roledescription="carousel"]';

test("carrossel /projects: todos os projetos reais, na ordem, uma única vez", async ({ browser }) => {
  const check = createCheck();
  const context = await newContext(browser, { viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('[aria-roledescription="carousel"] [aria-roledescription="slide"]')].map((s) => s.getAttribute("aria-label") ?? ""),
  );
  const expected = PROJECT_TITLES.map((_, i) => slideLabel(i + 1));
  check(`${TOTAL} slides com os projetos cadastrados, na ordem`, JSON.stringify(labels) === JSON.stringify(expected), labels);
  check("cada projeto aparece uma única vez", new Set(PROJECT_TITLES).size === TOTAL && new Set(labels).size === labels.length, labels);
  await context.close();
  finish(check);
});

const info = (page: Page) =>
  page.evaluate(() => {
    const region = document.querySelector('[aria-roledescription="carousel"]')!;
    const slides = [...region.querySelectorAll('[aria-roledescription="slide"]')];
    const vw = innerWidth;
    const boxes = slides.map((s) => {
      const r = s.firstElementChild!.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
        label: s.getAttribute("aria-label") ?? "",
        op: getComputedStyle(s.firstElementChild!).opacity,
      };
    });
    const center = boxes.filter((b) => b.left < vw / 2 && b.right > vw / 2);
    const visible = boxes.filter((b) => b.right > 0 && b.left < vw);
    return {
      center: center.map((c) => c.label),
      activeDot: region.querySelector('button[aria-current="true"]')?.getAttribute("aria-label") ?? undefined,
      live: region.querySelector("[aria-live]")?.textContent ?? undefined,
      visibleCount: visible.length,
      centerW: center[0]?.w ?? 0,
      vw,
      centerOpacity: center[0]?.op,
    };
  });

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`carrossel /projects ${width}px: navegação, teclado, arraste e links`, async ({ browser }) => {
    const check = createCheck();
    const context = await newContext(browser, { viewport: { width, height: 900 }, hasTouch: width <= 768 });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
    await page.locator(CAROUSEL).scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${width}px sem overflow horizontal`, overflow <= 0, `excesso=${overflow}`);

    let s = await info(page);
    check(`${width}px 1º projeto centralizado e ativo`, s.center[0] === slideLabel(1) && s.activeDot?.includes("1:"), s);
    const ratio = s.centerW / s.vw;
    const expectPeek = width >= 768;
    check(
      `${width}px card ${expectPeek ? "reduzido com vizinhos parcialmente visíveis" : "um por vez, dentro da largura"}`,
      expectPeek ? s.visibleCount >= 3 && ratio < 0.6 : ratio <= 0.9 && s.centerW < width,
      { visibleCount: s.visibleCount, ratio: ratio.toFixed(2) },
    );
    await page.screenshot({ path: test.info().outputPath(`projects-${width}.png`) });

    // Próximo / anterior
    await page.click(`${CAROUSEL} button[aria-label="Próximo projeto"]`);
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px "Próximo" → projeto 2`, s.center[0] === slideLabel(2) && s.live?.includes(`2 de ${TOTAL}`) && s.live?.includes(PROJECT_TITLES[1]), s);
    await page.click(`${CAROUSEL} button[aria-label="Projeto anterior"]`);
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px "Anterior" → projeto 1`, s.center[0] === slideLabel(1), s.center);
    await page.click(`${CAROUSEL} button[aria-label="Projeto anterior"]`);
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px loop: anterior do 1º → último projeto (${TOTAL})`, s.center[0] === slideLabel(TOTAL), s.center);

    // Indicador
    await page.click(`${CAROUSEL} button[aria-label^="Ir para o projeto 4"]`);
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px indicador → projeto 4`, s.center[0] === slideLabel(4) && s.activeDot?.includes("4:"), s);

    // Teclado: foco no botão "Próximo" + setas
    await page.focus(`${CAROUSEL} button[aria-label="Próximo projeto"]`);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px teclado → avança (5)`, s.center[0] === slideLabel(5), s.center);
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(700);
    s = await info(page);
    check(`${width}px teclado ← volta (4)`, s.center[0] === slideLabel(4), s.center);

    // Arraste (eventos de ponteiro)
    const vp = await page.evaluate(() => {
      const r = document.querySelector('[aria-roledescription="carousel"] .overflow-hidden')!.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height * 0.35 };
    });
    await page.mouse.move(vp.x, vp.y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(vp.x - i * 22, vp.y, { steps: 1 });
    await page.mouse.up();
    await page.waitForTimeout(900);
    s = await info(page);
    check(`${width}px arraste para a esquerda → projeto 5`, s.center[0] === slideLabel(5), s.center);

    // Links preservados
    const links = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('[aria-roledescription="carousel"] a[href]:not([href^="https://wa.me"])')].map((a) => ({
        href: a.href,
        target: a.target,
        rel: a.rel,
      })),
    );
    const hrefs = [...new Set(links.map((l) => l.href))];
    const missing = EXPECTED_LINKS.filter((u) => !hrefs.includes(u));
    const extra = hrefs.filter((u) => !EXPECTED_LINKS.includes(u));
    check(`${width}px todos os links reais presentes (sem extras)`, missing.length === 0 && extra.length === 0, { missing, extra });
    check(`${width}px links com _blank + noopener`, links.every((l) => l.target === "_blank" && l.rel.includes("noopener")));
    check(`${width}px sem erros de console`, errors.length === 0, errors.slice(0, 2));

    await context.close();
    finish(check);
  });
}

test("carrossel /projects: prefers-reduced-motion troca instantânea", async ({ browser }) => {
  const check = createCheck();
  const context = await newContext(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  await page.locator(CAROUSEL).scrollIntoViewIfNeeded();
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('[aria-roledescription="slide"]')!.firstElementChild!).transitionDuration);
  check("reduced motion: escala/opacidade sem transição", parseFloat(dur) < 0.001, dur);
  await page.click(`${CAROUSEL} button[aria-label="Próximo projeto"]`);
  await page.waitForTimeout(80);
  const s = await info(page);
  check("reduced motion: troca instantânea (projeto 2 em <80ms)", s.center[0] === slideLabel(2), s.center);
  await context.close();
  finish(check);
});
