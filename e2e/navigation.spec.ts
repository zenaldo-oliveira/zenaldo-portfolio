import { test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { BASE, ROUTES, WA_OFFICIAL, WIDTHS, createCheck, finish, newPage, settle } from "./support/helpers";

// Navegação global: Sidebar (desktop e drawer mobile), Top Bar, menu ⋮
// (idioma/tema), recolhimento persistido, links de WhatsApp, âncoras, rodapé,
// PageBackground e prefers-reduced-motion. (184 verificações)

const active = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim().slice(0, 40),
      label: el?.getAttribute("aria-label"),
      role: el?.getAttribute("role"),
      inSidebar: !!el?.closest("#sidebar"),
    };
  });

const drawerState = (page: Page) =>
  page.evaluate(() => {
    const btn = document.querySelector('button[aria-controls="sidebar"][aria-label]');
    const sb = document.getElementById("sidebar")!;
    const r = sb.getBoundingClientRect();
    return {
      expanded: btn?.getAttribute("aria-expanded") ?? null,
      inert: sb.inert,
      overflow: document.body.style.overflow,
      sidebarX: Math.round(r.x),
      sidebarW: Math.round(r.width),
      visibility: getComputedStyle(sb).visibility,
    };
  });

const isVisible = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && r.right > 0 && r.left < innerWidth;
  }, selector);

const navLabels = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("#sidebar nav a span.truncate")].map((s) => s.textContent).slice(0, 5).join(" "),
  );

for (const width of WIDTHS) {
  test(`responsividade ${width}px: rotas, Sidebar, Top Bar e H1`, async ({ browser }) => {
    const check = createCheck();
    const { context, page, errors } = await newPage(browser, width);

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${width}px ${route}: sem overflow horizontal`, overflow <= 0, `excesso=${overflow}px`);
    }

    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const desktop = width >= 1024;
    const sidebarVisible = await isVisible(page, "#sidebar");
    const hamburger = await isVisible(page, 'header button[aria-controls="sidebar"]');
    const breadcrumb = await isVisible(page, "header nav ol");
    const topbarCta = await isVisible(page, 'header a[href^="https://wa.me"]');
    const topbarLogo = await isVisible(page, 'header a[href="/"][aria-label]');
    check(`${width}px sidebar ${desktop ? "fixa visível" : "fora da tela (drawer fechado)"}`, sidebarVisible === desktop);
    check(`${width}px hamburger ${desktop ? "oculto" : "visível"}`, hamburger === !desktop);
    check(`${width}px breadcrumb ${desktop ? "visível" : "oculto"}`, breadcrumb === desktop);
    check(`${width}px logo na Top Bar ${desktop ? "oculto (está na sidebar)" : "visível"}`, topbarLogo === !desktop);
    check(`${width}px CTA da Top Bar ${width >= 640 ? "visível" : "oculto (flutuante cobre)"}`, topbarCta === width >= 640);
    const h1 = await page.locator("h1").first().textContent();
    check(`${width}px H1 presente`, !!h1?.trim(), h1?.trim().slice(0, 40));
    if (desktop) {
      const layout = await page.evaluate(() => ({
        sidebar: Math.round(document.getElementById("sidebar")!.getBoundingClientRect().width),
        mainLeft: Math.round(document.getElementById("conteudo")!.getBoundingClientRect().left),
      }));
      check(`${width}px conteúdo começa após a sidebar`, layout.mainLeft === layout.sidebar && layout.sidebar === 240, layout);
    }
    await page.screenshot({ path: test.info().outputPath(`home-${width}.png`) });
    check(`${width}px sem erros de console`, errors.length === 0, errors.slice(0, 2).join(" | "));

    await context.close();
    finish(check);
  });
}

test("Sidebar desktop: navegação, item ativo, breadcrumb e grupo Mais", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const items: [string, string][] = [
    ["/services", "Soluções"], ["/projects", "Cases"], ["/about", "Sobre"], ["/contact", "Contato"],
    ["/skills", "Habilidades"], ["/certificates", "Certificados"], ["/", "Início"],
  ];
  for (const [href, label] of items) {
    await page.click(`#sidebar nav a[href="${href}"]`);
    await page.waitForURL(BASE + href);
    await settle(page, 200);
    const info = await page.evaluate(() => {
      const cur = [...document.querySelectorAll('#sidebar nav a[aria-current="page"]')].map((a) => a.getAttribute("href"));
      const crumb = document.querySelector('header nav li[aria-current="page"]')?.textContent;
      return { cur, crumb };
    });
    check(`sidebar → ${href}: único ativo + breadcrumb "${label}"`, info.cur.length === 1 && info.cur[0] === href && info.crumb === label, info);
  }

  const more = await page.evaluate(() => [...document.querySelectorAll("#sidebar nav p")].map((p) => p.textContent));
  check('grupo "Mais" presente na sidebar', more.includes("Mais"), more);
  const hover = await page.evaluate(() => getComputedStyle(document.querySelector('#sidebar nav a[href="/about"]')!).backgroundColor);
  await page.hover('#sidebar nav a[href="/about"]');
  await settle(page, 250);
  const hoverAfter = await page.evaluate(() => getComputedStyle(document.querySelector('#sidebar nav a[href="/about"]')!).backgroundColor);
  check("hover suave altera o fundo do item", hover !== hoverAfter, { antes: hover, depois: hoverAfter });
  check("navegação sem erros de console", errors.length === 0, errors.slice(0, 2).join(" | "));

  await context.close();
  finish(check);
});

test("Sidebar desktop: recolher, persistência sem flash e expandir", async ({ browser }) => {
  const check = createCheck();
  const { context, page } = await newPage(browser, 1280);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const btn = page.locator('#sidebar button[aria-controls="sidebar"]');
  check("botão recolher: aria-expanded=true (aberta)", (await btn.getAttribute("aria-expanded")) === "true");
  await btn.click();
  await settle(page);
  const collapsed = await page.evaluate(() => ({
    attr: document.documentElement.dataset.sidebar,
    w: Math.round(document.getElementById("sidebar")!.getBoundingClientRect().width),
    main: Math.round(document.getElementById("conteudo")!.getBoundingClientRect().left),
    labelW: Math.round(document.querySelector('#sidebar nav a[href="/about"] span')!.getBoundingClientRect().width),
  }));
  check("recolhida: 64px, conteúdo acompanha, rótulos ocultos", collapsed.attr === "collapsed" && collapsed.w === 64 && collapsed.main === 64 && collapsed.labelW <= 1, collapsed);
  await page.screenshot({ path: test.info().outputPath("sidebar-collapsed-1280.png") });

  // Recarrega e mede ANTES da hidratação (domcontentloaded) — sem flash/shift.
  await page.goto(BASE + "/about", { waitUntil: "domcontentloaded" });
  const early = await page.evaluate(() => ({
    attr: document.documentElement.dataset.sidebar,
    w: Math.round(document.getElementById("sidebar")!.getBoundingClientRect().width),
  }));
  check("recolhida persiste no primeiro paint (sem deslocamento)", early.attr === "collapsed" && early.w === 64, early);
  await page.waitForLoadState("networkidle");
  await page.locator('#sidebar button[aria-controls="sidebar"]').click();
  await settle(page);
  const expanded = await page.evaluate(() => ({
    attr: document.documentElement.dataset.sidebar ?? null,
    w: Math.round(document.getElementById("sidebar")!.getBoundingClientRect().width),
  }));
  check("expandir volta a 240px", expanded.attr === null && expanded.w === 240, expanded);

  await context.close();
  finish(check);
});

test("menu ⋮ (desktop): teclado, Esc, clique fora, Tab, idioma e tema", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const trigger = page.locator('#sidebar button[aria-haspopup="menu"]');
  check("⋮ fechado: aria-expanded=false", (await trigger.getAttribute("aria-expanded")) === "false");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await settle(page, 250);
  check("⋮ abre com Enter: aria-expanded=true + role=menu", (await trigger.getAttribute("aria-expanded")) === "true" && (await page.locator('[role="menu"]').count()) === 1);
  let a = await active(page);
  check("foco inicial no idioma marcado (Português)", a.role === "menuitemradio" && a.text.startsWith("Português"), a);
  await page.keyboard.press("ArrowDown");
  a = await active(page);
  check("ArrowDown → English", a.text.startsWith("English"), a);
  await page.keyboard.press("End");
  a = await active(page);
  check("End → último item (recolher barra)", a.role === "menuitemcheckbox", a);
  await page.keyboard.press("Home");
  a = await active(page);
  check("Home → primeiro item", a.text.startsWith("Português"), a);
  await page.keyboard.press("ArrowUp");
  a = await active(page);
  check("ArrowUp no primeiro → volta ao último (loop)", a.role === "menuitemcheckbox", a);
  await page.keyboard.press("Escape");
  await settle(page, 250);
  a = await active(page);
  check("Esc fecha e devolve o foco ao ⋮", (await trigger.getAttribute("aria-expanded")) === "false" && a.text.includes("Preferências"), a);
  await trigger.click();
  await settle(page, 250);
  await page.mouse.click(900, 400);
  await settle(page, 250);
  check("clique fora fecha", (await trigger.getAttribute("aria-expanded")) === "false" && (await page.locator('[role="menu"]').count()) === 0);
  await trigger.click();
  await settle(page, 250);
  await page.keyboard.press("Tab");
  await settle(page, 250);
  check("Tab fecha o menu", (await trigger.getAttribute("aria-expanded")) === "false");

  // Idioma via teclado
  await trigger.click();
  await settle(page, 250);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await settle(page, 250);
  const en = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    cta: document.querySelector('header a[href^="https://wa.me"]')?.textContent?.trim(),
    open: !!document.querySelector('[role="menu"]'),
  }));
  const enNav = await navLabels(page);
  check("EN: html lang=en, sidebar e CTA traduzidos, menu segue aberto", en.lang === "en" && enNav === "Home Solutions Cases About Contact" && en.cta === "Talk to ZTech" && en.open, { ...en, nav: enNav });
  await page.click('[role="menuitemradio"]:has-text("Español")');
  await settle(page, 250);
  const es = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    trig: document.querySelector('#sidebar button[aria-haspopup="menu"]')!.textContent!.trim(),
  }));
  const esNav = await navLabels(page);
  check("ES: html lang=es, sidebar traduzida", es.lang === "es" && esNav === "Inicio Soluciones Casos Nosotros Contacto" && es.trig === "Preferencias", { ...es, nav: esNav });
  await page.click('[role="menuitemradio"]:has-text("Português")');
  await settle(page, 250);
  const ptLang = await page.evaluate(() => document.documentElement.lang);
  const ptNav = await navLabels(page);
  check("PT: de volta, html lang=pt-BR", ptLang === "pt-BR" && ptNav === "Início Soluções Cases Sobre Contato", { lang: ptLang, nav: ptNav });
  await page.screenshot({ path: test.info().outputPath("menu-open-1440.png") });

  // Tema
  await page.click('[role="menuitemradio"]:has-text("Claro")');
  await settle(page, 250);
  const light = await page.evaluate(() => ({
    attr: document.documentElement.dataset.theme,
    stored: localStorage.getItem("theme"),
    bg: getComputedStyle(document.body).backgroundColor,
    checked: [...document.querySelectorAll('[role="menuitemradio"][aria-checked="true"]')].map((e) => (e.textContent ?? "").trim()),
  }));
  check("tema Claro aplicado e marcado", light.attr === "light" && light.stored === "light" && light.bg === "rgb(248, 250, 252)" && light.checked.includes("Claro"), light);
  await page.keyboard.press("Escape");
  await page.screenshot({ path: test.info().outputPath("home-light-1440.png") });
  await page.reload({ waitUntil: "domcontentloaded" });
  const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
  check("tema claro persiste após recarregar (antes da hidratação)", persisted === "light", persisted);
  await page.waitForLoadState("networkidle");
  await trigger.click();
  await settle(page, 250);
  await page.click('[role="menuitemradio"]:has-text("Escuro")');
  await settle(page, 250);
  const dark = await page.evaluate(() => ({ attr: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor }));
  check("tema Escuro restaurado", dark.attr === "dark" && dark.bg === "rgb(8, 12, 20)", dark); // --background do tema escuro (#080c14)
  check("menu ⋮ sem erros de console", errors.length === 0, errors.slice(0, 2).join(" | "));

  await context.close();
  finish(check);
});

for (const width of [360, 390, 768]) {
  test(`drawer mobile ${width}px: abrir, foco preso, Esc, overlay, ⋮, navegação e resize`, async ({ browser }) => {
    const check = createCheck();
    const { context, page, errors } = await newPage(browser, width);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const hamb = page.locator('header button[aria-controls="sidebar"]');

    let s = await drawerState(page);
    check(`${width}px drawer fechado: aria-expanded=false, inert, invisível`, s.expanded === "false" && s.inert && s.visibility === "hidden", s);
    await hamb.focus();
    await page.keyboard.press("Enter");
    await settle(page);
    s = await drawerState(page);
    check(`${width}px Enter abre: aria-expanded=true, sem inert, scroll lock, painel em x=0`, s.expanded === "true" && !s.inert && s.overflow === "hidden" && s.sidebarX === 0, s);
    let a = await active(page);
    check(`${width}px foco vai para dentro do drawer`, a.inSidebar, a);

    // Tab preso
    let escaped = false;
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      if (!(await active(page)).inSidebar) escaped = true;
    }
    check(`${width}px Tab preso no drawer (16 tabs)`, !escaped);
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Shift+Tab");
      if (!(await active(page)).inSidebar) escaped = true;
    }
    check(`${width}px Shift+Tab preso no drawer`, !escaped);
    if (width === 390) await page.screenshot({ path: test.info().outputPath("drawer-open-390.png") });

    await page.keyboard.press("Escape");
    await settle(page);
    s = await drawerState(page);
    a = await active(page);
    check(`${width}px Esc fecha, libera scroll e devolve foco ao botão`, s.expanded === "false" && s.inert && s.overflow === "" && a.label === "Abrir menu", { s, a });

    // clique fora
    await hamb.click();
    await settle(page);
    await page.mouse.click(width - 10, 400);
    await settle(page);
    s = await drawerState(page);
    a = await active(page);
    check(`${width}px clique no overlay fecha e devolve foco`, s.expanded === "false" && s.overflow === "" && a.label === "Abrir menu", { s, a });

    // botão fechar interno
    await hamb.click();
    await settle(page);
    await page.click('#sidebar button[aria-label="Fechar menu"]');
    await settle(page);
    s = await drawerState(page);
    check(`${width}px botão X interno fecha`, s.expanded === "false", s);

    // flutuante não fica por cima do drawer aberto
    await hamb.click();
    await settle(page);
    const top = await page.evaluate(() => {
      const fab = document.querySelector('body > a[href^="https://wa.me"], a.fixed[href^="https://wa.me"]')!;
      const r = fab.getBoundingClientRect();
      const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return el?.closest('a[href^="https://wa.me"]') === fab ? "flutuante" : el?.id || el?.getAttribute("aria-hidden") || el?.tagName;
    });
    check(`${width}px botão flutuante fica abaixo do drawer/overlay`, top !== "flutuante", top);

    // ⋮ dentro do drawer: Esc fecha só o menu
    await page.click('#sidebar button[aria-haspopup="menu"]');
    await settle(page, 250);
    const menuFits = await page.evaluate(() => {
      const r = document.querySelector('[role="menu"]')!.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), vw: innerWidth };
    });
    check(`${width}px ⋮ no drawer cabe na tela`, menuFits.left >= 0 && menuFits.right <= menuFits.vw && menuFits.top >= 0, menuFits);
    const displayGroup = await page.locator('[role="menuitemcheckbox"]').isVisible();
    check(`${width}px opção "recolher barra" oculta no mobile`, !displayGroup);
    await page.keyboard.press("Escape");
    await settle(page, 250);
    s = await drawerState(page);
    check(`${width}px Esc no ⋮ fecha só o menu (drawer segue aberto)`, s.expanded === "true" && (await page.locator('[role="menu"]').count()) === 0, s);

    // navegação fecha o drawer
    await page.click('#sidebar nav a[href="/about"]');
    await page.waitForURL(BASE + "/about");
    await settle(page);
    s = await drawerState(page);
    check(`${width}px link do drawer navega e fecha`, s.expanded === "false" && s.overflow === "", s);

    // resize para desktop fecha
    await hamb.click();
    await settle(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await settle(page);
    s = await drawerState(page);
    check(`${width}px → 1280px: drawer fecha e libera scroll`, s.overflow === "" && !s.inert && s.sidebarX === 0, s);
    check(`${width}px drawer sem erros de console`, errors.length === 0, errors.slice(0, 2).join(" | "));

    await context.close();
    finish(check);
  });
}

test("links do WhatsApp em / e /contact (390 e 1440px)", async ({ browser }) => {
  const check = createCheck();
  for (const width of [390, 1440]) {
    const { context, page } = await newPage(browser, width);
    for (const route of ["/", "/contact"]) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const links = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me"]')].map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
      );
      const bad = links.filter((l) => l.href !== new URL(l.href).href || !l.href.startsWith("https://wa.me/5565992832422") || l.target !== "_blank" || !l.rel.includes("noopener"));
      const defaults = links.filter((l) => l.href === WA_OFFICIAL);
      check(`${width}px ${route}: ${links.length} links WhatsApp (_blank, noopener, número oficial)`, links.length > 0 && bad.length === 0, bad);
      check(`${width}px ${route}: todos com a mensagem oficial`, defaults.length === links.length, `${defaults.length}/${links.length}`);
    }
    await context.close();
  }
  finish(check);
});

test("âncoras da Home ficam abaixo da Top Bar", async ({ browser }) => {
  const check = createCheck();
  const { context, page } = await newPage(browser, 1440);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  for (const id of ["problemas", "solucoes", "cases", "processo", "ia", "tecnologias", "contato"]) {
    await page.evaluate((i) => (location.hash = i), id);
    await settle(page, 300);
    const top = await page.evaluate((i) => Math.round(document.getElementById(i)!.getBoundingClientRect().top), id);
    check(`âncora #${id} não fica atrás da Top Bar`, top >= 56, `top=${top}`);
  }
  await context.close();
  finish(check);
});

test("rodapé, botão flutuante e PageBackground", async ({ browser }) => {
  const check = createCheck();
  for (const width of [360, 390]) {
    const { context, page } = await newPage(browser, width);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(page, 300);
    const o = await page.evaluate(() => {
      const fab = document.querySelector('a.fixed[href^="https://wa.me"]')!.getBoundingClientRect();
      const copy = [...document.querySelectorAll("footer p")].find((p) => (p.textContent ?? "").includes("©"))!.getBoundingClientRect();
      const overlap = !(fab.right < copy.left || fab.left > copy.right || fab.bottom < copy.top || fab.top > copy.bottom);
      return { overlap, copyright: copy.width > 0 };
    });
    check(`${width}px flutuante não cobre o © do rodapé`, !o.overlap && o.copyright, o);
    await page.screenshot({ path: test.info().outputPath(`footer-${width}.png`) });
    await context.close();
  }

  const { context, page } = await newPage(browser, 1440);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const bg = await page.evaluate(() => {
    const el = document.querySelector("body > div[aria-hidden='true'].fixed")!;
    const cs = getComputedStyle(el);
    return {
      exists: !!el,
      position: cs.position,
      z: cs.zIndex,
      pointer: cs.pointerEvents,
      canvas: document.querySelectorAll("canvas").length,
      heroBg: getComputedStyle(document.getElementById("inicio")!).backgroundColor,
    };
  });
  check("PageBackground fixo, atrás do conteúdo, sem eventos; sem canvas de partículas", bg.exists && bg.position === "fixed" && bg.z === "-10" && bg.pointer === "none" && bg.canvas === 0 && bg.heroBg === "rgba(0, 0, 0, 0)", bg);
  await context.close();
  finish(check);
});

test("prefers-reduced-motion: drawer sem transição e funcional", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 390, { reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const dur = await page.evaluate(() => getComputedStyle(document.getElementById("sidebar")!).transitionDuration);
  check("reduced motion: drawer sem transição", dur.split(",").every((d) => parseFloat(d) === 0 || d.trim() === "0s" || parseFloat(d) < 0.001), dur);
  await page.click('header button[aria-controls="sidebar"]');
  await settle(page, 100);
  const s = await drawerState(page);
  check("reduced motion: drawer abre funcional", s.expanded === "true" && s.sidebarX === 0, s);
  check("reduced motion sem erros", errors.length === 0, errors.slice(0, 2).join(" | "));
  await context.close();
  finish(check);
});
