# Portfolio Site — Next.js static on AWS with Serverless

This repo ships a static Next.js site behind CloudFront with TLS and custom domain, fully provisioned via Serverless Framework (CloudFormation). Content is exported to `out/` and served privately from S3 using a CloudFront Origin Access Control (OAC).

## Stack at a glance

- Frontend:
  - Next.js
  - React
  - TypeScript
  - TailwindCSS
  - ESLint 9
- Infra:
  - Serverless:
    - AWS:
      - S3
      - CloudFront
      - Route 53
      - ACM
      - Lambda (HTTP API)
      - DynamoDB (analytics + leads)
      - SES (notificação de leads)
      - Cognito (login do admin com TOTP obrigatório)

## Application layers (analytics, leads, admin)

Além do site estático, o repositório inclui uma API serverless servida no mesmo
domínio via CloudFront (`/api/*`), sem CORS:

- **Analytics first-party** — o front (`src/library/analytics`) envia eventos
  (`pageview`, `cv_download`, `contact_submit`, `social_click`, `project_view`,
  `section_view`, `language_switch`) para `POST /api/track`. A geolocalização
  (país/cidade) vem dos headers `CloudFront-Viewer-*`, sem capturar IP do visitante.
- **Captação de leads** — o formulário em `src/library/sections/contact.tsx`
  envia para `POST /api/leads`; o lead é persistido e o dono recebe e-mail via SES.
- **Painel admin** — página estática em `/admin` (client-side) que faz login
  pelo Cognito (Authorization Code + PKCE) e chama a API com o access token.
  O segundo fator (TOTP, app autenticador) é obrigatório.

### Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/track` | Registra um evento de analytics |
| POST | `/api/leads` | Recebe o formulário de contato |
| GET | `/api/config` | Publica host e client id públicos do Cognito |
| GET | `/api/admin/stats?days=30` | Métricas agregadas (exige JWT) |
| GET | `/api/admin/leads` | Lista os leads recentes (exige JWT) |
| PATCH | `/api/admin/leads` | Atualiza status (`new`/`read`/`replied`, exige JWT) |

As rotas `/api/admin/*` usam o authorizer JWT do API Gateway: sem um access
token válido do Cognito a Lambda nem é chamada.

Código dos handlers em `backend/`; são empacotados por `scripts/build-api.mjs`
(esbuild) para `dist-api/`, que é o que o Serverless publica.

### Setup (primeira vez)

0. Autentique o Serverless Framework. O v4 recusa qualquer comando sem login ou
   chave de licença:

   ```bash
   sls login
   ```

   A máquina pode guardar uma chave (`~/.serverlessrc` com `userId: null`)
   mesmo depois de trocar de computador. Para rodar sem terminal, defina
   `SERVERLESS_ACCESS_KEY` ou `SERVERLESS_LICENSE_KEY`.

1. Verifique no SES o remetente (`no-reply@abel.dev.br`) — domínio verificado ou,
   em sandbox, o e-mail de destino. Ajuste `custom.leadRecipient`/`custom.sesSender`
   em `serverless.yml` se necessário.

2. Deploy da infra (inclui API, tabelas, Cognito e o behavior `/api/*` no
   CloudFront):

   ```bash
   pnpm run deploy
   ```

3. Crie o único usuário do painel. O script pede o e-mail e a senha no terminal
   e nunca grava a senha em arquivo:

   ```bash
   pnpm run admin:create
   ```

4. Acesse `https://abel.dev.br/admin` e clique em **Entrar**. O Cognito mostra
   e-mail/senha e, no primeiro acesso, o QR code para cadastrar o app
   autenticador. Nos logins seguintes ele pede o código de 6 dígitos.

   Perdeu o celular ou trocou de autenticador?

   ```bash
   pnpm run admin:reset-mfa
   ```

   Isso remove o TOTP; o próximo login cadastra um novo. Não existe
   autoatendimento para remover o segundo fator — de propósito.

### Local dev da API (opcional)

O site não chama a API em `dev` por padrão (os eventos falham em silêncio). Para
apontar o front para uma API local, defina `NEXT_PUBLIC_API_BASE`.

## Run with Docker (dev)

Sobe o dev server (com hot reload) em container, montando o projeto:

```bash
pnpm install            # uma vez, no host (o container reaproveita node_modules)
docker compose up       # → http://localhost:4321
```

Ou, sem compose:

```bash
docker run --rm -it --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD":/app -v "$PWD/.next-container":/app/.next -w /app -p 4321:3000 node:22-slim \
  ./node_modules/.bin/next dev -H 0.0.0.0 -p 3000
```

O `.next` fica isolado em `.next-container/` (gitignored) para que rodar
`pnpm build` no host não corrompa o cache do dev server em execução.

Há também um `Dockerfile` com build self-contained (instala as deps dentro da
imagem); útil quando não se quer depender do `node_modules` do host.

> Nota: localmente a API (`/api/*`) não existe, então os eventos de analytics
> falham em silêncio e o login do admin não conecta. Para preview completo,
> aponte `NEXT_PUBLIC_API_BASE` para uma API local ou faça o deploy. O pool
> aceita callback em `localhost:3000`, `localhost:3100` e `localhost:4321`; se
> o dev server usar outra porta, ela precisa ser adicionada em
> `CallbackURLs`/`LogoutURLs` no `sls/cognito.yml`.

## Local dev

Requirements:

- Node 18.18+
- pnpm
- AWS CLI configured (for publishing)

Run the dev server:

```bash
pnpm dev
```

Build (static export → `./out`):

```bash
pnpm build
```

## Infrastructure deploy

Provision the AWS resources (S3, CloudFront + OAC, ACM, Route 53, Lambda HTTP API,
DynamoDB, SES) via Serverless. Bundle the Lambda handlers first:

```bash
pnpm run build:api   # esbuild -> dist-api/
sls deploy           # ou: pnpm run deploy (build:api + sls deploy)
```

> `pnpm deploy` e `pnpm publish`, sem o `run`, **não** chamam os scripts deste
> projeto: são comandos nativos do pnpm/npm (deploy de workspace e publicação
> no registry). Com `run` eles caem no `package.json`.

> **Nome do serviço vs. nome da stack.** O serviço se chama `portfolio`, mas
> `provider.stackName` e `custom.bucketName` estão fixos em `portfolio-site-dev`,
> que é a stack criada quando o projeto morava em outro computador. Isso é
> intencional: a stack já tem a distribuição CloudFront e os registros de DNS
> do domínio, então trocar o nome criaria uma stack paralela e os registros
> `A`/`ALIAS` colidiriam. Para migrar, remova `ApexRecord` e `WwwRecord` antes.

## Publishing content (S3 sync + CloudFront invalidation)

Use the publish script after building:

```bash
pnpm run publish
```

Supported envs for the script (optional):

- `STACK_NAME` (default: `portfolio-site-dev`)
- `AWS_PROFILE`, `AWS_REGION` (or `AWS_DEFAULT_REGION`) for the AWS CLI
- `DOMAIN_NAME` (used as a fallback to find the distribution by alias)

## Security posture

- S3 bucket is private (no public ACLs/policies). Public access is blocked at the bucket level.
- Bucket ownership is enforced via OwnershipControls.
- Only CloudFront (service principal) can read from the bucket, restricted by SourceArn of the specific distribution.
- Viewer protocol policy on CloudFront enforces HTTPS (redirect to HTTPS).
- Admin protegido pelo Cognito: e-mail + senha (mínimo 12 caracteres) e TOTP
  obrigatório. O API Gateway valida o JWT antes de qualquer Lambda de admin
  rodar; não existe senha ou segredo de sessão no repositório, no template do
  CloudFormation ou nas variáveis de ambiente das funções. O painel (`/admin`)
  é `noindex` e bloqueado em `robots.txt`.
- Analytics não armazena IP; a geolocalização usa apenas os headers do CloudFront.
- Eventos expiram automaticamente após 400 dias (TTL no DynamoDB).

## Caching & performance

- Uses AWS managed cache policy (CachingOptimized). Static assets are compressed.
- Publishing runs a full `/*` invalidation; tune paths if needed for large sites.

## DNS & certificates

- Route 53 A (Alias) for apex and `www` to the distribution.
- ACM certificate is DNS-validated in `us-east-1`.
- Optional: add a CloudFront Function to force `www → apex` redirect.

---

## SEO

- Meta tags e Open Graph via Metadata API do Next (App Router), nos layouts de cada route group (`src/app/(en)/layout.tsx` serve a raiz `/`, `src/app/(pt)/layout.tsx` serve `/pt` e o painel `/admin`).
  - OG/Twitter usam cartões estáticos 1200×630 em `public/og.png` (PT) e `public/og-en.png` (EN), gerados por `pnpm og`.
    A convenção `opengraph-image.tsx` **não** é usada: ela exige runtime de edge e o projeto usa `output: 'export'`, então o Next não gerava o arquivo e a rota respondia 404 em produção.
  - `metadataBase` garante URLs absolutas.
- `next-seo` instalado e usado para JSON-LD:
  - Perfil do autor com `ProfilePageJsonLd` na casca compartilhada (`src/library/app/root-shell.tsx`).
  - `WorkJsonLd` gera automaticamente um `ItemList` de cases a partir de `src/library/sections/work.data.ts`.
  - `NavigationJsonLd` publica `SiteNavigationElement` com as âncoras da home.
- Sitemap e Robots prontos com a Metadata Route do Next:
  - `src/app/sitemap.ts` e `src/app/robots.ts` usam `SITE_URL` centralizado.

Boas práticas adotadas:

- Canonical e `hreflang` por idioma, saindo de uma fonte única (`LOCALE_PATH` / `ALTERNATE_LANGUAGES` em `src/library/seo/site.ts`): a raiz `/` é o inglês, `/pt` é o português, e `x-default` aponta para a raiz. Título com template e descrição focada em palavras-chave reais.
- OG otimizado (1200×630, `summary_large_image`).
- Estruturas JSON-LD para contexto da página (pessoa, navegação e lista de cases).
- Revalidação diária de `robots` e `sitemap` para export estático.

Imagens e ícones (regeneração):

```bash
pnpm images   # retrato: recortes 4:5 e quadrado a partir de assets/portrait-source.png
pnpm og       # cartões de link: public/og.png e public/og-en.png
pnpm assets   # os dois acima
```

`pnpm og` reutiliza os `.woff2` que o `next/font` emitiu em `.next/` e requer `chromium` no PATH — rode depois de um `pnpm build`.

Como validar:

- Rich Results Test (Google)
- Card Validator (Twitter) / Post Inspector (LinkedIn)

