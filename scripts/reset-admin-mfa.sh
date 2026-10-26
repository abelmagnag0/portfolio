#!/usr/bin/env zsh
set -euo pipefail

# Remove o TOTP cadastrado do admin. No próximo login o managed login do
# Cognito pede para cadastrar um autenticador novo.
#
#   pnpm run admin:reset-mfa
#
# Use quando perder o celular ou trocar de app autenticador. Exige credencial
# AWS com permissão de cognito-idp:AdminDeleteSoftwareToken — é de propósito:
# não existe autoatendimento para remover o segundo fator.

STACK_NAME=${STACK_NAME:-"portfolio-site-dev"}
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-"us-east-1"}}
PROFILE=${AWS_PROFILE:-""}
POOL_ID=${COGNITO_USER_POOL_ID:-""}

aws_cli() {
  if [ -n "$PROFILE" ]; then
    aws --region "$REGION" --profile "$PROFILE" "$@"
  else
    aws --region "$REGION" "$@"
  fi
}

if ! command -v aws >/dev/null 2>&1; then
  echo "[mfa] AWS CLI não encontrado." >&2
  exit 1
fi

if [ -z "$POOL_ID" ]; then
  POOL_ID=$(aws_cli cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='AdminUserPoolId'].OutputValue" \
    --output text 2>/dev/null || true)
fi

if [ -z "$POOL_ID" ] || [ "$POOL_ID" = "None" ]; then
  echo "[mfa] Não achei o AdminUserPoolId na stack $STACK_NAME ($REGION)." >&2
  echo "[mfa] Passe COGNITO_USER_POOL_ID=us-east-1_xxxx." >&2
  exit 1
fi

if [ -z "${ADMIN_EMAIL:-}" ]; then
  read "ADMIN_EMAIL?E-mail do admin: "
fi

if [ -z "$ADMIN_EMAIL" ]; then
  echo "[mfa] E-mail vazio. Abortando." >&2
  exit 1
fi

echo "[mfa] Removendo o TOTP de $ADMIN_EMAIL no pool $POOL_ID..."
aws_cli cognito-idp admin-delete-software-token \
  --user-pool-id "$POOL_ID" \
  --username "$ADMIN_EMAIL" >/dev/null

echo
echo "[mfa] Pronto."
echo "[mfa] No próximo login o Cognito mostra um QR code novo para cadastrar o"
echo "[mfa] autenticador. O painel continua exigindo senha + código."