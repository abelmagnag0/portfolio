# Site

Site Next.js exportado estaticamente e servido via S3 + CloudFront, provisionado com Serverless Framework.

## Deploy de infraestrutura

Infra é provisionada via CloudFormation com `sls deploy`.

# Portfólio Next.js (estático) – S3 + CloudFront

Primeira versão estática com mensagem: “Aguarde, portfólio em construção”. Build exporta para `out/`.

## Requisitos

- Node 18.18+ (use `nvm use` com `.nvmrc`)
- pnpm
- AWS CLI autenticado (perfil padrão)

## Desenvolvimento

```bash
pnpm run dev
```

## Build (gera HTML estático em `out/`)

```bash
pnpm run build
```

## Publicação (envia `out/` para S3 e invalida CloudFront)

```bash
pnpm run publish
```
