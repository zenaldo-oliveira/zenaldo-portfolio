import { test } from "@playwright/test";
import { BASE, ROUTES, createCheck, finish, newContext } from "./support/helpers";

// Identidade visual: PageBackground em fallback CSS (sem vídeo), contraste
// WCAG dos tokens nos dois temas, Top Bar transparente → vidro ao rolar e
// fundo mais discreto no mobile. (18 verificações)

for (const theme of ["dark", "light"] as const) {
  test(`tema ${theme}: fundo, contraste dos tokens e Top Bar`, async ({ browser }) => {
    const check = createCheck();
    const context = await newContext(browser, { viewport: { width: 1440, height: 900 } });
    await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await context.newPage();
    const media: string[] = [];
    page.on("request", (r) => {
      if (/\.(mp4|webm)(\?|$)/.test(r.url())) media.push(r.url());
    });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });

    const fb = await page.evaluate(() => {
      const bg = document.querySelector("body > div[aria-hidden='true'].fixed")!;
      const base = bg.querySelector(".page-background__base");
      return {
        video: !!bg.querySelector("video"),
        base: !!base,
        grid: !!bg.querySelector(".page-background__grid"),
        baseBg: !!base && getComputedStyle(base).backgroundImage.startsWith("radial-gradient"),
      };
    });
    check(`${theme}: fallback CSS ativo (sem <video>, base + grid)`, !fb.video && fb.base && fb.grid && fb.baseBg, fb);
    check(`${theme}: nenhum arquivo de vídeo requisitado`, media.length === 0, media);

    // Contraste WCAG entre os tokens (alpha composto sobre o fundo).
    const c = await page.evaluate(() => {
      const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).map(Number);
      const lum = ([r, g, b]: number[]) =>
        [r, g, b]
          .map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          })
          .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0);
      const blend = (fg: number[], bg: number[]) => {
        const a = fg[3] ?? 1;
        return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
      };
      const contrast = (fg: string, bg: string, under: string) => {
        let b = parse(bg);
        if ((b[3] ?? 1) < 1) b = blend(b, parse(under));
        const f = blend(parse(fg), b);
        const [l1, l2] = [lum(f), lum(b)].sort((x, y) => y - x);
        return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
      };
      const cs = getComputedStyle(document.documentElement);
      const token = (name: string) => cs.getPropertyValue(name).trim();
      const probe = (color: string) => {
        const d = document.createElement("div");
        d.style.color = color;
        document.body.appendChild(d);
        const resolved = getComputedStyle(d).color;
        d.remove();
        return resolved;
      };
      const bg = probe(token("--background"));
      const surface = probe(token("--surface"));
      const strong = probe(token("--surface-strong"));
      const out: Record<string, { background: number; surface: number; surfaceStrong: number }> = {};
      for (const tk of ["--text-primary", "--text-secondary", "--text-muted", "--accent"]) {
        const fg = probe(token(tk));
        out[tk] = { background: contrast(fg, bg, bg), surface: contrast(fg, surface, bg), surfaceStrong: contrast(fg, strong, bg) };
      }
      return { tokens: out, ctaWhite: contrast("rgb(255, 255, 255)", probe(token("--cta")), bg) };
    });
    const min = (o: { background: number; surface: number; surfaceStrong: number }) => Math.min(o.background, o.surface, o.surfaceStrong);
    check(`${theme}: texto principal ≥ 7:1`, min(c.tokens["--text-primary"]) >= 7, c.tokens["--text-primary"]);
    check(`${theme}: texto secundário ≥ 4.5:1`, min(c.tokens["--text-secondary"]) >= 4.5, c.tokens["--text-secondary"]);
    check(`${theme}: texto muted ≥ 4.5:1`, min(c.tokens["--text-muted"]) >= 4.5, c.tokens["--text-muted"]);
    check(`${theme}: accent ≥ 4.5:1`, min(c.tokens["--accent"]) >= 4.5, c.tokens["--accent"]);
    check(`${theme}: branco sobre CTA ≥ 4.5:1`, c.ctaWhite >= 4.5, c.ctaWhite);

    // Top Bar: transparente no topo, vidro após rolar
    const headerStyle = () =>
      page.evaluate(() => {
        const s = getComputedStyle(document.querySelector("header")!);
        return { bg: s.backgroundColor, blur: s.backdropFilter, border: s.borderBottomColor };
      });
    const top = await headerStyle();
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(350);
    const scrolled = await headerStyle();
    check(
      `${theme}: Top Bar transparente no topo e com vidro após rolar`,
      top.bg === "rgba(0, 0, 0, 0)" && top.blur === "none" && scrolled.bg !== "rgba(0, 0, 0, 0)" && scrolled.blur.includes("blur"),
      { top, scrolled },
    );
    await page.screenshot({ path: test.info().outputPath(`${theme}-home-scrolled-1440.png`) });
    await page.evaluate(() => window.scrollTo(0, 0));

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.screenshot({ path: test.info().outputPath(`${theme}-${route === "/" ? "home" : route.slice(1)}-1440.png`) });
    }

    await context.close();
    finish(check);
  });
}

test("mobile: brilhos do fundo reduzidos (390 e 360px)", async ({ browser }) => {
  const check = createCheck();
  for (const width of [390, 360]) {
    const context = await newContext(browser, { viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const op = await page.evaluate(() => getComputedStyle(document.querySelector(".page-background__base")!).opacity);
    check(`${width}px: brilhos do fundo reduzidos no mobile`, op === "0.7", op);
    await page.screenshot({ path: test.info().outputPath(`dark-home-${width}.png`) });
    await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
    await page.locator('[aria-roledescription="carousel"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: test.info().outputPath(`dark-projects-${width}.png`) });
    await context.close();
  }
  finish(check);
});
