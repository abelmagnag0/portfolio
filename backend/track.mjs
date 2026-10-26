/**
 * POST /api/track
 * Registra eventos de analytics do site (pageview, download de CV, cliques,
 * envio de contato, troca de idioma). Aceita um único evento por chamada.
 */
import { randomUUID } from "node:crypto";
import { json, badRequest, serverError } from "./lib/http.mjs";
import { putEvent } from "./lib/store.mjs";
import {
  parseBody,
  geoFromEvent,
  isBot,
  parseUserAgent,
  userAgentOf,
} from "./lib/request.mjs";

// Tipos de evento aceitos — evita gravação de lixo arbitrário.
const ALLOWED_TYPES = new Set([
  "pageview",
  "cv_download",
  "contact_submit",
  "contact_success",
  "contact_error",
  "social_click",
  "project_view",
  "section_view",
  "language_switch",
  "outbound_click",
]);

const MAX_NAME = 64;

function sanitizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "")
    .slice(0, MAX_NAME);
}

function dayKey(iso) {
  return iso.slice(0, 10); // YYYY-MM-DD (UTC)
}

export const handler = async (event) => {
  const body = parseBody(event) || {};

  const type = sanitizeName(body.type);
  if (!ALLOWED_TYPES.has(type)) {
    return badRequest("unknown event type");
  }

  const ua = userAgentOf(event);
  const geo = geoFromEvent(event);
  const { device, browser, os } = parseUserAgent(ua);

  // Session id: o front gera um uuid e mantém em sessionStorage; validamos o formato.
  const sessionId =
    typeof body.sessionId === "string" && /^[a-zA-Z0-9._-]{6,64}$/.test(body.sessionId)
      ? body.sessionId
      : randomUUID();

  const now = new Date();
  const iso = now.toISOString();
  const day = dayKey(iso);

  const item = {
    pk: `event#${day}`,
    sk: `${iso}#${randomUUID()}`,
    day,
    ts: now.getTime(),
    type,
    name: sanitizeName(body.name),
    path: String(body.path || "/").slice(0, 256),
    referrer: String(body.referrer || "").slice(0, 256),
    lang: body.lang === "en" ? "en" : "pt-BR",
    country: geo.country,
    countryName: geo.countryName,
    city: geo.city.slice(0, 64),
    device,
    browser,
    os,
    sessionId,
    bot: isBot(ua),
    expiresAt: Math.floor(now.getTime() / 1000) + 60 * 60 * 24 * 400,
  };

  try {
    await putEvent(item);
  } catch (err) {
    console.error("track: failed to persist event", err);
    return serverError();
  }

  return json(202, { ok: true });
};