import { test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { ADDONS, EXTERNAL_COSTS, getOfferPricing, getServiceOffer, isOfferCustom, PLANS, PLANS_SHOWCASE, SOLUTIONS } from "../lib/catalog/data";
import { formatPrice, quoteSelection } from "../lib/catalog/pricing";
import { BASE, createCheck, finish, headingText, newPage } from "./support/helpers";

// Área comercial: catálogo (cálculo puro), Soluções, Planos, Montar meu
// projeto, Como funciona e Dúvidas. As verificações de preço derivam do
// próprio catálogo: valor confirmado aparece em R$, null aparece como
// "Solicitar proposta" (Planos) ou "Sob consulta" (resumo) — o teste
// acompanha quando um preço for confirmado.

const WA_NUMBER = "5565992832422";
const CUSTOM = SOLUTIONS.filter((s) => s.availability === "custom").map((s) => s.id);
const AVAILABLE = SOLUTIONS.filter((s) => s.availability === "available").map((s) => s.id);
const CONFIRMED_PRICES =
  PLANS.flatMap((p) => [p.pricing.setup, p.pricing.monthly]).filter((v) => v !== null).length +
  ADDONS.flatMap((a) => [a.pricing.setup, a.pricing.monthly]).filter((v) => v !== null).length;

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test("catálogo: cálculo puro com whitelist e escopo", () => {
  const check = createCheck();

  const mixed = quoteSelection({ solutionId: "sites", featureIds: ["sites-landing", "crm-pipeline", "inexistente"], addonIds: ["extra-pages", "training", "x"] });
  check(
    "ids de outra solução, adicionais fora do plano e ids desconhecidos são ignorados",
    !!mixed &&
      JSON.stringify(mixed.lines.map((l) => `${l.kind}:${l.id}`)) === JSON.stringify(["plan:sites", "feature:sites-landing", "addon:extra-pages"]),
    mixed?.lines.map((l) => `${l.kind}:${l.id}`),
  );
  check("solução desconhecida não gera orçamento", quoteSelection({ solutionId: "nope" as never, featureIds: [], addonIds: [] }) === null);

  for (const id of CUSTOM) {
    const q = quoteSelection({ solutionId: id, featureIds: [], addonIds: [] });
    check(`${id}: sob encomenda exige escopo e não tem total`, !!q && q.requiresScope && q.totals.setup === null && q.totals.monthly === null, q);
  }
  const anyUnpriced = quoteSelection({ solutionId: "sites", featureIds: ["sites-landing"], addonIds: ["extra-pages"] })!;
  const hasNull = anyUnpriced.lines.some((l) => l.pricing.setup === null);
  check("total nunca é soma parcial: com item sem valor, o total é null", !hasNull || anyUnpriced.totals.setup === null, anyUnpriced.totals);
  check('formatPrice: null → "Sob consulta"; número → BRL', formatPrice(null, "pt-BR", "Sob consulta") === "Sob consulta" && formatPrice(1500, "pt-BR", "x").includes("1.500"));
  check("todo plano pertence a uma solução disponível", PLANS.every((p) => AVAILABLE.includes(p.solutionId)));
  finish(check);
});

test("/services: 7 soluções com público, inclusões, contratação e CTAs reais", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });

  const articles = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main article[id]")].map((a) => ({
      id: a.id,
      text: a.innerText,
      links: [...a.querySelectorAll<HTMLAnchorElement>("a")].map((l) => l.getAttribute("href") ?? ""),
    })),
  );
  check("7 soluções, na ordem do catálogo", JSON.stringify(articles.map((a) => a.id)) === JSON.stringify(SOLUTIONS.map((s) => s.id)), articles.map((a) => a.id));
  for (const a of articles) {
    const isCustom = CUSTOM.includes(a.id as (typeof CUSTOM)[number]);
    // Rótulos em caixa alta via CSS: innerText devolve o texto transformado.
    const labels = ["Para quem serve", "O que pode incluir", "Como contratar"].every((l) => a.text.toUpperCase().includes(l.toUpperCase()));
    check(`${a.id}: público, inclusões e como contratar`, labels, a.text.slice(0, 80));
    check(
      `${a.id}: selo ${isCustom ? "Sob medida + exige escopo, sem plano" : "Disponível + link do plano"}`,
      isCustom
        ? a.text.includes("Sob medida") && a.text.includes("Exige definição de escopo") && !a.links.some((h) => h.startsWith("/plans"))
        : a.text.includes("Disponível") && a.links.includes(`/plans#plan-${a.id}`),
      a.links,
    );
    check(`${a.id}: "Montar meu projeto" leva ao fluxo com a solução marcada`, a.links.includes(`/build?solution=${a.id}`), a.links);
  }
  check("sem preço em R$ inventado na página", !(await page.evaluate(() => document.body.innerText.includes("R$"))) || CONFIRMED_PRICES > 0);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("/services#sites: carrossel de capturas reais — setas, indicadores, teclado, arraste e movimento reduzido", async ({ browser }) => {
  const check = createCheck();
  const sites = SOLUTIONS.find((s) => s.id === "sites")!;
  const titles = sites.projects;
  const state = (page: Page) =>
    page.evaluate(() => {
      const region = document.querySelector<HTMLElement>('#sites [aria-roledescription="carousel"]');
      if (!region) return null;
      const imgs = [...region.querySelectorAll<HTMLImageElement>("img")];
      const visible = imgs.filter((i) => getComputedStyle(i).opacity === "1");
      const canvas = region.querySelector("canvas");
      return {
        imgs: imgs.length,
        visibleAlt: visible.map((i) => i.alt),
        hiddenAria: imgs.filter((i) => i !== visible[0]).every((i) => i.getAttribute("aria-hidden") === "true" && i.alt === ""),
        links: [...region.querySelectorAll<HTMLAnchorElement>("a")].map((a) => ({ href: a.href, target: a.target, rel: a.rel, label: a.getAttribute("aria-label") })),
        canvas: canvas && { opacity: getComputedStyle(canvas).opacity, aria: canvas.getAttribute("aria-hidden"), pe: getComputedStyle(canvas).pointerEvents },
        live: region.querySelector("[aria-live]")?.textContent ?? "",
        current: [...region.querySelectorAll("button[aria-current]")].map((b) => b.getAttribute("aria-label")),
      };
    });

  // Servidor: HTML estável com a 1ª captura e sem a 2ª montada.
  {
    const context = await browser.newContext();
    const html = await (await context.request.get(BASE + "/services")).text();
    const start = html.indexOf('<article id="sites"');
    const sitesHtml = start < 0 ? "" : html.slice(start, html.indexOf("</article>", start));
    const imgCount = (sitesHtml.match(/<img /g) ?? []).length;
    check(
      "HTML do servidor: carrossel só com a 1ª captura (sem canvas visível)",
      sitesHtml.includes('aria-roledescription="carousel"') && sitesHtml.includes(titles[0]!) && imgCount === 1,
      { len: sitesHtml.length, imgCount },
    );
    await context.close();
  }

  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  const others = await page.evaluate(() => [...document.querySelectorAll("#detalhes article[id]:not(#sites)")].map((a) => !!a.querySelector('[aria-hidden="true"] [data-zoom]')));
  check("os outros 6 serviços mantêm a ilustração decorativa", others.length === 6 && others.every(Boolean), others);
  await page.locator("#sites").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  let s = await state(page);
  check("carrossel presente com rótulo próprio", !!s);
  check("1ª captura visível, nome e link Ver site", s?.visibleAlt.length === 1 && s.visibleAlt[0]!.includes(titles[0]!) && s.links.length === 1 && s.links[0]!.label?.includes(titles[0]!), s);
  check("link externo seguro (_blank + noopener noreferrer)", s?.links[0]?.target === "_blank" && /noopener/.test(s.links[0].rel) && /noreferrer/.test(s.links[0].rel), s?.links);
  check("perto da tela: a próxima captura já está montada (só ela)", s?.imgs === Math.min(2, titles.length), s?.imgs);
  check("canvas decorativo: aria-hidden, sem cliques, oculto em repouso", s?.canvas?.aria === "true" && s.canvas.pe === "none" && s.canvas.opacity === "0", s?.canvas);

  // Seta: transição pixelada (canvas visível) e depois imagem nítida.
  await page.getByRole("button", { name: "Próximo projeto" }).click();
  const during = await page.evaluate(() => getComputedStyle(document.querySelector("#sites canvas")!).opacity);
  await page.waitForTimeout(500);
  s = await state(page);
  check("seta: canvas aparece durante a troca", during === "1", during);
  check("seta: 2ª captura nítida ao final (canvas oculto)", s?.visibleAlt[0]?.includes(titles[1]!) && s.canvas?.opacity === "0", s);
  check("inativa sem alt e com aria-hidden; anúncio da captura ativa", s?.hiddenAria && s.live.includes(titles[1]!) && s.links.length === 1 && s.links[0]!.label?.includes(titles[1]!), s);

  // Indicador e teclado (apenas dentro do carrossel).
  await page.getByRole("button", { name: new RegExp(`Ir para o projeto 1: ${titles[0]}`) }).click();
  await page.waitForTimeout(400);
  s = await state(page);
  check("indicador: volta à 1ª captura e marca aria-current", s?.visibleAlt[0]?.includes(titles[0]!) && s.current.length === 1 && s.current[0]!.includes(titles[0]!), s?.current);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  s = await state(page);
  check("tecla →: avança com o foco no carrossel", s?.visibleAlt[0]?.includes(titles[1]!), s?.visibleAlt);
  await page.locator("body").focus();
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(300);
  s = await state(page);
  check("tecla ← fora do carrossel não troca a captura", s?.visibleAlt[0]?.includes(titles[1]!), s?.visibleAlt);
  check("sem estouro horizontal", (await overflow(page)) <= 0);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();

  // Movimento reduzido: troca imediata, canvas nunca aparece.
  {
    const { context, page, errors } = await newPage(browser, 1440, { height: 900, reducedMotion: "reduce" });
    await page.goto(BASE + "/services", { waitUntil: "networkidle" });
    await page.locator("#sites").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "Próximo projeto" }).click();
    const r = await page.evaluate(() => ({ canvas: getComputedStyle(document.querySelector("#sites canvas")!).opacity }));
    const st = await state(page);
    check("movimento reduzido: troca imediata, sem canvas", r.canvas === "0" && st?.visibleAlt[0]?.includes(titles[1]!), { r, alt: st?.visibleAlt });
    check("movimento reduzido: sem erros de console (hidratação estável)", errors.length === 0, errors.slice(0, 2));
    await context.close();
  }

  // Celular: arraste horizontal troca; vertical não.
  {
    const { context, page, errors } = await newPage(browser, 390, { height: 844 });
    await page.goto(BASE + "/services", { waitUntil: "networkidle" });
    const stage = page.locator('#sites [aria-roledescription="slide"]');
    await stage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = (await stage.boundingBox())!;
    const drag = async (dx: number, dy: number) => {
      await stage.dispatchEvent("pointerdown", { pointerId: 7, clientX: box.x + box.width / 2, clientY: box.y + box.height / 2, isPrimary: true });
      await stage.dispatchEvent("pointerup", { pointerId: 7, clientX: box.x + box.width / 2 + dx, clientY: box.y + box.height / 2 + dy, isPrimary: true });
      await page.waitForTimeout(450);
    };
    await drag(10, -80);
    let m = await state(page);
    check("celular: gesto vertical não troca a captura", m?.visibleAlt[0]?.includes(titles[0]!), m?.visibleAlt);
    await drag(-90, 8);
    m = await state(page);
    check("celular: arraste para a esquerda avança", m?.visibleAlt[0]?.includes(titles[1]!), m?.visibleAlt);
    const touchAction = await stage.evaluate((el) => getComputedStyle(el).touchAction);
    check("celular: touch-action pan-y mantém a rolagem vertical", touchAction === "pan-y", touchAction);
    check("celular: sem estouro horizontal", (await overflow(page)) <= 0);
    check("celular: sem erros de console", errors.length === 0, errors.slice(0, 2));
    await context.close();
  }
  finish(check);
});

test("/plans: vitrine de contratação — sites com ficha completa, sistemas sob medida", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/plans", { waitUntil: "networkidle" });

  const hero = [await headingText(page, "main h1"), await page.locator("main h1 + p").textContent()];
  check(
    "topo com a mensagem de contratação",
    hero[0] === "Escolha o site ou sistema que sua empresa precisa." && hero[1] === "Conheça as entregas e solicite uma proposta para colocar seu projeto no ar.",
    hero,
  );

  const SITE_CTAS = { landing: "Quero minha landing page", "business-site": "Quero meu site" } as Record<string, string>;
  for (const id of PLANS_SHOWCASE.sites) {
    const offer = getServiceOffer(id)!;
    const sheet = await page.evaluate((offerId) => {
      const el = document.getElementById(`oferta-${offerId}`);
      if (!el) return null;
      const prices = Object.fromEntries([...[...el.querySelectorAll("dl")].at(-1)!.querySelectorAll("div")].map((d) => [d.querySelector("dt")?.textContent, d.querySelector("dd")?.textContent]));
      const cta = el.querySelector<HTMLAnchorElement>('a[href^="/build"]');
      return { text: el.innerText, prices, cta: [cta?.getAttribute("href"), cta?.textContent?.trim()], img: !!el.querySelector("img") };
    }, id);
    const pricing = getOfferPricing(offer);
    const expect = [formatPrice(pricing.setup, "pt-BR", "Solicitar proposta"), formatPrice(pricing.monthly, "pt-BR", "Solicitar proposta")];
    check(`${id}: selo Disponível, público, entregas, limites e suporte`, !!sheet && sheet.text.includes("Disponível") && ["Para quem é", "O que você recebe", "Limites do pacote", "Suporte"].every((l) => sheet.text.toUpperCase().includes(l.toUpperCase())));
    check(`${id}: captura real identificada`, !!sheet && sheet.img && sheet.text.includes("Projeto real"));
    check(`${id}: Implantação "${expect[0]}" e Mensalidade "${expect[1]}" separadas`, sheet?.prices["Implantação"] === expect[0] && sheet?.prices["Mensalidade"] === expect[1], sheet?.prices);
    check(`${id}: CTA "${SITE_CTAS[id]}" seleciona a oferta`, JSON.stringify(sheet?.cta) === JSON.stringify([`/build?service=${id}`, SITE_CTAS[id]]), sheet?.cta);
  }

  const systems = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("#sistemas article")].map((a) => ({
      id: a.id,
      text: a.innerText,
      cta: a.querySelector<HTMLAnchorElement>('a[href^="/build"]')?.getAttribute("href"),
      illustrative: a.innerText.includes("Imagem ilustrativa"),
      real: a.innerText.includes("Projeto real"),
    })),
  );
  check(
    "sistemas: Agendamento, Catálogo, Sistemas web e Automações, na ordem",
    JSON.stringify(systems.map((s) => s.text.split("\n").find((l) => ["Agendamento online", "Catálogo digital", "Sistemas web", "Automações"].includes(l)))) === JSON.stringify(["Agendamento online", "Catálogo digital", "Sistemas web", "Automações"]),
    systems.map((s) => s.id),
  );
  PLANS_SHOWCASE.systems.forEach((id, i) => {
    const card = systems[i];
    const offer = getServiceOffer(id)!;
    check(`${id}: "Sob medida", sem valor e CTA para o configurador`, !!card && isOfferCustom(offer) && card.text.includes("Sob medida") && card.text.includes("definidas depois do diagnóstico") && !card.text.includes("R$") && card.cta === `/build?service=${id}`, card?.cta);
    check(`${id}: imagem identificada (real ou ilustrativa)`, !!card && (offer.media.kind === "illustration" ? card.illustrative : card.real));
  });

  const addons = await page.evaluate(() => document.querySelectorAll("#adicionais tbody tr").length);
  check(`${ADDONS.length} adicionais com implantação e mensalidade`, addons === ADDONS.length, addons);
  const externals = await page.evaluate(() => document.querySelectorAll("#custos-externos li").length);
  check(`${EXTERNAL_COSTS.length} custos externos explicados`, externals === EXTERNAL_COSTS.length, externals);
  const body = await page.evaluate(() => document.body.innerText);
  check("pagamento não é apresentado como confirmado", body.includes("O site não processa pagamentos"));
  const shownPrices =
    PLANS_SHOWCASE.sites.flatMap((id) => Object.values(getOfferPricing(getServiceOffer(id)!))).filter((v) => v !== null).length +
    ADDONS.flatMap((a) => [a.pricing.setup, a.pricing.monthly]).filter((v) => v !== null).length;
  check(`R$ só aparece para preços confirmados (${shownPrices} no catálogo)`, (body.match(/R\$/g) ?? []).length === shownPrices, (body.match(/R\$/g) ?? []).length);

  for (const anchor of ["plan-sites", "plan-automation"]) {
    await page.goto(BASE + `/plans#${anchor}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const top = await page.evaluate((a) => Math.round(document.getElementById(a)!.getBoundingClientRect().top), anchor);
    check(`link /plans#${anchor} (usado em Sites e sistemas) chega abaixo da Top Bar`, top >= 0 && top < 220, top);
  }

  await page.goto(BASE + "/plans", { waitUntil: "networkidle" });
  await page.locator('#oferta-business-site a[href="/build?service=business-site"]').click();
  await page.waitForURL(BASE + "/build?service=business-site");
  await page.waitForTimeout(400);
  check('"Quero meu site" abre o configurador com sites marcado', await page.isChecked("#builder-solution-sites"));
  await next(page);
  const marked = await page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>("main input[type=checkbox]:checked")].map((i) => i.id));
  check("funcionalidades do site empresarial já marcadas", JSON.stringify(marked) === JSON.stringify(["builder-feature-sites-multipage", "builder-feature-sites-whatsapp-form", "builder-feature-sites-seo"]), marked);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();

  const mobile = await newPage(browser, 390, { height: 844 });
  await mobile.page.goto(BASE + "/plans", { waitUntil: "networkidle" });
  check("390px: sem rolagem horizontal", (await overflow(mobile.page)) <= 0, await overflow(mobile.page));
  const order = await mobile.page.evaluate(() => {
    const el = document.getElementById("oferta-landing")!;
    const y = (s: string) => Math.round([...el.querySelectorAll<HTMLElement>("*")].find((n) => n.children.length === 0 && n.textContent?.trim() === s)?.getBoundingClientRect().top ?? -1);
    const cta = el.querySelector<HTMLElement>('a[href="/build?service=landing"]');
    return [y("Landing page"), y("Implantação"), Math.round(cta?.getBoundingClientRect().top ?? -1)];
  });
  check("390px: ficha lida em ordem (nome → valores → CTA)", order.every((v) => v > 0) && order[0] < order[1] && order[1] < order[2], order);
  await mobile.page.locator('#plan-automation a[href^="/build"]').click();
  await mobile.page.waitForURL(BASE + "/build?service=automation-ai");
  await mobile.page.waitForTimeout(400);
  check("390px: CTA de Automações seleciona a solução", await mobile.page.isChecked("#builder-solution-automation"));
  check("390px: sem erros de console", mobile.errors.length === 0, mobile.errors.slice(0, 2));
  await mobile.context.close();
  finish(check);
});

async function next(page: Page) {
  await page.click('button:has-text("Continuar")');
  await page.waitForTimeout(350);
}

test("/build: fluxo completo, validação, voltar preserva e mensagem do WhatsApp", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/build", { waitUntil: "networkidle" });

  // Etapa 1
  await next(page);
  let s = await page.evaluate(() => ({ text: document.querySelector("main")!.innerText, focus: document.activeElement?.id }));
  check("etapa 1 sem escolha: erro e foco na primeira opção", s.text.includes("Escolha um tipo de solução") && s.focus === "builder-solution-sites", s.focus);
  await page.click('label[for="builder-solution-sites"]');
  await next(page);

  // Etapa 2
  check("avança para Necessidades", (await page.locator("h2").first().textContent())?.includes("O que o projeto precisa ter"));
  await next(page);
  s = await page.evaluate(() => ({ text: document.querySelector("main")!.innerText, focus: document.activeElement?.id }));
  check("etapa 2 vazia: erro e foco nos detalhes", s.text.includes("Marque ao menos uma funcionalidade") && s.focus === "builder-details", s.focus);
  await page.click('label[for="builder-feature-sites-landing"]');
  await page.click('label[for="builder-feature-sites-whatsapp-form"]');
  await page.click('label[for="builder-addon-extra-pages"]');
  await page.fill("#builder-details", "Vendemos pelo WhatsApp e queremos um catálogo.");
  await next(page);

  // Etapa 3
  await next(page);
  const invalidState = () =>
    page.evaluate(() => ({
      invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map((e) => e.id),
      focus: document.activeElement?.id,
    }));
  let contactState = await invalidState();
  check("etapa 3 vazia: nome, WhatsApp e empresa inválidos; foco no nome", JSON.stringify(contactState.invalid) === JSON.stringify(["builder-name", "builder-whatsapp", "builder-company"]) && contactState.focus === "builder-name", contactState);
  await page.fill("#builder-name", "Maria Teste");
  await page.fill("#builder-whatsapp", "65 99999-0000");
  await page.fill("#builder-email", "email-invalido");
  await page.fill("#builder-company", "Loja Exemplo");
  await next(page);
  contactState = await invalidState();
  check("e-mail inválido bloqueia e recebe o foco", JSON.stringify(contactState.invalid) === JSON.stringify(["builder-email"]) && contactState.focus === "builder-email", contactState);
  await page.fill("#builder-email", "maria@example.com");
  await page.fill("#builder-segment", "Varejo");
  await next(page);

  // Etapa 4: resumo
  const summary = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>(`main a[href^="https://wa.me/"]`);
    return {
      text: document.querySelector("main")!.innerText,
      href: link?.href ?? "",
      target: link?.target,
      rel: link?.rel,
      message: link ? decodeURIComponent(new URL(link.href).searchParams.get("text") ?? "") : "",
    };
  });
  check(
    "resumo: solução, necessidades, adicional, detalhes e contato",
    ["Landing pages e sites empresariais", "Landing page (uma página)", "Botão e formulário de WhatsApp", "Páginas adicionais", "Vendemos pelo WhatsApp", "Maria Teste", "Loja Exemplo", "Varejo", "maria@example.com"].every((x) => summary.text.includes(x)),
  );
  check("resumo: itens sem valor confirmado aparecem como Sob consulta", summary.text.includes("Sob consulta") && summary.text.includes("Valores sob consulta"));
  check("resumo: deixa claro que nada é cobrado agora", summary.text.includes("Nada é cobrado agora"));
  check("envio: link real do WhatsApp em nova aba", summary.href.startsWith(`https://wa.me/${WA_NUMBER}`) && summary.target === "_blank" && !!summary.rel?.includes("noopener"), summary.href.slice(0, 40));
  check(
    "mensagem organizada com todos os dados",
    ["*Nova solicitação de projeto — site ZTech*", "*Solução:* Landing pages e sites empresariais (Disponível)", "- Landing page (uma página)", "- Páginas adicionais", "*Detalhes:*", "*Estimativa:* Implantação: Sob consulta · Mensalidade: Sob consulta", "Nome: Maria Teste", "Empresa: Loja Exemplo", "Segmento: Varejo", "WhatsApp: 65 99999-0000", "E-mail: maria@example.com"].every((x) =>
      summary.message.includes(x),
    ),
    summary.message,
  );

  // Voltar preserva tudo
  await page.click('button:has-text("Voltar")');
  await page.waitForTimeout(350);
  const contact = await page.evaluate(() => ["name", "whatsapp", "email", "company", "segment"].map((k) => (document.getElementById(`builder-${k}`) as HTMLInputElement).value));
  check("voltar ao contato preserva os campos", JSON.stringify(contact) === JSON.stringify(["Maria Teste", "65 99999-0000", "maria@example.com", "Loja Exemplo", "Varejo"]), contact);
  await page.click('button:has-text("Voltar")');
  await page.waitForTimeout(350);
  const needs = await page.evaluate(() => ({
    checked: [...document.querySelectorAll<HTMLInputElement>("main input[type=checkbox]:checked")].map((i) => i.id),
    details: (document.getElementById("builder-details") as HTMLTextAreaElement).value,
  }));
  check(
    "voltar às necessidades preserva marcações e detalhes",
    JSON.stringify(needs.checked) === JSON.stringify(["builder-feature-sites-landing", "builder-feature-sites-whatsapp-form", "builder-addon-extra-pages"]) && needs.details.startsWith("Vendemos"),
    needs,
  );

  // Editar a partir do resumo
  await next(page);
  await next(page);
  await page.locator("main dl button").first().click(); // linha "Solução" do resumo
  await page.waitForTimeout(350);
  check("Editar no resumo volta à etapa certa com a escolha marcada", await page.isChecked("#builder-solution-sites"));
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("/build: solução sob encomenda, solução via URL e celular", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 390, { height: 844 });

  await page.goto(BASE + "/build?solution=ai", { waitUntil: "networkidle" });
  check("?solution=ai já marca a solução", await page.isChecked("#builder-solution-ai"));
  check("390px etapa 1 sem overflow", (await overflow(page)) <= 0);
  await next(page);
  await page.click('label[for="builder-feature-ai-assistant"]');
  check("390px etapa 2 sem overflow", (await overflow(page)) <= 0);
  await next(page);
  await page.fill("#builder-name", "João");
  await page.fill("#builder-whatsapp", "11988887777");
  await page.fill("#builder-company", "Clínica Exemplo");
  check("390px etapa 3 sem overflow", (await overflow(page)) <= 0);
  await next(page);
  const r = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>(`main a[href^="https://wa.me/"]`);
    return { text: document.querySelector("main")!.innerText, message: link ? decodeURIComponent(new URL(link.href).searchParams.get("text") ?? "") : "", table: !!document.querySelector("main table") };
  });
  check("sob encomenda: resumo exige diagnóstico e não mostra tabela de valores", r.text.includes("exige diagnóstico e definição de escopo") && !r.table);
  check("sob encomenda: mensagem traz a observação de escopo", r.message.includes("*Estimativa:* Esta solução exige diagnóstico"), r.message.slice(0, 200));
  check("390px resumo sem overflow", (await overflow(page)) <= 0);

  await page.goto(BASE + "/build?solution=invalida", { waitUntil: "networkidle" });
  check("?solution inválida é ignorada", (await page.locator("main input[type=radio]:checked").count()) === 0);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("/how-it-works, dúvidas em /contact e menu", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });

  await page.goto(BASE + "/how-it-works", { waitUntil: "networkidle" });
  const steps = await page.evaluate(() => [...document.querySelectorAll("main ol > li")].map((li) => (li as HTMLElement).innerText));
  const names = ["Diagnóstico", "Proposta", "Materiais", "Desenvolvimento", "Aprovação", "Publicação", "Acompanhamento"];
  check("7 etapas na ordem pedida, cada uma com a participação do cliente", steps.length === 7 && names.every((n, i) => steps[i].includes(n) && steps[i].toUpperCase().includes("SUA PARTICIPAÇÃO")), steps.map((s) => s.split("\n")[1]));

  await page.goto(BASE + "/how-it-works#duvidas", { waitUntil: "networkidle" });
  const faq = await page.evaluate(() => [...document.querySelectorAll("#duvidas details")].map((d) => ({ q: d.querySelector("summary")?.textContent ?? "", a: d.querySelector("p")?.textContent ?? "" })));
  const topics = ["implantação", "mensalidade", "domínio", "hospedado", "alterações", "IA", "serviços externos", "fidelidade", "pagamento"];
  check("dúvidas cobrem implantação, assinatura, domínio, hospedagem, alterações, IA, externos, fidelidade e pagamento", topics.every((topic) => faq.some((f) => f.q.toLowerCase().includes(topic.toLowerCase()))), faq.map((f) => f.q));
  check("respostas sem prazos, valores ou números inventados", faq.every((f) => !/\d/.test(f.a)), faq.filter((f) => /\d/.test(f.a)).map((f) => f.q));
  await page.click("#duvidas details:first-of-type summary");
  check("pergunta abre ao clicar", await page.evaluate(() => (document.querySelector("#duvidas details") as HTMLDetailsElement).open));

  const nav = await page.evaluate(() => [...document.querySelectorAll("#sidebar nav a")].map((a) => a.getAttribute("href")));
  check("menu com Sites e sistemas, Planos e valores, Como funciona e Projetos reais", ["/services", "/plans", "/how-it-works", "/projects"].every((h) => nav.includes(h)), nav);
  const contracting = await page.evaluate(() => [document.getElementById("contratacao")?.innerText ?? "", document.querySelectorAll("main #duvidas details").length]);
  check("Como funciona reúne implantação, mensalidade e dúvidas", String(contracting[0]).includes("Implantação") && String(contracting[0]).includes("Mensalidade") && Number(contracting[1]) >= 9, contracting);
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

// Sites e sistemas → aba "Barbearias e salões" (os 3 pacotes).
async function openBarberTab(page: Page) {
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("segmentos")!.scrollIntoView());
  await page.locator('#segmentos [role="tab"]', { hasText: "Barbearias e salões" }).click();
  await page.waitForTimeout(900);
}

test("barbearia: 3 cards, imagens identificadas, Sob medida e preço só se confirmado", async ({ browser }) => {
  const check = createCheck();
  const cards = (page: Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('#segmentos [role="tabpanel"] article')].map((a) => {
        const r = a.getBoundingClientRect();
        const cta = a.querySelector<HTMLAnchorElement>('a[href^="/build"]');
        return {
          top: Math.round(r.top + scrollY),
          left: Math.round(r.left),
          text: a.innerText,
          cta: [cta?.textContent?.trim(), cta?.getAttribute("href")],
          realImg: a.querySelector("img")?.getAttribute("alt") ?? null,
          illustration: a.querySelector('[role="img"]')?.getAttribute("aria-label") ?? null,
          // Itens da lista de recursos com a marca "Sob medida".
          custom: [...a.querySelectorAll("ul > li")].filter((li) => li.textContent?.includes("Sob medida")).length,
        };
      }),
    );

  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await openBarberTab(page);
  let c = await cards(page);
  check("aba Barbearias e salões dentro de Sites e sistemas", (await page.evaluate(() => document.querySelector('#segmentos [role="tabpanel"] h3')?.textContent)) === "Do site à agenda e ao clube de assinatura.");
  check("1440px: três cards lado a lado", c.length === 3 && c.every((x) => x.top === c[0].top) && c[0].left < c[1].left && c[1].left < c[2].left, c.map((x) => [x.top, x.left]));
  check(
    "CTAs abrem o fluxo com segmento e plano",
    JSON.stringify(c.map((x) => x.cta)) ===
      JSON.stringify([
        ["Quero apresentar minha barbearia", "/build?package=presence&segment=barbearia"],
        ["Quero organizar minha agenda", "/build?package=agenda&segment=barbearia"],
        ["Conhecer o plano Prime", "/build?package=prime&segment=barbearia"],
      ]),
    c.map((x) => x.cta),
  );
  check(
    "Presença usa captura real identificada; Agenda e Prime são ilustrações identificadas",
    !!c[0].realImg && c[0].text.includes("Projeto real") && !c[0].illustration && [c[1], c[2]].every((x) => !!x.illustration && !x.realImg && x.text.includes("Imagem ilustrativa")),
    c.map((x) => [x.realImg, x.illustration]),
  );
  check("recursos não implementados marcados como Sob medida (Agenda 3, Prime 4; Presença nenhum)", c[0].custom === 0 && c[1].custom === 3 && c[2].custom === 4, c.map((x) => x.custom));
  const hasConfirmedPrice = (await import("../lib/catalog/data")).BARBER_PACKAGES.some((p) => p.pricing.setup !== null || p.pricing.monthly !== null);
  check('sem valor confirmado: "Solicitar proposta" em vez de implantação/mensalidade', hasConfirmedPrice || c.every((x) => x.text.includes("Solicitar proposta") && !x.text.includes("R$")));
  check(
    "Prime explica quem contrata e quem assina, sem prometer receita",
    c[2].text.includes("A barbearia contrata o sistema da ZTech") && c[2].text.includes("assinam os planos de corte da própria barbearia") && !/garant|aumento|lucro|fatur/i.test(c.map((x) => x.text).join(" ")),
  );
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();

  const mobile = await newPage(browser, 390, { height: 844 });
  await openBarberTab(mobile.page);
  c = await cards(mobile.page);
  check("390px: cards empilhados", c.length === 3 && c.every((x) => x.left === c[0].left) && c[0].top < c[1].top && c[1].top < c[2].top, c.map((x) => [x.top, x.left]));
  check("390px: sem overflow", (await overflow(mobile.page)) <= 0);
  await mobile.context.close();
  finish(check);
});

test("barbearia: botão Prime abre o fluxo com segmento e plano marcados", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await openBarberTab(page);
  await page.click('#segmentos a:has-text("Conhecer o plano Prime")');
  await page.waitForURL(BASE + "/build?package=prime&segment=barbearia");
  await page.waitForTimeout(400);
  check("solução sob medida já marcada", await page.isChecked("#builder-solution-custom"));
  await next(page);
  check("funcionalidade do pacote já marcada", await page.isChecked("#builder-feature-custom-web"));
  await next(page);
  check("segmento Barbearia preenchido", (await page.inputValue("#builder-segment")) === "Barbearia");
  await page.fill("#builder-name", "Carlos");
  await page.fill("#builder-whatsapp", "65 98888-7777");
  await page.fill("#builder-company", "Barbearia Exemplo");
  await next(page);
  const r = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>(`main a[href^="https://wa.me/"]`);
    return { text: document.querySelector("main")!.innerText, message: link ? decodeURIComponent(new URL(link.href).searchParams.get("text") ?? "") : "" };
  });
  check("resumo mostra o plano escolhido e exige escopo", r.text.includes("Barbearia · Prime") && r.text.includes("exige diagnóstico e definição de escopo"));
  check("mensagem traz plano, segmento e escopo", r.message.includes("*Plano:* Barbearia · Prime") && r.message.includes("Segmento: Barbearia") && r.message.includes("exige diagnóstico"), r.message.slice(0, 160));

  // Trocar para uma solução de outro tipo remove o plano do segmento.
  await page.locator("main dl button").first().click();
  await page.waitForTimeout(350);
  await page.click('label[for="builder-solution-sites"]');
  await next(page);
  await page.click('label[for="builder-feature-sites-landing"]');
  await next(page);
  await next(page);
  const after = await page.evaluate(() => document.querySelector("main")!.innerText);
  check("trocar de solução descarta o plano Prime do resumo", !after.includes("Barbearia · Prime") && after.includes("Landing pages e sites empresariais"));
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});

test("configurador: serviço e segmento de serviços locais pela URL", async ({ browser }) => {
  const check = createCheck();
  const builder = await newPage(browser, 1440, { height: 900 });
  await builder.page.goto(BASE + "/build?service=service-orders&segment=servicos-locais", { waitUntil: "networkidle" });
  check("ordens de serviço: solução sob medida marcada", await builder.page.isChecked("#builder-solution-custom"));
  await next(builder.page);
  await next(builder.page);
  check("segmento preenchido: Serviços locais", (await builder.page.inputValue("#builder-segment")) === "Serviços locais (climatização e manutenção)");
  check("sem erros de console", builder.errors.length === 0, builder.errors.slice(0, 2));
  await builder.context.close();
  finish(check);
});

test("percurso: entrada da Home → serviço selecionado → resumo → contato", async ({ browser }) => {
  const check = createCheck();
  const { context, page, errors } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("entradas")!.scrollIntoView());
  await page.locator('#entradas a[href="/build?service=landing"]').click();
  await page.waitForURL(BASE + "/build?service=landing");
  await page.waitForTimeout(400);
  check("serviço selecionado: solução de sites marcada", await page.isChecked("#builder-solution-sites"));
  await next(page);
  const marked = await page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>("main input[type=checkbox]:checked")].map((i) => i.id));
  check(
    "funcionalidades do card já marcadas",
    JSON.stringify(marked) === JSON.stringify(["builder-feature-sites-landing", "builder-feature-sites-whatsapp-form", "builder-feature-sites-seo"]),
    marked,
  );
  await next(page);
  await page.fill("#builder-name", "Ana");
  await page.fill("#builder-whatsapp", "65 97777-6666");
  await page.fill("#builder-company", "Clínica Exemplo");
  await next(page);
  const r = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>('main a[href^="https://wa.me/"]');
    return {
      text: document.querySelector("main")!.innerText,
      message: link ? decodeURIComponent(new URL(link.href).searchParams.get("text") ?? "") : "",
      target: link?.target,
    };
  });
  check("resumo mostra o serviço escolhido", r.text.includes("Landing pages") && r.text.toUpperCase().includes("SERVIÇO"));
  check(
    "contato: mensagem do WhatsApp com serviço, solução e dados",
    r.message.includes("*Serviço:* Landing pages") && r.message.includes("Landing pages e sites empresariais") && r.message.includes("Nome: Ana") && r.target === "_blank",
    r.message.slice(0, 180),
  );
  check("sem erros de console", errors.length === 0, errors.slice(0, 2));
  await context.close();
  finish(check);
});
