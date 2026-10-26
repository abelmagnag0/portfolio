/**
 * Helpers de resposta HTTP para os handlers das Lambdas (API Gateway v2 / HTTP API).
 */

const BASE_HEADERS = {
  "cache-control": "no-store",
};

export function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...BASE_HEADERS,
      ...headers,
    },
    body: JSON.stringify(body ?? null),
  };
}

export function noContent(headers = {}) {
  return { statusCode: 204, headers: { ...BASE_HEADERS, ...headers }, body: "" };
}

export function badRequest(message) {
  return json(400, { error: message });
}

export function unauthorized(message = "Unauthorized") {
  return json(401, { error: message });
}

export function notFound(message = "Not found") {
  return json(404, { error: message });
}

export function serverError(message = "Internal error") {
  return json(500, { error: message });
}
