/**
 * POST /api/leads
 * Recebe a mensagem do formulário de contato, valida, persiste no DynamoDB
 * e notifica o dono do site por e-mail (AWS SES).
 */
import { randomUUID } from "node:crypto";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { json, badRequest, serverError } from "./lib/http.mjs";
import { putLead } from "./lib/store.mjs";
import { parseBody, geoFromEvent, userAgentOf, isBot } from "./lib/request.mjs";

// O domínio (abel.dev.br) e o destinatário estão verificados no SES de
// sa-east-1, que também está fora do sandbox. O stack roda em us-east-1
// (exigido pelo ACM do CloudFront), então fixamos a região do SES via env.
const ses = new SESv2Client({ region: process.env.SES_REGION || "sa-east-1" });

const MAX = { name: 120, email: 254, subject: 160, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABEL = {
  name: "Nome",
  email: "E-mail",
  subject: "Assunto",
  message: "Mensagem",
};

function clean(value, max) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const handler = async (event) => {
  const body = parseBody(event);
  if (!body) return badRequest("invalid body");

  // Honeypot: campo oculto que só bots preenchem. Finge sucesso.
  if (clean(body.company, 100)) {
    return json(200, { ok: true });
  }

  const lead = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    subject: clean(body.subject, MAX.subject) || "Contato via portfólio",
    message: clean(body.message, MAX.message),
    lang: body.lang === "en" ? "en" : "pt-BR",
  };

  const errors = [];
  if (lead.name.length < 2) errors.push("name");
  if (!EMAIL_RE.test(lead.email)) errors.push("email");
  if (lead.message.length < 10) errors.push("message");
  if (errors.length) {
    return badRequest(`invalid fields: ${errors.join(", ")}`);
  }

  const ua = userAgentOf(event);
  const geo = geoFromEvent(event);
  const now = new Date();
  const iso = now.toISOString();
  const id = randomUUID();

  const item = {
    pk: "lead",
    // UUID no fim: o ISO sozinho colide quando dois leads chegam no mesmo
    // milissegundo, e o PutItem sobrescreveria o primeiro. O prefixo ISO
    // continua ordenando por data na query do painel.
    sk: `${iso}#${id}`,
    id,
    status: "new",
    createdAt: iso,
    name: lead.name,
    email: lead.email,
    subject: lead.subject,
    message: lead.message,
    lang: lead.lang,
    country: geo.country,
    countryName: geo.countryName,
    city: geo.city,
    bot: isBot(ua),
  };

  const recipient = process.env.LEAD_RECIPIENT || "";
  const sender = process.env.SES_SENDER || "";

  // Primeiro persiste; o lead nunca se perde mesmo se o e-mail falhar.
  try {
    await putLead(item);
  } catch (err) {
    console.error("leads: failed to persist lead", err);
    return serverError();
  }

  // Notificação por e-mail (best-effort: não bloqueia a resposta ao usuário).
  if (recipient && sender) {
    try {
      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: sender,
          Destination: { ToAddresses: [recipient] },
          ReplyToAddresses: [lead.email],
          Content: {
            Simple: {
              Subject: {
                Data: `[Portfólio] ${lead.subject} — ${lead.name}`,
                Charset: "UTF-8",
              },
              Body: {
                Text: {
                  Charset: "UTF-8",
                  Data: [
                    "Novo contato pelo formulário do portfólio",
                    "",
                    `Nome: ${lead.name}`,
                    `E-mail: ${lead.email}`,
                    `Assunto: ${lead.subject}`,
                    `Idioma: ${lead.lang}`,
                    `País: ${geo.countryName}${geo.city ? ` (${geo.city})` : ""}`,
                    "",
                    "Mensagem:",
                    lead.message,
                  ].join("\n"),
                },
                Html: {
                  Charset: "UTF-8",
                  Data: `<h2>Novo contato pelo portfólio</h2>
<p>
  <strong>${escapeHtml(FIELD_LABEL.name)}:</strong> ${escapeHtml(lead.name)}<br/>
  <strong>${escapeHtml(FIELD_LABEL.email)}:</strong> ${escapeHtml(lead.email)}<br/>
  <strong>${escapeHtml(FIELD_LABEL.subject)}:</strong> ${escapeHtml(lead.subject)}<br/>
  <strong>Idioma:</strong> ${escapeHtml(lead.lang)}<br/>
  <strong>País:</strong> ${escapeHtml(geo.countryName)}${geo.city ? ` (${escapeHtml(geo.city)})` : ""}
</p>
<hr/>
<p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`,
                },
              },
            },
          },
        }),
      );
    } catch (err) {
      console.error("leads: SES send failed (lead já salvo)", err);
    }
  }

  return json(201, { ok: true });
};