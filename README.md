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

Provision the AWS resources (S3, CloudFront + OAC, ACM, Route 53) via Serverless:

```bash
sls deploy
```

## Publishing content (S3 sync + CloudFront invalidation)

Use the publish script after building:

```bash
pnpm publish
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

## Caching & performance

- Uses AWS managed cache policy (CachingOptimized). Static assets are compressed.
- Publishing runs a full `/*` invalidation; tune paths if needed for large sites.

## DNS & certificates

- Route 53 A (Alias) for apex and `www` to the distribution.
- ACM certificate is DNS-validated in `us-east-1`.
- Optional: add a CloudFront Function to force `www → apex` redirect.

---

## SEO

- Meta tags e Open Graph via Metadata API do Next (App Router) em `src/app/layout.tsx`.
  - OG/Twitter usam imagem 1200×630 gerada dinamicamente em `src/app/opengraph-image.tsx` (ideal para LinkedIn/Twitter).
  - `metadataBase` garante URLs absolutas.
- `next-seo` instalado e usado para JSON-LD:
  - Perfil do autor com `ProfilePageJsonLd` no layout (global).
  - `ProjectsJsonLd` gera automaticamente um `ItemList` de projetos a partir de `projects.data.ts`.
  - `NavigationJsonLd` publica `SiteNavigationElement` com as âncoras da home.
- Sitemap e Robots prontos com a Metadata Route do Next:
  - `src/app/sitemap.ts` e `src/app/robots.ts` usam `SITE_URL` centralizado.

Boas práticas adotadas:

- Canonical definido; locale `pt-BR`; título com template; descrição clara e focada em palavras-chave reais.
- OG otimizado (1200×630, `summary_large_image`).
- Estruturas JSON-LD para contexto da página (pessoa, navegação e lista de projetos).
- Revalidação diária de `robots`, `sitemap` e imagem OG para export estático.

Como validar:

- Rich Results Test (Google)
- Card Validator (Twitter) / Post Inspector (LinkedIn)

