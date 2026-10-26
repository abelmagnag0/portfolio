/**
 * Utilidades para interpretar a requisição: corpo, geo (headers do CloudFront),
 * device/browser derivados do User-Agent e identificação de bots.
 */

const COUNTRY_NAMES = {
  BR: "Brasil",
  PT: "Portugal",
  US: "Estados Unidos",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colômbia",
  MX: "México",
  CA: "Canadá",
  GB: "Reino Unido",
  DE: "Alemanha",
  FR: "França",
  ES: "Espanha",
  IT: "Itália",
  NL: "Holanda",
  IE: "Irlanda",
  CH: "Suíça",
  JP: "Japão",
  CN: "China",
  IN: "Índia",
  AU: "Austrália",
};

export function countryName(code) {
  if (!code) return "Desconhecido";
  return COUNTRY_NAMES[code] || code;
}

export function parseBody(event) {
  if (!event || !event.body) return null;
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Header case-insensitive (HTTP API preserva o nome original). */
function header(event, name) {
  const headers = event.headers || {};
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) return value;
  }
  return undefined;
}

/** Geo fornecida pelo CloudFront (sem precisar de IP do visitante). */
export function geoFromEvent(event) {
  const country = header(event, "cloudfront-viewer-country") || "";
  const city = header(event, "cloudfront-viewer-city") || "";
  const region = header(event, "cloudfront-viewer-country-region-name") || "";
  return { country, countryName: countryName(country), city, region };
}

const BOT_RE =
  /bot|crawler|spider|crawling|bingpreview|facebookexternalhit|slackbot|whatsapp|telegrambot|googlebot|semrush|ahrefs|gtmetrix|lighthouse|pingdom|uptimerobot/i;

export function isBot(userAgent) {
  return BOT_RE.test(String(userAgent || ""));
}

export function parseUserAgent(ua = "") {
  const s = String(ua);
  const device = /mobile|iphone|android(?!.*tablet)|ipod/i.test(s)
    ? "mobile"
    : /tablet|ipad/i.test(s)
      ? "tablet"
      : "desktop";

  let browser = "other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/chrome|crios/i.test(s)) browser = "Chrome";
  else if (/firefox|fxios/i.test(s)) browser = "Firefox";
  else if (/safari/i.test(s)) browser = "Safari";

  let os = "other";
  if (/windows/i.test(s)) os = "Windows";
  else if (/android/i.test(s)) os = "Android";
  else if (/iphone|ipad|ipod|ios/i.test(s)) os = "iOS";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/linux/i.test(s)) os = "Linux";

  return { device, browser, os };
}

export function userAgentOf(event) {
  return header(event, "user-agent") || "";
}

export function sourceIp(event) {
  return event?.requestContext?.http?.sourceIp || "";
}
