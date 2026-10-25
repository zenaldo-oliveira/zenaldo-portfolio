# ZTech Solutions — site comercial

Site da ZTech Solutions: sites, sistemas web e automações para pequenas e médias empresas. O visitante conhece as ofertas, vê projetos reais, monta um pedido de orçamento e fala com a ZTech pelo WhatsApp ou pelo formulário.

Domínio atual: https://www.zenaldodev.com.br (definido em `lib/site.ts` como `SITE_URL`; canonical, sitemap e robots usam este endereço).

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Hero com demonstração, entradas comerciais, prévias reais, o que o cliente recebe, etapas e contato |
| `/services` | Sites e sistemas: ofertas por necessidade, segmentos (serviços locais e barbearias) e as soluções em detalhe |
| `/plans` | Planos e valores: implantação e mensalidade separadas, adicionais e custos externos |
| `/how-it-works` | Etapas, contratação e dúvidas frequentes |
| `/projects` | Projetos reais |
| `/about` | A empresa, o fundador e a capacidade técnica (`#tecnologias`) |
| `/build` | Configurador do pedido de orçamento (resumo enviado pelo WhatsApp) |
| `/contact` | Formulário de contato e WhatsApp |

`/skills` e `/certificates` (páginas do antigo portfólio) redirecionam permanentemente (308) para `/about#tecnologias` e `/about` — ver `next.config.ts`.

## Stack

- Next.js 16 (App Router) e React 19, TypeScript strict
- Tailwind CSS v4 (tokens em `app/globals.css`, temas claro e escuro) e utilitários do shadcn (`cn`, `components.json`)
- framer-motion (entradas e transições, respeitando movimento reduzido), Embla (carrosséis), lucide-react e react-icons
- Supabase (registro dos contatos do formulário) e aviso de novo contato por WhatsApp
- Playwright (testes E2E)

## Organização

- `lib/catalog/` — catálogo comercial, **fonte única** de ofertas, planos, adicionais e preços. Preço `null` aparece como "Solicitar proposta"; só preencha valores confirmados.
- `lib/i18n/` — textos em português, inglês e espanhol. Os textos comerciais ficam em `dictionaries/commercial/`, tipados pelos ids do catálogo.
- `lib/projects/data.ts` — projetos reais e suas capturas (`public/projects/screenshots/`).
- `lib/site.ts` — domínio, nome e navegação (sidebar, breadcrumb e rodapé leem daqui).
- `components/` — por página (`home`, `plans`, `builder`…), `layout` (sidebar, top bar, rodapé, fundo) e `ui` (botões, seções, cards).
- `app/api/leads` — recebe o formulário de contato, valida, registra no Supabase e avisa a equipe.

## Como rodar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev      # http://localhost:3000
```

### Variáveis de ambiente

Crie um `.env.local` (nunca versionado) com:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | projeto Supabase dos contatos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | opcional, só no servidor; usada no lugar da chave pública quando definida |
| `WHATSAPP_PROVIDER` | `zapi` para envio real; qualquer outro valor usa o modo de simulação (padrão seguro) |
| `LEAD_NOTIFICATION_WHATSAPP` | número que recebe o aviso de novo contato |

A integração real com a Z-API ainda não está implementada (`lib/whatsapp/zApiWhatsAppService.ts`); sem ela, os avisos ficam em modo de simulação.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run start` | serve o build de produção |
| `npm run lint` | ESLint |
| `npm run test:e2e` | testes Playwright contra o build (`next start` na porta 3920) |
| `npm run test:e2e:build` | build e testes em sequência |

Verificação de tipos: `npx tsc --noEmit`.

Os testes ficam em `e2e/`. No Windows usam o Microsoft Edge instalado; em outros sistemas, o Chromium do Playwright (`npx playwright install chromium`). Relatórios gerados (`playwright-report/`, `test-results/`) não são versionados.

## Publicação

Hospedado na Vercel, com integração ao repositório: a produção acompanha a branch `main`.
