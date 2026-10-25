import { test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { BASE, ROUTES, createCheck, finish, newContext, newPage } from "./support/helpers";

// Background interativo (InteractiveBackground): variante por rota, luz que
// segue o mouse com suavização, nenhum trabalho com o cursor parado, nada em
// touch nem em movimento reduzido, e o conteúdo continua clicável.

const LAYER = ".interactive-bg";

const EXPECTED: Record<string, { variant: string; intensity: string }> = {
  "/": { variant: "glow", intensity: "normal" },
  "/services": { variant: "grid", intensity: "normal" },
  // Rotas comerciais sem configuração própria: padrão discreto.
  "/plans": { variant: "subtle", intensity: "normal" },
  "/build": { variant: "subtle", intensity: "normal" },
  "/how-it-works": { variant: "subtle", intensity: "normal" },
  "/projects": { variant: "subtle", intensity: "normal" },
  "/about": { variant: "subtle", intensity: "normal" },
  "/contact": { variant: "subtle", intensity: "minimal" },
};

const layerState = (page: Page) =>
  page.evaluate((selector) => {
    const layer = document.querySelector<HTMLElement>(selector)!;
    const glow = layer.querySelector<HTMLElement>(".interactive-bg__glow")!;
    const grid = layer.querySelector(".interactive-bg__grid-window")!;
    // Posição escrita pelo componente: translate3d(Xpx, Ypx, 0) inline.
    const [x, y] = (glow.style.transform.match(/-?[\d.]+(?=px)/g) ?? []).map(Number);
    const container = layer.closest("[aria-hidden='true']");
    return {
      variant: layer.dataset.variant,
      intensity: layer.dataset.intensity,
      active: layer.dataset.active ?? null,
      x: x ?? Number.NaN,
      y: y ?? Number.NaN,
      glowOpacity: getComputedStyle(glow).opacity,
      gridDisplay: getComputedStyle(grid).display,
      gridOpacity: getComputedStyle(grid).opacity,
      behindContent: !!container && getComputedStyle(container).pointerEvents === "none" && getComputedStyle(container).zIndex === "-10",
    };
  }, LAYER);

// Conta escritas no estilo das camadas durante `ms` — prova que não há loop
// de animação com o cursor parado.
const styleWritesDuring = (page: Page, ms: number) =>
  page.evaluate(
    ({ selector, ms }) =>
      new Promise<number>((resolve) => {
        let writes = 0;
        const observer = new MutationObserver((records) => (writes += records.length));
        observer.observe(document.querySelector(selector)!, { attributes: true, attributeFilter: ["style"], subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(writes);
        }, ms);
      }),
    { selector: LAYER, ms },
  );

test("background: variante por rota (SSR e cliente iguais)", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  for (const route of ROUTES) {
    const html = await (await context.request.get(BASE + route)).text();
    const expected = EXPECTED[route];
    const ssr = html.includes(`data-variant="${expected.variant}"`) && html.includes(`data-intensity="${expected.intensity}"`);
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const s = await layerState(page);
    check(
      `${route}: ${expected.variant}/${expected.intensity} no HTML do servidor e no cliente, atrás do conteúdo`,
      ssr && s.variant === expected.variant && s.intensity === expected.intensity && s.behindContent,
      { ssr, ...s },
    );
  }
  check("sem erros de console (nenhum hydration mismatch)", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("background: mouse — segue com suavização, para quando o cursor para", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  let s = await layerState(page);
  check("Home: inativo antes do primeiro movimento", s.active === null && s.glowOpacity === "0", s);

  await page.mouse.move(400, 300);
  await page.waitForTimeout(700);
  s = await layerState(page);
  check("primeiro movimento: luz acende sob o cursor", s.active === "true" && s.x === 400 && s.y === 300 && s.glowOpacity === "1", s);

  // Amostra a posição da luz a cada quadro durante o movimento (independe da
  // carga da máquina): com suavização, há posições intermediárias.
  await page.evaluate(() => {
    const glow = document.querySelector<HTMLElement>(".interactive-bg__glow")!;
    const samples: number[] = [];
    (window as Window & { __glowSamples?: number[] }).__glowSamples = samples;
    const started = performance.now();
    const read = () => {
      const x = Number((glow.style.transform.match(/-?[\d.]+(?=px)/) ?? ["NaN"])[0]);
      samples.push(x);
      if (performance.now() - started < 1500) requestAnimationFrame(read);
    };
    requestAnimationFrame(read);
  });
  await page.mouse.move(1100, 650);
  await page.waitForTimeout(1600);
  const samples = await page.evaluate(() => (window as Window & { __glowSamples?: number[] }).__glowSamples ?? []);
  const between = samples.filter((x) => x > 401 && x < 1099);
  check("suavização: a luz passa por posições intermediárias até o cursor", between.length > 0, { intermediarias: between.length, amostras: samples.length });
  s = await layerState(page);
  check("suavização: alcança o cursor e se acomoda", Math.abs(s.x - 1100) < 1 && Math.abs(s.y - 650) < 1, s);

  const idleWrites = await styleWritesDuring(page, 800);
  check("cursor parado: nenhuma escrita de estilo (sem animação contínua)", idleWrites === 0, idleWrites);

  const grid = await layerState(page);
  check("Home: grade do cursor não existe (só em /services)", grid.gridDisplay === "none", grid.gridDisplay);

  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await page.waitForTimeout(700);
  s = await layerState(page);
  check("cursor sai da janela: a luz apaga", s.active === "false" && s.glowOpacity === "0", s);

  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("background: /services grade, /contact mínimo e conteúdo clicável", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });

  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  await page.mouse.move(700, 400);
  await page.mouse.move(720, 420);
  await page.waitForTimeout(800);
  let s = await layerState(page);
  check("/services: grade revelada ao redor do cursor", s.gridDisplay === "block" && s.gridOpacity === "1" && s.glowOpacity === "0.6", s);

  // O primeiro link do índice continua recebendo o clique no ponto exato.
  const target = page.locator('nav a[href="#sites"]');
  const box = (await target.boundingBox())!;
  const hit = await page.evaluate(
    ({ x, y }) => !!document.elementFromPoint(x, y)?.closest('a[href="#sites"]'),
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
  );
  check("/services: link sobre a luz recebe o ponteiro", hit);

  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.mouse.move(800, 400);
  await page.waitForTimeout(800);
  s = await layerState(page);
  check("/contact: intensidade mínima", s.intensity === "minimal" && s.glowOpacity === "0.28", s);

  const name = page.locator('input[placeholder="Seu nome"]');
  await name.click();
  await page.keyboard.type("Teste");
  check("/contact: campo do formulário recebe foco e texto com o efeito ativo", (await name.inputValue()) === "Teste" && (await name.evaluate((el) => el === document.activeElement)));

  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("background: Sidebar recolhida e tema claro", async ({ browser }) => {
  const check = createCheck();
  const context = await newContext(browser, { viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("sidebar-collapsed", "collapsed");
    localStorage.setItem("theme", "light");
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.mouse.move(120, 500);
  await page.mouse.move(130, 510);
  await page.waitForTimeout(800);
  const s = await layerState(page);
  const env = await page.evaluate(() => ({
    sidebar: document.documentElement.dataset.sidebar,
    theme: document.documentElement.dataset.theme,
    // Cor resolvida pelo navegador (o CSS minificado pode escrever o token em hex).
    glow: (() => {
      const probe = document.createElement("div");
      probe.style.color = "var(--pointer-glow)";
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    })(),
  }));
  check("Sidebar recolhida: posição da luz = posição do cursor", env.sidebar === "collapsed" && Math.abs(s.x - 130) < 1 && Math.abs(s.y - 510) < 1, { env, s });
  check("tema claro: luz com token próprio, mais discreta", env.theme === "light" && env.glow === "rgba(37, 99, 235, 0.11)" && s.active === "true", env);
  check("sem erros", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("background: touch e movimento reduzido ficam estáticos", async ({ browser }) => {
  const check = createCheck();

  const touch = await newContext(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const mobile = await touch.newPage();
  await mobile.goto(BASE + "/", { waitUntil: "networkidle" });
  await mobile.touchscreen.tap(200, 400);
  await mobile.mouse.move(150, 300);
  await mobile.waitForTimeout(500);
  const t = await layerState(mobile);
  check("touch: nenhum efeito ligado (sem hover/ponteiro fino)", t.active === null && t.glowOpacity === "0" && Number.isNaN(t.x), t);
  await touch.close();

  const { context, page } = await newPage(browser, 1440, { height: 900, reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.mouse.move(400, 300);
  await page.mouse.move(600, 400);
  await page.waitForTimeout(500);
  const r = await layerState(page);
  check("prefers-reduced-motion: fundo estático, sem seguir o mouse", r.active === null && Number.isNaN(r.x), r);
  await context.close();

  finish(check);
});

test("background: máquina lenta — o efeito se desliga sozinho", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });

  // Simula uma máquina lenta de forma determinística: cada quadro gasta
  // ~30ms na thread principal (abaixo de 30 fps), independente do hardware.
  await page.evaluate(() => {
    const burn = () => {
      const start = performance.now();
      while (performance.now() - start < 30) {
        /* ocupa a thread principal */
      }
      if (!(window as Window & { __stopBurn?: boolean }).__stopBurn) requestAnimationFrame(burn);
    };
    requestAnimationFrame(burn);
  });

  const start = Date.now();
  for (let i = 0; Date.now() - start < 2500; i++) {
    const angle = (i / 30) * Math.PI;
    await page.mouse.move(720 + Math.cos(angle) * 420, 450 + Math.sin(angle) * 260);
    await page.waitForTimeout(16);
  }
  await page.evaluate(() => ((window as Window & { __stopBurn?: boolean }).__stopBurn = true));
  await page.waitForTimeout(800);

  const s = await page.evaluate(() => {
    const layer = document.querySelector<HTMLElement>(".interactive-bg")!;
    return { lowPower: layer.dataset.lowPower ?? null, active: layer.dataset.active ?? null };
  });
  check("quadros lentos (< 40 fps) desligam o efeito: fundo estático", s.lowPower === "true" && s.active === "false", s);

  await page.mouse.move(300, 300);
  await page.mouse.move(320, 320);
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.querySelector<HTMLElement>(".interactive-bg")!.dataset.active ?? null);
  check("depois de desligado, o mouse não reacende a luz", after === "false", after);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});
