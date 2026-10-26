/**
 * Cliente de analytics first-party.
 *
 * Envia eventos para `/api/track` (CloudFront → Lambda). Usa `sendBeacon`
 * quando disponível para não impactar a navegação, com `fetch(keepalive)`
 * como fallback. Nunca lança: falhas de analytics não devem afetar o usuário.
 */

export type AnalyticsEventType =
  | "pageview"
  | "cv_download"
  | "contact_submit"
  | "contact_success"
  | "contact_error"
  | "social_click"
  | "project_view"
  | "section_view"
  | "language_switch"
  | "outbound_click"
  | "decisions_explain"
  | "decisions_toggle";

type TrackPayload = {
  type: AnalyticsEventType;
  name?: string;
  path?: string;
  referrer?: string;
  lang?: string;
  sessionId?: string;
  [key: string]: unknown;
};

// Base da API. Vazio = mesma origem (CloudFront → /api/*), o caso padrão.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const SESSION_KEY = "portfolio.sid";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function currentLang(): string {
  if (typeof document === "undefined") return "pt-BR";
  return document.documentElement.lang === "en" ? "en" : "pt-BR";
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.hash}`;
}

export function track(type: AnalyticsEventType, name = "", extra?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const payload: TrackPayload = {
    type,
    name,
    path: currentPath(),
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    lang: currentLang(),
    sessionId: getSessionId(),
    ...extra,
  };

  const url = `${API_BASE}/api/track`;

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      mode: "cors",
    }).catch(() => {});
  } catch {
    // silencioso por design
  }
}
