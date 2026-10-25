import { test } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import { getServiceOffer, isOfferCustom } from "../lib/catalog/data";
import { HOME_ENTRIES, HOME_PREVIEWS, getEntryResources, getReceivesRows } from "../lib/catalog/home";
import { BASE, ROUTES, WA_EXISTING_SITE, WA_OFFICIAL, createCheck, finish, headingText, newContext, newPage, scrollThrough } from "./support/helpers";

// Home comercial: ordem das seções, Hero (oferta + demonstração), três
// entradas, prévias reais em abas, o que o cliente recebe (catálogo),
// etapas de contratação, dois caminhos finais, StarBorder, tema claro,
// idiomas e reduced motion.

const SECTION_ORDER = ["inicio", "entradas", "exemplos", "entrega", "processo", "contato"];

// Projetos reais da vitrine do Hero (lib/media/demo.ts → HERO_SHOWCASE), na
// ordem: nome (presente no texto alternativo) e arquivo da captura.
const HERO_PROJECTS = [
  { name: "Barber Shop Premium", file: "barber-shop-premium" },
  { name: "Pet Shop Premium", file: "pet-shop-premium" },
  { name: "Text To Voice AI", file: "text-to-voice-ai" },
  { name: "Cafeteria", file: "cafeteria" },
  { name: "Turismo", file: "turismo" },
] as const;

async function openHome(browser: Browser, width: number, opts: { reducedMotion?: "reduce"; theme?: "light" } = {}) {
  const opened = await newPage(browser, width, { height: 900, ...opts });
  await opened.page.goto(BASE + "/", { waitUntil: "networkidle" });
  return opened;
}

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`Home ${width}px: seções, Hero, reveals e abas`, async ({ browser }) => {
    const check = createCheck();
    const { context, page, errors } = await openHome(browser, width);
    await scrollThrough(page, 500, 60);

    check(`${width}px sem overflow horizontal`, (await overflow(page)) <= 0, await overflow(page));
    const order = await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id));
    check(`${width}px ordem das seções`, JSON.stringify(order) === JSON.stringify(SECTION_ORDER), order);

    const hero = await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      const fr = document.querySelector("#inicio figure")!.getBoundingClientRect();
      return { h1Visible: getComputedStyle(h1).opacity, mockupW: Math.round(fr.width), left: Math.round(fr.left), right: Math.round(fr.right), vw: innerWidth };
    });
    const heroTitle = await headingText(page);
    check(`${width}px H1 do Hero visível`, heroTitle.startsWith("Sites para apresentar sua empresa. Sistemas para facilitar sua operação.") && hero.h1Visible === "1", heroTitle);
    check(`${width}px demonstração visível e dentro da tela`, hero.mockupW > 250 && hero.left >= 0 && hero.right <= hero.vw, hero);

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("main *")].filter((el) => {
          const s = getComputedStyle(el);
          return el.children.length === 0 && (el.textContent ?? "").trim() && parseFloat(s.opacity) < 0.05;
        }).length,
    );
    check(`${width}px nenhum texto preso invisível após o scroll`, hidden === 0, hidden);

    // Abas das prévias: todas visíveis (sem esconder aba na rolagem da lista).
    const tabs = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('#exemplos [role="tab"]')].map((tab) => {
        const r = tab.getBoundingClientRect();
        const list = tab.parentElement!.getBoundingClientRect();
        return r.left >= list.left - 1 && r.right <= list.right + 1;
      }),
    );
    check(`${width}px ${HOME_PREVIEWS.length} abas de exemplos visíveis`, tabs.length === HOME_PREVIEWS.length && tabs.every(Boolean), tabs);

    check(`${width}px sem erros de console`, errors.length === 0, errors.slice(0, 2));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: test.info().outputPath(`home-${width}-full.png`), fullPage: true });
    await page.screenshot({ path: test.info().outputPath(`home-${width}-hero.png`) });

    await context.close();
    finish(check);
  });
}

test("Home: Hero, entradas, prévias, entrega, caminhos e links reais", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440);
  await scrollThrough(page, 500, 60);

  // Hero
  const heroCtas = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("#inicio a")].map((a) => [a.textContent?.trim(), a.getAttribute("href")]));
  check(
    'Hero: "Solicitar proposta" → /build e "Ver projetos reais" → /projects',
    JSON.stringify(heroCtas) === JSON.stringify([["Solicitar proposta", "/build"], ["Ver projetos reais", "/projects"]]),
    heroCtas,
  );
  const demo = await page.evaluate(() => {
    const figure = document.querySelector("#inicio figure")!;
    return {
      text: figure.textContent ?? "",
      video: !!figure.querySelector("video"),
      label: figure.querySelector(".infinite-spiral__stage")?.getAttribute("aria-label"),
      alts: [...figure.querySelectorAll("img")].map((img) => img.alt),
    };
  });
  check(
    "demonstração do Hero: espiral de projetos reais identificada, sem números",
    !demo.video &&
      demo.label === "Projetos reais desenvolvidos pela ZTech" &&
      demo.alts.length === HERO_PROJECTS.length &&
      HERO_PROJECTS.every((project, i) => demo.alts[i]?.includes(project.name)) &&
      !/\d/.test(demo.text),
    demo,
  );

  // Entradas: cartão com imagem identificada, selo, benefício, recursos e CTA.
  const entries = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("#entradas article")].map((card) => ({
      name: card.querySelector("h3")?.textContent,
      badge: card.querySelector('[data-slot="badge"]')?.textContent,
      image: !!card.querySelector("img[alt]") && (card.innerText.includes("Projeto real") || card.innerText.includes("Imagem ilustrativa")),
      resources: card.querySelectorAll("ul li").length,
      cta: [card.querySelector<HTMLAnchorElement>('a[href^="/build"]')?.textContent?.trim(), card.querySelector('a[href^="/build"]')?.getAttribute("href")],
    })),
  );
  check(
    "3 entradas na ordem: Landing pages, Sites empresariais, Sistemas web e automações",
    JSON.stringify(entries.map((e) => e.name)) === JSON.stringify(["Landing pages", "Sites empresariais", "Sistemas web e automações"]),
    entries,
  );
  check(
    "cada entrada com CTA específico para o configurador",
    JSON.stringify(entries.map((e) => e.cta)) ===
      JSON.stringify([["Quero uma landing page", "/build?service=landing"], ["Quero um site empresarial", "/build?service=business-site"], ["Quero um sistema ou automação", "/build"]]),
    entries.map((e) => e.cta),
  );
  check("cada entrada com imagem identificada e recursos do catálogo", entries.every((e, i) => e.image && e.resources === Math.min(4, getEntryResources(HOME_ENTRIES[i]).length)), entries);
  check(
    "selos das entradas vêm do catálogo",
    JSON.stringify(entries.map((e) => e.badge)) === JSON.stringify(HOME_ENTRIES.map((e) => (e.offers.some((id) => isOfferCustom(getServiceOffer(id)!)) ? "Sob medida" : "Disponível"))),
    entries.map((e) => e.badge),
  );
  const systemsCard = await page.locator("#entradas article").nth(2).innerText();
  check("sistemas: recursos não entregues marcados como sob medida", systemsCard.includes("Contatos registrados automaticamente") && systemsCard.includes("· Sob medida"), systemsCard.slice(0, 200));

  // Prévias em abas: projetos reais e o protótipo, sempre identificados.
  for (const [index, preview] of HOME_PREVIEWS.entries()) {
    await page.locator('#exemplos [role="tab"]').nth(index).click();
    await page.waitForTimeout(500);
    const panel = await page.evaluate(() => {
      const p = document.querySelector<HTMLElement>('#exemplos [role="tabpanel"]')!;
      return {
        title: p.querySelector("h3")?.textContent,
        text: p.innerText,
        media: !!p.querySelector("img[alt], [role='img'][aria-label]"),
        similar: p.querySelector<HTMLAnchorElement>('a[href^="/build"]')?.getAttribute("href"),
      };
    });
    const ok =
      preview.kind === "project"
        ? panel.title === preview.project && panel.text.includes("PROJETO REAL")
        : panel.title === "Sistema de gestão de clientes" && panel.text.includes("Imagem ilustrativa") && panel.text.toUpperCase().includes("PROTÓTIPO") && panel.text.includes("Não é um sistema pronto");
    check(`aba ${index + 1} (${preview.id}): identificada, com mídia e "Quero algo parecido"`, ok && panel.media && panel.similar === `/build?service=${preview.similar}`, panel);
  }
  await page.locator('#exemplos [role="tab"]').first().focus();
  await page.keyboard.press("End");
  await page.waitForTimeout(400);
  const lastTab = await page.evaluate(() => document.activeElement?.getAttribute("aria-selected"));
  check("abas navegáveis pelo teclado (End → última aba ativa)", lastTab === "true", lastTab);

  // Entrega: tabela gerada do catálogo, sem preço inventado.
  const rows = getReceivesRows();
  const table = await page.evaluate(() => {
    const t = document.querySelector("#entrega table")!;
    return {
      cols: [...t.querySelectorAll("thead th")].length,
      rows: [...t.querySelectorAll("tbody tr")].map((tr) => [...tr.querySelectorAll("td")].map((td) => (td.textContent ?? "").trim())),
      billing: (t.querySelector("tfoot")?.textContent ?? "").trim(),
      caption: t.querySelector("caption")?.textContent,
    };
  });
  const expected = rows.map((row) => HOME_ENTRIES.map((e) => (row.cells[e.id] === "available" ? "Incluído" : row.cells[e.id] === "custom" ? "Sob medida" : "Não incluído")));
  check(`entrega: tabela com ${rows.length} funcionalidades × 3 entradas, igual ao catálogo`, table.cols === 4 && JSON.stringify(table.rows) === JSON.stringify(expected), table.rows);
  check(
    "entrega: cobrança sob consulta nos sites e escopo nos sistemas, sem R$",
    table.billing.includes("Implantação: Sob consulta") && table.billing.includes("Exige definição de escopo") && !table.billing.includes("R$") && !!table.caption,
    table.billing,
  );

  // Caminhos finais
  const paths = await page.evaluate(() => ({
    titles: [...document.querySelectorAll("#contato h3")].map((h) => h.textContent),
    text: document.getElementById("contato")!.innerText,
    links: [...document.querySelectorAll<HTMLAnchorElement>("#contato a")].map((a) => [a.textContent?.trim(), a.href, a.target]),
  }));
  check('dois caminhos: "Quero criar meu projeto" e "Já tenho um site"', JSON.stringify(paths.titles) === JSON.stringify(["Quero criar meu projeto", "Já tenho um site"]), paths.titles);
  check(
    "criar → configurador; já tenho site → pedido de análise pelo WhatsApp em nova aba; formulário",
    paths.links[0]?.[1] === BASE + "/build" && paths.links[1]?.[0] === "Solicitar análise do meu site" && paths.links[1]?.[1] === WA_EXISTING_SITE && paths.links[1]?.[2] === "_blank" && paths.links[2]?.[1] === BASE + "/contact",
    paths.links,
  );
  check("análise identificada como feita pela equipe, não automática", paths.text.includes("não por uma ferramenta automática"));
  const [whatsappTab] = await Promise.all([context.waitForEvent("page"), page.locator('#contato a[href^="https://wa.me"]').click()]);
  await whatsappTab.close();
  await page.bringToFront();
  await page.waitForTimeout(300);
  const status = await page.locator('#contato [role="status"]').innerText();
  check("feedback após abrir o WhatsApp", status.includes("O WhatsApp foi aberto"), status);

  // Links
  const wa = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="https://wa.me"]')].map((a) => ({ href: a.href, rel: a.rel })));
  check("WhatsApp da Home: mensagem oficial ou de site existente, com noopener", wa.length > 0 && wa.every((l) => [WA_OFFICIAL, WA_EXISTING_SITE].includes(l.href) && l.rel.includes("noopener")), wa);
  const github = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("main a")].filter((a) => a.href.includes("github.com")).length);
  check("Home sem links de GitHub como CTA", github === 0, github);
  const internal = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href^='/'], main a[href^='#']")].map((a) => a.getAttribute("href")))]);
  check(
    "links internos só para rotas/âncoras reais",
    internal.every((h) => ["#entradas", "/build", "/projects", "/plans", "/how-it-works", "/contact"].includes(h ?? "") || /^\/build\?service=[a-z-]+$/.test(h ?? "")),
    internal,
  );

  // StarBorder: Hero, entrega e caminho principal.
  const stars = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("main a.star-border")].map((a) => [a.closest("section")?.id, a.getAttribute("href")]));
  check("StarBorder nos CTAs principais (Hero, entrega, caminho criar) → /build", JSON.stringify(stars) === JSON.stringify([["inicio", "/build"], ["entrega", "/build"], ["contato", "/build"]]), stars);
  const glow = await page.evaluate(() => getComputedStyle(document.querySelector("#inicio .star-border__glow--top")!).animationName);
  check("StarBorder animado sem movimento reduzido", glow === "starBorderTop", glow);

  // Hover na captura das prévias: eleva a janela sem mudar o layout.
  const media = page.locator('#exemplos [role="tabpanel"] .group').first();
  await page.locator('#exemplos [role="tab"]').first().click();
  await page.waitForTimeout(400);
  const before = await media.boundingBox();
  await media.hover();
  await page.waitForTimeout(700);
  const hover = await media.evaluate((el) => ({
    // Tailwind v4: translate-y-* usa a propriedade `translate`, não `transform`.
    lift: parseFloat(getComputedStyle(el.querySelector(".project-media > div")!).translate.split(" ")[1] ?? "0"),
    height: el.getBoundingClientRect().height,
  }));
  check("hover na captura: elevação, mesma altura", hover.lift < 0 && Math.abs(hover.height - (before?.height ?? 0)) < 1, hover);

  await page.click('#inicio a[href="/build"]');
  await page.waitForURL(BASE + "/build");
  check('"Quero criar meu projeto" abre o configurador', page.url().endsWith("/build"));
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

// Espiral do Hero: 5 projetos reais (um por card), pausa que congela a
// posição, laço parado fora da tela e com a aba oculta, e captura estática
// no celular, com movimento reduzido e sem JavaScript.
const spiralMutations = (page: Page, ms: number) =>
  page.evaluate(
    (duration) =>
      new Promise<number>((resolve) => {
        let count = 0;
        const observer = new MutationObserver((list) => (count += list.length));
        document.querySelectorAll(".infinite-spiral__item").forEach((el) => observer.observe(el, { attributes: true, attributeFilter: ["style"] }));
        setTimeout(() => {
          observer.disconnect();
          resolve(count);
        }, duration);
      }),
    ms,
  );
const spiralTransforms = (page: Page) => page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".infinite-spiral__item")].map((el) => el.style.transform).join("|"));
const setTabHidden = (page: Page, hidden: boolean) =>
  page.evaluate((isHidden) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => isHidden });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (isHidden ? "hidden" : "visible") });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);

// Vitrine do Hero no desktop (5 projetos, área de 600px): a área cabe
// inteira no Hero, cards em 16:10 com ≥ 290px de largura em 1440×900 (o
// tamanho calculado para 5 projetos na área é 298px), nenhum card visível
// (opacidade ≥ 0,3) cortado pela moldura, nenhum card passando das laterais;
// além de cima/baixo só os que estão sumindo de propósito nas pontas. Sem
// sobrepor o texto e sem o WhatsApp cobrir cards durante a rolagem.
for (const sidebar of ["aberta", "recolhida"] as const) {
  test(`Home: vitrine do Hero 1440×900 com sidebar ${sidebar} — tamanho, cortes e WhatsApp`, async ({ browser }) => {
    const check = createCheck();
    const opened = await newPage(browser, 1440, { height: 900 });
    if (sidebar === "recolhida") await opened.context.addInitScript(() => localStorage.setItem("sidebar-collapsed", "collapsed"));
    const { context, page, errors } = opened;
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const g = await page.evaluate(async () => {
      const hero = document.getElementById("inicio")!.getBoundingClientRect();
      const text = document.querySelector("#inicio h1")!.parentElement!.getBoundingClientRect();
      const area = document.querySelector(".infinite-spiral")!.getBoundingClientRect();
      let maxW = 0, maxH = 0, worstCut = 0, sideCut = 0, beyondEdgeOpacity = 0;
      const start = performance.now();
      while (performance.now() - start < 3500) {
        for (const card of document.querySelectorAll<HTMLElement>(".infinite-spiral__item")) {
          const opacity = parseFloat(card.style.opacity || "1");
          const r = card.getBoundingClientRect();
          if (opacity >= 0.9 && r.width > maxW) [maxW, maxH] = [r.width, r.height];
          const vertical = Math.max(area.top - r.top, r.bottom - area.bottom, 0);
          const side = Math.max(area.left - r.left, r.right - area.right, 0);
          if (opacity >= 0.3) worstCut = Math.max(worstCut, vertical, side);
          if (opacity > 0.01) sideCut = Math.max(sideCut, side);
          if (vertical > 1) beyondEdgeOpacity = Math.max(beyondEdgeOpacity, opacity);
        }
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return {
        areaInHero: area.top >= hero.top && area.bottom <= hero.bottom,
        maxW: Math.round(maxW),
        ratio: maxW / maxH,
        worstCut: Math.round(worstCut),
        sideCut: Math.round(sideCut),
        beyondEdgeOpacity: Math.round(beyondEdgeOpacity * 100) / 100,
        overlapsText: !(area.left >= text.right || area.right <= text.left || area.top >= text.bottom || area.bottom <= text.top),
      };
    });
    check(`${sidebar}: área da vitrine inteira dentro do Hero`, g.areaInHero, g);
    check(`${sidebar}: maior card ≥ 290px de largura`, g.maxW >= 290, g.maxW);
    check(`${sidebar}: proporção 16:10 preservada`, Math.abs(g.ratio - 1.6) < 0.02, g.ratio);
    check(`${sidebar}: nenhum card visível (≥ 0,3) cortado pela moldura`, g.worstCut <= 1, g.worstCut);
    check(`${sidebar}: nenhum card passa das laterais da moldura`, g.sideCut <= 1, g.sideCut);
    check(`${sidebar}: além de cima/baixo, só cards sumindo (< 0,3)`, g.beyondEdgeOpacity < 0.3, g.beyondEdgeOpacity);
    check(`${sidebar}: vitrine não sobrepõe o texto`, !g.overlapsText);

    const covered = await page.evaluate(async () => {
      const fab = document.querySelector('a.fixed[href^="https://wa.me"]')!;
      const heroBottom = document.getElementById("inicio")!.getBoundingClientRect().bottom + scrollY;
      let worst = 0;
      for (let y = 0; y <= heroBottom; y += 60) {
        window.scrollTo(0, y);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const f = fab.getBoundingClientRect();
        for (const card of document.querySelectorAll<HTMLElement>(".infinite-spiral__item")) {
          if (parseFloat(card.style.opacity || "1") < 0.3) continue;
          const r = card.getBoundingClientRect();
          const ix = Math.min(f.right, r.right) - Math.max(f.left, r.left);
          const iy = Math.min(f.bottom, r.bottom) - Math.max(f.top, r.top);
          if (ix > 0 && iy > 0) worst = Math.max(worst, ix * iy);
        }
      }
      return Math.round(worst);
    });
    check(`${sidebar}: WhatsApp não cobre nenhum card durante a rolagem`, covered === 0, covered);
    check(`${sidebar}: sem erros de console`, errors.length === 0, errors.slice(0, 2));
    await context.close();
    finish(check);
  });
}

test("Home: espiral do Hero (projetos reais, pausa, laço e captura estática)", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440);
  await page.waitForTimeout(800);
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLImageElement>(".infinite-spiral__item img")].map((img) => ({ src: decodeURIComponent(img.getAttribute("src") ?? ""), alt: img.alt })),
  );
  check(
    `${HERO_PROJECTS.length} cards, um por projeto (${HERO_PROJECTS.map((p) => p.name).join(", ")}), com nome e imagem otimizada`,
    cards.length === HERO_PROJECTS.length &&
      HERO_PROJECTS.every((project, i) => cards[i].src.startsWith("/_next/image") && cards[i].src.includes(`media/${project.file}.`) && cards[i].alt.includes(project.name)),
    cards,
  );
  check("laço ativo enquanto visível", (await spiralMutations(page, 800)) > 0);

  await page.click('#inicio figure button[aria-label="Pausar demonstração"]');
  await page.waitForTimeout(150);
  const frozen = await spiralTransforms(page);
  const pausedMutations = await spiralMutations(page, 1000);
  check("pausar: cards parados na posição atual e laço interrompido", pausedMutations === 0 && frozen === (await spiralTransforms(page)), pausedMutations);
  await page.click('#inicio figure button[aria-label="Reproduzir demonstração"]');
  check("reproduzir: movimento retomado", (await spiralMutations(page, 800)) > 0);

  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(400);
  check("fora da tela: laço interrompido", (await spiralMutations(page, 1000)) === 0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  check("de volta à tela: movimento retomado", (await spiralMutations(page, 800)) > 0);

  await setTabHidden(page, true);
  await page.waitForTimeout(150);
  check("aba oculta: laço interrompido", (await spiralMutations(page, 1000)) === 0);
  await setTabHidden(page, false);
  check("aba visível: movimento retomado", (await spiralMutations(page, 800)) > 0);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();

  const staticHero = async (label: string, page: Page) => {
    const r = await page.evaluate(() => ({
      spiral: document.querySelectorAll(".infinite-spiral__item").length,
      alt: document.querySelector("#inicio figure img")?.getAttribute("alt") ?? "",
      frame: document.querySelector("#inicio figure")?.textContent?.includes("Projeto real · Barber Shop Premium") ?? false,
    }));
    check(`${label}: captura estática identificada, sem cards da espiral`, r.spiral === 0 && r.alt.includes("Barber Shop Premium") && r.frame, r);
  };
  const mobile = await newPage(browser, 390, { height: 844 });
  await mobile.page.goto(BASE + "/", { waitUntil: "networkidle" });
  await staticHero("390px", mobile.page);
  await mobile.context.close();
  const reduced = await newPage(browser, 1440, { height: 900, reducedMotion: "reduce" });
  await reduced.page.goto(BASE + "/", { waitUntil: "networkidle" });
  await staticHero("movimento reduzido", reduced.page);
  await reduced.context.close();
  const noJs = await newContext(browser, { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(BASE + "/", { waitUntil: "load" });
  await staticHero("sem JavaScript", noJsPage);
  await noJs.close();
  finish(check);
});

test("Home: tema claro e idiomas EN/ES", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440, { theme: "light" });
  await scrollThrough(page, 500, 60);
  await page.screenshot({ path: test.info().outputPath("home-light-1440-full.png"), fullPage: true });
  check("tema claro sem erros", errors.length === 0, errors.slice(0, 2));

  const langs: [string, string, string][] = [
    ["en", "We build websites, web systems and automations", "I already have a website"],
    ["es", "Creamos sitios, sistemas web y automatizaciones", "Ya tengo un sitio"],
  ];
  for (const [code, h1, existing] of langs) {
    await page.evaluate((c) => localStorage.setItem("language", c), code);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const text = {
      h1: await headingText(page),
      paths: await page.evaluate(() => [...document.querySelectorAll("#contato h3")].map((h) => h.textContent).join(" | ")),
    };
    check(`idioma ${code.toUpperCase()}: Home traduzida`, text.h1.startsWith(h1) && text.paths.includes(existing), text);
  }
  await page.evaluate(() => localStorage.setItem("language", "pt"));

  await context.close();
  finish(check);
});

test("Home: prefers-reduced-motion sem deslocamento e sem erros", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await openHome(browser, 1440, { reducedMotion: "reduce" });
  // Sem rolar: nada da Home pode depender da entrada ao rolar para aparecer.
  const hiddenWithoutScroll = await page.evaluate(
    () =>
      [...document.querySelectorAll("main section[id] *")].filter(
        (el) => el.children.length === 0 && (el.textContent ?? "").trim() && parseFloat(getComputedStyle(el).opacity) < 0.05,
      ).length,
  );
  check("reduced motion: todo o conteúdo visível sem rolar", hiddenWithoutScroll === 0, hiddenWithoutScroll);
  await page.evaluate(() => document.getElementById("processo")!.scrollIntoView());
  await page.waitForTimeout(150);
  const early = await page.evaluate(() => ({
    fill: getComputedStyle(document.querySelector("#processo .origin-left")!).transform,
    stepTransform: getComputedStyle(document.querySelector("#processo ol li")!).transform,
    entry: getComputedStyle(document.querySelector("#entradas li")!).transform,
  }));
  check(
    "reduced motion: sem deslocamento (timeline cheia, etapas e entradas sem translate)",
    (early.fill === "none" || early.fill.startsWith("matrix(1,")) && early.stepTransform === "none" && early.entry === "none",
    early,
  );
  const spiralCards = await page.locator(".infinite-spiral__item").count();
  check("reduced motion: Hero com captura estática, sem espiral", spiralCards === 0, spiralCards);
  const glow = await page.evaluate(() => getComputedStyle(document.querySelector("#inicio .star-border__glow--top")!).animationName);
  check("reduced motion: StarBorder sem animação", glow === "none", glow);
  check("reduced motion: Home sem erros de console (sem #418)", errors.length === 0, errors.slice(0, 2));

  await context.close();
  finish(check);
});

// Entradas ao rolar (Reveal / ProcessSection) só deslocam: nenhum conteúdo
// pode depender da animação para aparecer. Ocultação intencional (slides e
// painéis inativos, marcados com aria-hidden, e os cards nas bordas da
// espiral do Hero, que desaparecem de propósito) não conta.
const countHiddenContent = () =>
  [...document.querySelectorAll("main *")].filter((el) => {
    const hasContent = (el.children.length === 0 && (el.textContent ?? "").trim()) || el.tagName === "IMG";
    if (!hasContent || el.closest("[aria-hidden='true'], .infinite-spiral__item")) return false;
    for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
      if (parseFloat(getComputedStyle(node).opacity) < 0.05) return true;
    }
    return false;
  }).length;

test("Reveal: conteúdo visível sem rolar, após salto (âncora/End), na impressão e sem JavaScript", async ({ browser }) => {
  const check = createCheck();
  const routes = ROUTES.filter((route) => route !== "/build");
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    check(`${route}: visível sem rolar`, (await page.evaluate(countHiddenContent)) === 0);
    await page.keyboard.press("End");
    await page.waitForTimeout(300);
    check(`${route}: visível após a tecla End`, (await page.evaluate(countHiddenContent)) === 0);
    await page.emulateMedia({ media: "print" });
    check(`${route}: visível na impressão`, (await page.evaluate(countHiddenContent)) === 0);
    await page.emulateMedia({ media: "screen" });
  }
  await page.goto(BASE + "/#entradas", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  check("Home: salto por âncora chegou em #entradas", await page.evaluate(() => Math.abs(document.getElementById("entradas")!.getBoundingClientRect().top) < 200));
  check("Home: visível após salto por âncora", (await page.evaluate(countHiddenContent)) === 0);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();

  const noJs = await newContext(browser, { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await noJs.newPage();
  for (const route of routes) {
    await np.goto(BASE + route, { waitUntil: "load" });
    check(`${route}: visível sem JavaScript`, (await np.evaluate(countHiddenContent)) === 0);
  }
  await noJs.close();
  finish(check);
});

// Contraste (WCAG AA) dos textos principais da Home nos dois temas: o fundo
// efetivo é o do primeiro ancestral opaco (ou o do body). Cores convertidas
// via canvas, para aceitar qualquer formato (rgb, oklch, lab...).
const CONTRAST_TARGETS: Record<string, string> = {
  "H1 do Hero": "#inicio h1",
  "rótulo do Hero": "#inicio p.font-mono",
  "descrição do Hero": "#inicio h1 + p",
  "garantias do Hero": "#inicio ul li",
  "legenda da demonstração": "#inicio figcaption",
  "botão de pausa da demonstração": "#inicio figure button",
  "breadcrumb (página atual)": "header [aria-current='page']",
  "H2 de seção": "#entradas h2",
  "rótulo de seção": "#entradas p.font-mono",
  "descrição de seção": "#entradas h2 + p",
  "título de cartão": "#entradas h3",
  "texto de cartão": "#entradas article p",
};

function measureContrast(targets: Record<string, string>) {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const toRgba = (color: string) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const background = (el: Element) => {
    for (let node: Element | null = el; node; node = node.parentElement) {
      const c = toRgba(getComputedStyle(node).backgroundColor);
      if (c.a > 0.5) return c;
    }
    return toRgba(getComputedStyle(document.body).backgroundColor);
  };
  const result: Record<string, number | null> = {};
  for (const [label, selector] of Object.entries(targets)) {
    const el = document.querySelector(selector);
    if (!el) {
      result[label] = null;
      continue;
    }
    const [hi, lo] = [luminance(toRgba(getComputedStyle(el).color)), luminance(background(el))].sort((x, y) => y - x);
    result[label] = Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
  }
  result["luminância do fundo"] = Math.round(luminance(toRgba(getComputedStyle(document.body).backgroundColor)) * 1000) / 1000;
  return result;
}

for (const theme of ["dark", "light"] as const) {
  test(`Home ${theme === "dark" ? "tema escuro" : "tema claro"}: contraste dos títulos, textos e controles`, async ({ browser }) => {
    const check = createCheck();
    const { context, page } = await newPage(browser, 1440, { height: 900, theme });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const r = await page.evaluate(measureContrast, CONTRAST_TARGETS);
    const bg = r["luminância do fundo"] ?? -1;
    check(
      `${theme}: fundo da página no tema certo`,
      theme === "dark" ? bg < 0.02 : bg > 0.9,
      bg,
    );
    for (const label of Object.keys(CONTRAST_TARGETS)) {
      check(`${theme}: ${label} com contraste ≥ 4.5:1`, (r[label] ?? 0) >= 4.5, r[label]);
    }

    // Foco por teclado no primeiro CTA do Hero: anel visível (≥ 3:1).
    await page.locator('#inicio a[href="/build"]').focus();
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return { shadow: getComputedStyle(el).boxShadow, outline: getComputedStyle(el).outlineStyle };
    });
    check(`${theme}: foco visível no CTA do Hero`, ring.shadow !== "none" || ring.outline !== "none", ring);
    await context.close();
    finish(check);
  });
}
