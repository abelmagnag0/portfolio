#!/usr/bin/env zsh
set -euo pipefail

# Config
STACK_NAME=${STACK_NAME:-"portfolio-site-dev"}
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-"us-east-1"}}
PROFILE=${AWS_PROFILE:-""}
DOMAIN_NAME=${DOMAIN_NAME:-"abel.dev.br"}

# Wrapper para AWS CLI com região (e perfil se existir)
aws_cli() {
  if [ -n "$PROFILE" ]; then
    aws --region "$REGION" --profile "$PROFILE" "$@"
  else
    aws --region "$REGION" "$@"
  fi
}

# Ensure build (Next with output: 'export' generates ./out)
if ! command -v pnpm >/dev/null 2>&1; then
  echo "[publish] pnpm não encontrado. Instale pnpm ou use npm/yarn." >&2
  exit 1
fi

echo "[publish] Instalando deps (se necessário) e buildando..."
pnpm install --frozen-lockfile || pnpm install
pnpm build

if [ ! -d "out" ]; then
  echo "[publish] Pasta 'out' não encontrada após build. Verifique o output: 'export' no next.config.ts." >&2
  exit 1
fi

# Descobrir Bucket e Distribution pelos outputs do stack
get_output() {
  local export_name="$1"
  aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?ExportName==\`$export_name\`].OutputValue" \
    --output text
}

if ! command -v aws >/dev/null 2>&1; then
  echo "[publish] AWS CLI não encontrado. Instale e configure suas credenciais." >&2
  exit 1
fi

# Funções para obter outputs/exports
get_output() {
  local export_name="$1"
  aws_cli cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?ExportName==\`$export_name\`].OutputValue" \
    --output text 2>/dev/null || true
}

get_export() {
  local export_name="$1"
  aws_cli cloudformation list-exports \
    --query "Exports[?Name==\`$export_name\`].Value" \
    --output text 2>/dev/null || true
}

# Tentar via describe-stacks; se vazio, tentar via list-exports; se ainda vazio, fallback determinístico
BUCKET_NAME=$(get_output "PortfolioBucketName")
if [ -z "$BUCKET_NAME" ]; then
  BUCKET_NAME=$(get_export "PortfolioBucketName")
fi

# Fallback determinístico: nome usado no serverless.yml -> ${service}-${stage}-${accountId}
if [ -z "$BUCKET_NAME" ]; then
  ACCOUNT_ID=$(aws_cli sts get-caller-identity --query Account --output text)
  BUCKET_NAME="portfolio-site-dev-${ACCOUNT_ID}"
  echo "[publish] Usando fallback do nome do bucket: $BUCKET_NAME"
fi

DISTRIBUTION_ID=$(get_output "PortfolioDistributionId")
if [ -z "$DISTRIBUTION_ID" ]; then
  DISTRIBUTION_ID=$(get_export "PortfolioDistributionId")
fi
if [ -z "$DISTRIBUTION_ID" ]; then
  # Fallback por alias do domínio
  DISTRIBUTION_ID=$(aws_cli cloudfront list-distributions \
    --query "DistributionList.Items[?Aliases.Quantity>0 && contains(Aliases.Items, \`$DOMAIN_NAME\`)].Id | [0]" \
    --output text 2>/dev/null || true)
fi

if [ -z "$BUCKET_NAME" ]; then
  echo "[publish] Não foi possível obter o nome do bucket do stack $STACK_NAME." >&2
  exit 1
fi

if [ -z "$DISTRIBUTION_ID" ]; then
  echo "[publish] Não foi possível obter o ID da distribuição CloudFront do stack $STACK_NAME." >&2
  exit 1
fi

echo "[publish] Publicando ./out para s3://$BUCKET_NAME ..."
aws_cli s3 sync ./out "s3://$BUCKET_NAME/" --delete

echo "[publish] Invalidando distribuição $DISTRIBUTION_ID ..."
aws_cli cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" > /dev/null

echo "[publish] Publicação concluída. Aguarde alguns minutos pela propagação do CloudFront."
