/**
 * GET  /api/admin/leads?limit=50        -> lista os leads mais recentes
 * PATCH /api/admin/leads {sk, status}   -> atualiza o status de um lead
 */
import { json, badRequest, serverError } from "./lib/http.mjs";
import { ddb, TABLES, updateLead } from "./lib/store.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const VALID_STATUS = new Set(["new", "read", "replied"]);
const MAX_LIMIT = 200;

async function listLeads(limit) {
  // Uma única query já traz os `limit` leads mais recentes (ScanIndexForward=false).
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLES.leads,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: { ":pk": "lead" },
      ScanIndexForward: false,
      Limit: limit,
    }),
  );
  return res.Items || [];
}

async function patchLead(body) {
  const sk = typeof body.sk === "string" ? body.sk : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!sk || !VALID_STATUS.has(status)) {
    throw Object.assign(new Error("sk and valid status required"), { statusCode: 400 });
  }
  const updated = await updateLead("lead", sk, { status });
  return updated;
}

export const handler = async (event) => {
  // A autorização acontece no API Gateway (authorizer JWT). Aqui só chega
  // requisição com access token válido do Cognito.
  const method = event.requestContext?.http?.method || "GET";

  try {
    if (method === "GET") {
      const qs = event.queryStringParameters || {};
      const requested = Number.parseInt(qs.limit, 10);
      const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_LIMIT) : 50;
      const leads = await listLeads(limit);
      return json(200, { leads });
    }

    if (method === "PATCH") {
      const body = event.body
        ? JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body)
        : {};
      const updated = await patchLead(body);
      return json(200, { lead: updated });
    }

    return badRequest("unsupported method");
  } catch (err) {
    if (err?.statusCode === 400) return badRequest(err.message);
    console.error("admin-leads: failed", err);
    return serverError();
  }
};