/**
 * GET /api/admin/stats?days=30
 * Agrega métricas de analytics para o painel admin.
 */
import { json, serverError } from "./lib/http.mjs";
import { ddb, TABLES, queryAll } from "./lib/store.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const MAX_DAYS = 90;

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function lastNDays(n) {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(isoDay(d));
  }
  return days;
}

function topN(counter, n = 10) {
  return Object.entries(counter)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

async function countLeadsByStatus(status) {
  let total = 0;
  let lastKey;
  do {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.leads,
        IndexName: "byStatus",
        KeyConditionExpression: "#s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status },
        Select: "COUNT",
        ExclusiveStartKey: lastKey,
      }),
    );
    total += res.Count || 0;
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
  return total;
}

export const handler = async (event) => {
  // A autorização acontece no API Gateway (authorizer JWT). Aqui só chega
  // requisição com access token válido do Cognito.
  const qs = event.queryStringParameters || {};
  const requested = Number.parseInt(qs.days, 10);
  const days = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_DAYS) : 30;
  const dayList = lastNDays(days);

  try {
    const pages = await Promise.all(
      dayList.map((day) =>
        queryAll({
          TableName: TABLES.events,
          IndexName: "byDay",
          KeyConditionExpression: "#d = :d",
          ExpressionAttributeNames: { "#d": "day" },
          ExpressionAttributeValues: { ":d": day },
        }),
      ),
    );
    const events = pages.flat();

    const countries = {};
    const cities = {};
    const devices = {};
    const browsers = {};
    const paths = {};
    const languages = {};
    const sessions = new Set();
    const dailyMap = Object.fromEntries(
      dayList.map((d) => [d, { day: d, views: 0, sessions: new Set(), downloads: 0, leads: 0 }]),
    );

    let views = 0;
    let cvDownloads = 0;
    let contacts = 0;
    let socialClicks = 0;
    let projectViews = 0;

    for (const ev of events) {
      if (ev.bot) continue; // ignora bots nas métricas
      const bucket = dailyMap[ev.day];
      if (ev.sessionId) sessions.add(ev.sessionId);
      if (bucket && ev.sessionId) bucket.sessions.add(ev.sessionId);

      switch (ev.type) {
        case "pageview":
          views += 1;
          if (bucket) bucket.views += 1;
          break;
        case "cv_download":
          cvDownloads += 1;
          if (bucket) bucket.downloads += 1;
          break;
        case "contact_submit":
        case "contact_success":
          contacts += 1;
          if (bucket) bucket.leads += 1;
          break;
        case "social_click":
          socialClicks += 1;
          break;
        case "project_view":
          projectViews += 1;
          break;
        default:
          break;
      }

      const c = ev.country || "??";
      countries[c] = (countries[c] || 0) + 1;
      if (ev.city) cities[`${ev.city}/${c}`] = (cities[`${ev.city}/${c}`] || 0) + 1;
      devices[ev.device || "other"] = (devices[ev.device || "other"] || 0) + 1;
      browsers[ev.browser || "other"] = (browsers[ev.browser || "other"] || 0) + 1;
      paths[ev.path || "/"] = (paths[ev.path || "/"] || 0) + 1;
      languages[ev.lang || "pt-BR"] = (languages[ev.lang || "pt-BR"] || 0) + 1;
    }

    const brCount = countries.BR || 0;
    const intlCount = Object.entries(countries).reduce(
      (acc, [code, value]) => (code === "BR" ? acc : acc + value),
      0,
    );

    const [newLeads, readLeads, repliedLeads] = await Promise.all([
      countLeadsByStatus("new"),
      countLeadsByStatus("read"),
      countLeadsByStatus("replied"),
    ]);

    const daily = dayList.map((d) => ({
      day: d,
      views: dailyMap[d].views,
      sessions: dailyMap[d].sessions.size,
      downloads: dailyMap[d].downloads,
      leads: dailyMap[d].leads,
    }));

    return json(200, {
      rangeDays: days,
      totalEvents: events.length,
      kpis: {
        views,
        uniqueSessions: sessions.size,
        cvDownloads,
        contacts,
        socialClicks,
        projectViews,
        leads: newLeads + readLeads + repliedLeads,
        newLeads,
      },
      geography: {
        br: brCount,
        international: intlCount,
        countries: topN(countries, 12).map((c) => ({ code: c.key, count: c.value })),
        cities: topN(cities, 10).map((c) => ({ city: c.key, count: c.value })),
      },
      devices: topN(devices, 6),
      browsers: topN(browsers, 6),
      languages: topN(languages, 4),
      topPaths: topN(paths, 10),
      daily,
      leadsByStatus: { new: newLeads, read: readLeads, replied: repliedLeads },
    });
  } catch (err) {
    console.error("admin-stats: aggregation failed", err);
    return serverError();
  }
};