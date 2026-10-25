import { test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { BASE, WA_OFFICIAL, createCheck, finish, headingText, newPage, scrollThrough } from "./support/helpers";

// /about institucional: ordem das seções, H1, foto do fundador, prova visual,
// links reais, CTA final, foto estática, idiomas, tema claro e reduced motion.
// (52 verificações)

// Ordem aprovada: apresentação → fundador → projetos reais → como funciona →
// capacidade técnica → contratar.
const ORDER = ["sobre", "fundador", "construimos", "processo", "tecnologias", "contato"];
const PROJECTS = ["ZLift Manager", "Dieta IA", "Pet Shop Premium", "Barber Shop Premium", "Text To Voice AI", "EasyCar Mobile"];

async function openAbout(
  browser: Browser,
  width: number,
  opts: { reducedMotion?: "reduce"; theme?: "light"; lang?: "en" | "es" } = {},
) {
  const opened = await newPage(browser, width, { height: 900, ...opts });
  await opened.page.goto(BASE + "/about", { waitUntil: "networkidle" });
  return opened;
}

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`/about ${width}px: seções, H1, foto do fundador e reveals`, async ({ browser }) => {
    const check = createCheck();
    const { context, page, errors } = await openAbout(browser, width);
    await scrollThrough(page, 500, 60);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${width}px sem overflow horizontal`, overflow <= 0, `excesso=${overflow}`);

    const order = await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id));
    check(`${width}px ordem das seções`, JSON.stringify(order) === JSON.stringify(ORDER), order);

    const hero = { h1: await headingText(page), count: await page.locator("h1").count() };
    check(`${width}px H1 institucional (único)`, hero.count === 1 && hero.h1.startsWith("Tecnologia para transformar problemas reais"), hero);

    const photo = await page.evaluate(() => {
      const fig = document.querySelector("#fundador figure")!;
      const img = fig.querySelector("img")!;
      const r = fig.getBoundingClientRect();
      return {
        alt: img.alt,
        ratio: +(r.width / r.height).toFixed(2),
        w: Math.round(r.width),
        left: Math.round(r.left),
        right: Math.round(r.right),
        vw: innerWidth,
        caption: fig.querySelector("figcaption")?.textContent ?? "",
      };
    });
    check(
      `${width}px foto do fundador 4:5, dentro da tela, com legenda`,
      photo.alt === "Zenaldo Oliveira" && photo.ratio === 0.8 && photo.left >= 0 && photo.right <= photo.vw && photo.caption.includes("Fundador"),
      photo,
    );

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("main *")].filter(
          (el) => el.children.length === 0 && (el.textContent ?? "").trim() && parseFloat(getComputedStyle(el).opacity) < 0.05,
        ).length,
    );
    check(`${width}px nenhum texto preso invisível após o scroll`, hidden === 0, hidden);
    check(`${width}px sem erros de console`, errors.length === 0, errors.slice(0, 2));

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: test.info().outputPath(`about-${width}-full.png`), fullPage: true });
    await page.screenshot({ path: test.info().outputPath(`about-${width}-hero.png`) });

    await context.close();
    finish(check);
  });
}

test("/about: conteúdo, prova visual, links e CTA final", async ({ browser }) => {
  const check = createCheck();
  const { context, page } = await openAbout(browser, 1440);
  await scrollThrough(page, 500, 60);

  const text = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
  check('sem "Áreas de Interesse" (currículo removido)', !/Áreas de Interesse/i.test(text));
  const proof = await page.evaluate(() => document.getElementById("construimos")?.innerText ?? "");
  check("os 6 projetos reais aparecem na prova visual", PROJECTS.every((p) => proof.includes(p)));
  check(
    "ZLift em destaque (primeiro, com mockup ou screenshot)",
    await page.evaluate(() => {
      const a = document.querySelector("#construimos article");
      return !!a && (a.textContent ?? "").includes("ZLift Manager") && !!a.querySelector("figure, img");
    }),
  );
  const mock = await page.evaluate(() => document.querySelector("#construimos article figure")?.textContent || "");
  check("mockup do ZLift sem números/métricas", !/\d/.test(mock), mock.slice(0, 80));
  const wa = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="https://wa.me"]')].map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
  );
  check(
    `${wa.length} CTAs de WhatsApp com a mensagem oficial, _blank e noopener`,
    wa.length >= 2 && wa.every((l) => l.href === WA_OFFICIAL && l.target === "_blank" && l.rel.includes("noopener")),
    wa.length,
  );
  const internal = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href^='/']")].map((a) => a.getAttribute("href")))]);
  check("links internos só para rotas reais", internal.every((h) => ["/projects", "/services", "/contact", "/how-it-works"].includes(h ?? "")), internal);
  const external = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>("main a[href^='http']")].filter((a) => !a.href.startsWith("https://wa.me")).map((a) => a.href),
  );
  check("único link externo além do WhatsApp é o LinkedIn real", external.length === 1 && external[0].includes("linkedin.com/in/zenaldo-pereira-oliveira"), external);
  const finalCta = await page.evaluate(() => document.getElementById("contato")?.innerText ?? "");
  check("CTA final com o texto pedido", finalCta.includes("Tem um processo que pode ser melhor?") && finalCta.includes("Conte para a ZTech o que sua empresa precisa."));

  // Foto estática: sem animação contínua
  const t1 = await page.evaluate(() => getComputedStyle(document.querySelector("#fundador figure")!).transform);
  await page.waitForTimeout(1500);
  const t2 = await page.evaluate(() => getComputedStyle(document.querySelector("#fundador figure")!).transform);
  check("foto estática (sem flutuação infinita)", t1 === t2 && t1 === "none", { t1, t2 });

  await page.click('#construimos a[href="/projects"] >> nth=0');
  await page.waitForURL(BASE + "/projects");
  check("projeto da lista leva a /projects", page.url().endsWith("/projects"));

  await context.close();
  finish(check);
});

test("/about: idiomas EN/ES, tema claro e reduced motion", async ({ browser }) => {
  const check = createCheck();
  const langs: ["en" | "es", string, string][] = [
    ["en", "Technology that turns real problems", "Who's behind ZTech"],
    ["es", "Tecnología para transformar problemas reales", "Quién está detrás de ZTech"],
  ];
  for (const [lang, h1, founder] of langs) {
    const { context, page, errors } = await openAbout(browser, 1440, { lang });
    await page.waitForTimeout(400);
    const txt = { h1: await headingText(page), founder: (await page.locator("#fundador h2").textContent()) ?? "" };
    check(`${lang.toUpperCase()}: /about traduzido`, txt.h1.startsWith(h1) && txt.founder === founder, txt);
    check(`${lang.toUpperCase()}: sem erros`, errors.length === 0, errors.slice(0, 2));
    await context.close();
  }

  {
    const { context, page, errors } = await openAbout(browser, 1440, { theme: "light" });
    await scrollThrough(page, 500, 60);
    await page.screenshot({ path: test.info().outputPath("about-light-1440-full.png"), fullPage: true });
    check("tema claro sem erros", errors.length === 0, errors.slice(0, 2));
    await context.close();
  }

  {
    const { context, errors } = await openAbout(browser, 390, { reducedMotion: "reduce" });
    check("reduced motion: sem erros de console", errors.length === 0, errors.slice(0, 2));
    await context.close();
  }

  finish(check);
});
