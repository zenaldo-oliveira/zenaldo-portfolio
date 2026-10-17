import { defineConfig } from "@playwright/test";

// Testes E2E contra o build de produção (`next start`), nunca contra o
// servidor de desenvolvimento. Rode `npm run build` antes, ou use
// `npm run test:e2e:build`.
//
// Navegador: no Windows usa o Microsoft Edge instalado (channel "msedge"),
// sem download de navegador. Em outros sistemas (ex.: CI Linux) usa o
// Chromium do Playwright — instale com `npx playwright install chromium`.
// Para forçar: E2E_CHANNEL=chrome | msedge | chromium.
const PORT = Number(process.env.E2E_PORT ?? 3920);
const channelEnv = process.env.E2E_CHANNEL;
const channel = channelEnv === "chromium" ? undefined : channelEnv ?? (process.platform === "win32" ? "msedge" : undefined);

export default defineConfig({
  testDir: "./e2e",
  // Os testes abrem vários contextos e percorrem rotas inteiras: são longos.
  timeout: 10 * 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [["list"], ["html", { open: "never" }], ["./e2e/support/checks-reporter.ts"]],
  use: {
    channel,
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
