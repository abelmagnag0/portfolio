#!/usr/bin/env zsh
set -euo pipefail

# Cria (ou redefine a senha de) o único usuário do painel admin.
#
# Rode DEPOIS do primeiro `pnpm run deploy`, porque o pool é criado pelo
# CloudFormation:
#
#   pnpm run admin:create
#
# O e-mail e a senha podem vir por env (ADMIN_EMAIL / ADMIN_PASSWORD) ou ser
# digitados no terminal. A senha nunca é gravada em arquivo, variável de
# ambiente da Lambda ou template do CloudFormation — quem guarda o hash é o
# Cognito.
#
# O segundo fator não é cadastrado aqui: no primeiro login o managed login do
# Cognito mostra o QR code e exige o código do autenticador antes de liberar o
# painel.

STACK_NAME=${STACK_NAME:-"portfolio-site-dev"}
DOMAIN_NAME=${DOMAIN_NAME:-"abel.dev.br"}
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-"us-east-1"}}
PROFILE=${AWS_PROFILE:-""}
# Permite pular a busca no CloudFormation (útil quando o pool já é conhecido).
POOL_ID=${COGNITO_USER_POOL_ID:-""}

aws_cli() {
  if [ -n "$PROFILE" ]; then
    aws --region "$REGION" --profile "$PROFILE" "$@"
  else
    aws --region "$REGION" "$@"
  fi
}

if ! command -v aws >/dev/null 2>&1; then
  echo "[admin] AWS CLI não encontrado." >&2
  exit 1
fi

if [ -z "$POOL_ID" ]; then
  POOL_ID=$(aws_cli cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='AdminUserPoolId'].OutputValue" \
    --output text 2>/dev/null || true)
fi

if [ -z "$POOL_ID" ] || [ "$POOL_ID" = "None" ]; then
  echo "[admin] Não achei o AdminUserPoolId na stack $STACK_NAME ($REGION)." >&2
  echo "[admin] Rode o deploy primeiro ou passe COGNITO_USER_POOL_ID=us-east-1_xxxx." >&2
  exit 1
fi

if [ -z "${ADMIN_EMAIL:-}" ]; then
  read "ADMIN_EMAIL?E-mail do admin: "
fi

if [ -z "$ADMIN_EMAIL" ]; then
  echo "[admin] E-mail vazio. Abortando." >&2
  exit 1
fi

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  read -s "ADMIN_PASSWORD?Senha do admin: "
  echo
  read -s "ADMIN_PASSWORD_CONFIRM?Repita a senha: "
  echo
  if [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
    echo "[admin] As senhas não conferem. Abortando." >&2
    exit 1
  fi
fi

if [ -z "$ADMIN_PASSWORD" ]; then
  echo "[admin] Senha vazia. Abortando." >&2
  exit 1
fi

echo "[admin] Pool: $POOL_ID"
echo "[admin] Usuário: $ADMIN_EMAIL"

ERR_FILE=$(mktemp)
trap 'rm -f "$ERR_FILE"' EXIT

if aws_cli cognito-idp admin-get-user \
  --user-pool-id "$POOL_ID" \
  --username "$ADMIN_EMAIL" >/dev/null 2>"$ERR_FILE"; then
  echo "[admin] Usuário já existe; vou redefinir a senha."
else
  if grep -q "UserNotFoundException" "$ERR_FILE"; then
    echo "[admin] Criando usuário..."
    aws_cli cognito-idp admin-create-user \
      --user-pool-id "$POOL_ID" \
      --username "$ADMIN_EMAIL" \
      --user-attributes Name=email,Value="$ADMIN_EMAIL" Name=email_verified,Value=true \
      --message-action SUPPRESS >/dev/null
  else
    echo "[admin] Falha ao consultar o usuário:" >&2
    cat "$ERR_FILE" >&2
    exit 1
  fi
fi

echo "[admin] Definindo senha permanente..."
aws_cli cognito-idp admin-set-user-password \
  --user-pool-id "$POOL_ID" \
  --username "$ADMIN_EMAIL" \
  --password "$ADMIN_PASSWORD" \
  --permanent >/dev/null

echo
echo "[admin] Pronto."
echo "[admin] Abra https://$DOMAIN_NAME/admin e entre com este e-mail e senha."
echo "[admin] No primeiro login o Cognito pede para cadastrar o app autenticador"
echo "[admin] (Google Authenticator, Authy, 1Password etc.) com um QR code."
echo "[admin] Perdeu o celular? Rode: pnpm run admin:reset-mfa"