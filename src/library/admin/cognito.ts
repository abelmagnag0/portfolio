/**
 * Login do painel admin com Amazon Cognito.
 *
 * O site é export estático, então não existe servidor nosso para guardar um
 * segredo de client. O fluxo é Authorization Code + PKCE (RFC 7636), que é o
 * recomendado para clientes públicos: o `code_verifier` nasce no navegador e
 * só o hash vai na URL de autorização. Nenhuma senha passa por este código —
 * a tela de e-mail/senha/TOTP é a hosted UI do Cognito.
 *
 * O que fica guardado no navegador:
 *   - no `sessionStorage`, o par verifier/state do login em andamento — vale
 *     só para esta aba e some assim que o code é trocado;
 *   - no `localStorage`, os tokens da sessão. O `sessionStorage` é apagado
 *     quando a aba fecha, o que obrigava a fazer senha + TOTP toda vez. Com o
 *     refresh token de 30 dias e rotação ligada, o acesso dura sem virar
 *     permanente: `Sair` revoga o token no Cognito, e uma cópia reutilizada
 *     fora da janela de tolerância derruba a cadeia inteira.
 * A sessão do Cognito em si (o cookie da hosted UI) é gerenciada por ele.
 */

export type CognitoConfig = {
  cognitoHost: string;
  clientId: string;
  scopes: string[];
};

export type Session = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;
};

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

const PKCE_KEY = "portfolio.admin.pkce";
const SESSION_KEY = "portfolio.admin.session";
const CONFIG_KEY = "portfolio.admin.config";

// Renova um pouco antes de vencer, para uma requisição não cair no meio da
// troca de token.
const REFRESH_MARGIN_MS = 60_000;

// `localStorage` pode lançar (modo privado, política de terceiros, cota).
// O painel continua funcionando sem persistência; só volta a pedir login.
function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // sem armazenamento a sessão não sobrevive ao próximo carregamento
  }
}

function removeStored(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // nada a fazer
  }
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return base64Url(new Uint8Array(digest));
}

/** A página do painel é a própria callback URL configurada no pool. */
export function redirectUri(): string {
  return `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}`;
}

function tokenEndpoint(config: CognitoConfig): string {
  return `https://${config.cognitoHost}/oauth2/token`;
}

/* -------------------------------------------------------------------------- */
/* Configuração pública                                                       */
/* -------------------------------------------------------------------------- */

export function loadCachedConfig(): CognitoConfig | null {
  try {
    const raw = sessionStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CognitoConfig>;
    if (!parsed.cognitoHost || !parsed.clientId) return null;
    return {
      cognitoHost: parsed.cognitoHost,
      clientId: parsed.clientId,
      scopes: parsed.scopes?.length ? parsed.scopes : ["openid", "email", "profile"],
    };
  } catch {
    return null;
  }
}

export function cacheConfig(config: CognitoConfig): void {
  try {
    sessionStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // sem sessionStorage o login ainda funciona, só não fica em cache
  }
}

/**
 * Busca a configuração pública em `GET /api/config`. Devolve `null` quando a
 * API não existe ou não está configurada (dev local, primeiro deploy pendente):
 * nesse caso o painel mostra "login não configurado" em vez de quebrar.
 */
export async function fetchConfig(apiBase = ""): Promise<CognitoConfig | null> {
  try {
    const res = await fetch(`${apiBase}/api/config`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as Partial<CognitoConfig>;
    if (!body.cognitoHost || !body.clientId) return null;
    return {
      cognitoHost: body.cognitoHost,
      clientId: body.clientId,
      scopes: body.scopes?.length ? body.scopes : ["openid", "email", "profile"],
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Sessão                                                                     */
/* -------------------------------------------------------------------------- */

export function loadSession(): Session | null {
  try {
    const raw = readStored(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<Session>;
    // Sem refresh token a sessão morre junto com o access token em 8h; é
    // melhor pedir login agora do que abrir o painel e vê-lo falhar no meio.
    if (
      !session.accessToken ||
      !session.refreshToken ||
      !session.expiresAt ||
      !Number.isFinite(session.expiresAt)
    ) {
      return null;
    }
    return session as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  writeStored(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  removeStored(SESSION_KEY);
  try {
    sessionStorage.removeItem(PKCE_KEY);
  } catch {
    // nada a fazer
  }
}

function toSession(body: TokenResponse): Session | null {
  if (!body.access_token) return null;
  const expiresIn = Number(body.expires_in);
  return {
    accessToken: body.access_token,
    idToken: body.id_token || "",
    refreshToken: body.refresh_token || "",
    expiresAt: Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 3600) * 1000,
  };
}

async function postToken(
  config: CognitoConfig,
  params: Record<string, string>,
): Promise<{ session: Session | null; error: string }> {
  const res = await fetch(tokenEndpoint(config), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  let body: TokenResponse = {};
  try {
    body = (await res.json()) as TokenResponse;
  } catch {
    // resposta sem JSON: cai no erro genérico abaixo
  }

  if (!res.ok || !body.access_token) {
    return {
      session: null,
      error: body.error || `token request failed (${res.status})`,
    };
  }

  return { session: toSession(body), error: "" };
}

/**
 * Troca o refresh token por tokens novos. Devolve `null` se o Cognito recusar
 * (sessão revogada, refresh token vencido etc.) ou se a rede falhar.
 *
 * Duas abas do painel podem renovar ao mesmo tempo. Com a rotação ligada,
 * reusar o refresh token antigo depois da janela de tolerância faz o Cognito
 * tratar o pedido como vazamento e derrubar a sessão — por isso a renovação
 * passa por um lock entre abas e, antes de chamar o Cognito, reaproveita a
 * sessão que outra aba já gravou.
 */
export async function refreshSession(
  config: CognitoConfig,
  current: Session,
): Promise<Session | null> {
  try {
    if (typeof navigator !== "undefined" && navigator.locks) {
      return await navigator.locks.request("portfolio.admin.refresh", () =>
        refreshLocked(config, current),
      );
    }
    return await refreshLocked(config, current);
  } catch {
    return null;
  }
}

async function refreshLocked(
  config: CognitoConfig,
  current: Session,
): Promise<Session | null> {
  const stored = loadSession();
  if (stored && !sessionExpiresSoon(stored)) return stored;

  // A sessão guardada é a mais nova. `current` pode estar defasada numa aba
  // que ficou aberta por horas: usar o refresh token dela depois da janela de
  // tolerância faz o Cognito tratar como reuso e revogar a cadeia inteira.
  const refreshToken = stored?.refreshToken ?? current.refreshToken;
  if (!refreshToken) return null;

  const { session } = await postToken(config, {
    grant_type: "refresh_token",
    client_id: config.clientId,
    refresh_token: refreshToken,
  });

  if (!session) return null;

  // Com rotação ligada o Cognito devolve um refresh token novo; sem rotação,
  // o antigo continua valendo até o limite configurado no client.
  const next: Session = {
    ...session,
    refreshToken: session.refreshToken || refreshToken,
  };
  saveSession(next);
  return next;
}

/**
 * Revoga o refresh token no Cognito. O logout local já apaga a cópia do
 * navegador; revogar impede que uma cópia capturada antes continue renovando
 * a sessão pelos 30 dias de validade. Best-effort: se a rede falhar, o logout
 * acontece do mesmo jeito.
 */
export async function revokeRefreshToken(
  config: CognitoConfig,
  token: string,
): Promise<void> {
  try {
    await fetch(`https://${config.cognitoHost}/oauth2/revoke`, {
      method: "POST",
      // `keepalive` faz a requisição sobreviver ao redirecionamento do logout.
      keepalive: true,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, client_id: config.clientId }),
    });
  } catch {
    // best-effort
  }
}

export function sessionExpiresSoon(session: Session): boolean {
  return session.expiresAt - Date.now() < REFRESH_MARGIN_MS;
}

/* -------------------------------------------------------------------------- */
/* Fluxo de login                                                             */
/* -------------------------------------------------------------------------- */

let loginStarting = false;

/**
 * Manda o navegador para a hosted UI. O Cognito mostra e-mail, senha e, na
 * sequência, o desafio do TOTP; no primeiro acesso ele mesmo apresenta o QR
 * code para cadastrar o autenticador no celular.
 */
export function startLogin(config: CognitoConfig): void {
  // Duplo clique: duas chamadas seguidas geram states diferentes e a última
  // navegação pode não ser a que ficou no sessionStorage. Ignora a segunda.
  if (loginStarting) return;
  loginStarting = true;

  // Se o navegador bloquear a navegação, libera o botão para tentar de novo.
  setTimeout(() => {
    loginStarting = false;
  }, 4000);

  const verifier = randomString(48);
  const state = randomString(24);

  sessionStorage.setItem(
    PKCE_KEY,
    JSON.stringify({ verifier, state }),
  );

  // `startLogin` não é async porque o hash depende de crypto.subtle; o evento
  // de clique não espera uma promise, então o cálculo é feito aqui mesmo.
  void sha256Base64Url(verifier)
    .then((challenge) => {
      const url = new URL(`https://${config.cognitoHost}/oauth2/authorize`);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("redirect_uri", redirectUri());
      url.searchParams.set(
        "scope",
        (config.scopes.length ? config.scopes : ["openid", "email", "profile"]).join(" "),
      );
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", challenge);
      url.searchParams.set("code_challenge_method", "S256");
      // O managed login abre em inglês por padrão; o painel é PT e o dono é
      // brasileiro. O Cognito guarda a escolha num cookie, então o parâmetro só
      // precisa ir na primeira navegação.
      url.searchParams.set("lang", "pt-BR");
      window.location.assign(url.toString());
    })
    .catch(() => {
      loginStarting = false;
    });
}

export function hasLoginCallback(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has("code") || params.has("error");
}

/** Limpa `?code=...` da barra de endereço para um refresh não reutilizar o code. */
function clearCallbackUrl(): void {
  window.history.replaceState(null, "", window.location.pathname);
}

export type CallbackResult = { ok: true } | { ok: false; message: string };

// O React em modo estrito roda efeitos duas vezes em dev. Sem esta trava, a
// segunda execução encontraria o `?code` já consumido e mostraria um erro
// falso. A promessa é compartilhada entre as duas e limpa ao terminar.
let loginInFlight: Promise<CallbackResult> | null = null;

/**
 * Conclui o retorno da hosted UI: valida o `state`, troca o `code` por tokens
 * usando o verifier guardado e persiste a sessão.
 */
export function completeLogin(config: CognitoConfig): Promise<CallbackResult> {
  if (!loginInFlight) {
    loginInFlight = runCompleteLogin(config).finally(() => {
      loginInFlight = null;
    });
  }
  return loginInFlight;
}

async function runCompleteLogin(
  config: CognitoConfig,
): Promise<CallbackResult> {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const code = params.get("code");
  const state = params.get("state");

  let stored: { verifier?: string; state?: string } | null = null;
  try {
    const raw = sessionStorage.getItem(PKCE_KEY);
    stored = raw ? (JSON.parse(raw) as { verifier?: string; state?: string }) : null;
  } catch {
    stored = null;
  }
  sessionStorage.removeItem(PKCE_KEY);
  clearCallbackUrl();

  if (error) {
    return {
      ok: false,
      message:
        params.get("error_description") ||
        "Login cancelado. Tente de novo quando quiser.",
    };
  }

  if (!code || !stored?.verifier || !stored.state || stored.state !== state) {
    return {
      ok: false,
      message: "A resposta do login não confere. Comece de novo.",
    };
  }

  try {
    const { session } = await postToken(config, {
      grant_type: "authorization_code",
      client_id: config.clientId,
      code,
      redirect_uri: redirectUri(),
      code_verifier: stored.verifier,
    });

    if (!session) {
      return {
        ok: false,
        message: "Não foi possível concluir o login. Tente de novo.",
      };
    }

    saveSession(session);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Falha de conexão com o Cognito. Tente de novo.",
    };
  }
}

/**
 * URL de logout da hosted UI. Passar por ela encerra também a sessão do
 * Cognito (o cookie), não só a cópia local dos tokens. O retorno é a própria
 * página do painel, já deslogada.
 */
export function logoutUrl(config: CognitoConfig): string {
  const url = new URL(`https://${config.cognitoHost}/logout`);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("logout_uri", redirectUri());
  return url.toString();
}