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
