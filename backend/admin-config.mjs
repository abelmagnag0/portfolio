/**
 * GET /api/config
 *
 * Devolve os dados públicos do Cognito que o painel usa para montar a URL de
 * login. Não existe segredo aqui: host do domínio e client id são públicos por
 * natureza (o client é PKCE, sem secret). Se as variáveis não existirem, a
 * resposta é 404 e o painel mostra "login não configurado" em vez de quebrar.
 */
import { json, notFound } from "./lib/http.mjs";

export const handler = async () => {
  const host = process.env.COGNITO_HOST;
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (!host || !clientId) {
    console.error("admin-config: COGNITO_HOST/COGNITO_CLIENT_ID ausentes");
    return notFound("login not configured");
  }

  return json(200, {
    cognitoHost: host,
    clientId,
    scopes: ["openid", "email", "profile"],
  });
};
