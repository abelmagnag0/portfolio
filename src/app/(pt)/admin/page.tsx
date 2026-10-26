"use client";

import * as React from "react";
import { Button } from "@/library/components/button";
import { cn } from "@/library/components/utils";
import {
  type CognitoConfig,
  type Session,
  cacheConfig,
  clearSession,
  completeLogin,
  fetchConfig,
  hasLoginCallback,
  loadCachedConfig,
  loadSession,
  logoutUrl,
  refreshSession,
  sessionExpiresSoon,
  startLogin,
} from "@/library/admin/cognito";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

type Counter = { key: string; value: number };

type Stats = {
  rangeDays: number;
  totalEvents: number;
  kpis: {
    views: number;
    uniqueSessions: number;
    cvDownloads: number;
    contacts: number;
    socialClicks: number;
    projectViews: number;
    leads: number;
    newLeads: number;
  };
  geography: {
    br: number;
    international: number;
    countries: { code: string; count: number }[];
    cities: { city: string; count: number }[];
  };
  devices: Counter[];
  browsers: Counter[];
  languages: Counter[];
  topPaths: Counter[];
  daily: { day: string; views: number; sessions: number; downloads: number; leads: number }[];
  leadsByStatus: { new: number; read: number; replied: number };
};

type Lead = {
  id: string;
  sk: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  countryName?: string;
  lang?: string;
};

function apiFetch(path: string, token: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
}

const COUNTRY_FLAGS: Record<string, string> = {
  BR: "🇧🇷", PT: "🇵🇹", US: "🇺🇸", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
  MX: "🇲🇽", CA: "🇨🇦", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸",
  IT: "🇮🇹", NL: "🇳🇱", IE: "🇮🇪", CH: "🇨🇭", JP: "🇯🇵", CN: "🇨🇳",
  IN: "🇮🇳", AU: "🇦🇺",
};

function Kpi({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {hint ? <div className="text-xs text-muted-foreground mt-1">{hint}</div> : null}
    </div>
  );
}

function Bars({ items, empty }: { items: Counter[]; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.key} className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="truncate pr-2">{item.key}</span>
            <span className="text-muted-foreground tabular-nums">{item.value}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ data }: { data: Stats["daily"] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  return (
    <div className="flex items-end gap-1 h-40">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center justify-end group">
          <div
            className="w-full bg-primary/70 group-hover:bg-primary rounded-t transition-colors"
            style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views > 0 ? 3 : 0 }}
            title={`${d.day}: ${d.views} acessos · ${d.sessions} visitantes`}
          />
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-medium mb-4">{title}</h3>
      {children}
    </section>
  );
}

export default function AdminPage() {
  // `checking` cobre o intervalo entre o carregamento da página e a resposta do
  // /api/config, para não piscar o botão de login antes de saber se ele existe.
  const [checking, setChecking] = React.useState(true);
  const [config, setConfig] = React.useState<CognitoConfig | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [authError, setAuthError] = React.useState("");
  const [days, setDays] = React.useState(30);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  /**
   * Fecha a sessão do navegador sem passar pelo Cognito. Usado quando a própria
   * API recusa o token (401): a sessão já não vale nada, então não faz sentido
   * mandar o visitante para a hosted UI.
   */
  const expireSession = React.useCallback(() => {
    clearSession();
    setSession(null);
    setStats(null);
    setLeads([]);
    setAuthError("Sua sessão expirou. Entre de novo.");
  }, []);

  /** Sair de verdade: encerra também a sessão do Cognito (o cookie da hosted UI). */
  const logout = React.useCallback(() => {
    clearSession();
    setSession(null);
    setStats(null);
    setLeads([]);
    if (config) window.location.assign(logoutUrl(config));
  }, [config]);

  /**
   * Primeiro carregamento. A ordem importa: se a URL traz `?code=...`, a
   * configuração precisa estar em mãos ANTES de trocar o code por tokens, senão
   * o code é perdido e o login nunca conclui.
   */
  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      let cfg = loadCachedConfig();

      if (!cfg) {
        cfg = await fetchConfig(API_BASE);
        if (cfg) cacheConfig(cfg);
      }

      if (cancelled) return;
      setConfig(cfg);

      if (hasLoginCallback()) {
        if (!cfg) {
          setAuthError(
            "Login indisponível: a API não respondeu. Tente de novo depois do deploy.",
          );
          setChecking(false);
          return;
        }
        const result = await completeLogin(cfg);
        if (cancelled) return;
        if (result.ok) {
          setSession(loadSession());
        } else {
          setAuthError(result.message);
        }
      } else {
        setSession(loadSession());
      }

      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const load = React.useCallback(
    async (token: string, d: number) => {
      setLoading(true);
      try {
        const [statsRes, leadsRes] = await Promise.all([
          apiFetch(`/api/admin/stats?days=${d}`, token),
          apiFetch(`/api/admin/leads?limit=100`, token),
        ]);
        if (statsRes.status === 401 || leadsRes.status === 401) {
          expireSession();
          return;
        }
        if (!statsRes.ok || !leadsRes.ok) {
          // Erro de backend (ex.: 500): mantém os dados anteriores e evita
          // renderizar um objeto incompleto que quebraria o painel.
          return;
        }
        const statsJson = (await statsRes.json()) as Stats;
        const leadsJson = (await leadsRes.json()) as { leads: Lead[] };
        setStats(statsJson);
        setLeads(leadsJson.leads || []);
      } catch {
        // mantém a tela como está
      } finally {
        setLoading(false);
      }
    },
    [expireSession],
  );

  // Com sessão em mãos: renova o access token se estiver perto de vencer e só
  // então busca os dados. Sem isso o painel abriria uma vez e morreria em 1h.
  React.useEffect(() => {
    if (!session) return;
    let cancelled = false;

    void (async () => {
      let current = session;

      if (sessionExpiresSoon(current) && config) {
        const refreshed = await refreshSession(config, current);
        if (cancelled) return;
        if (!refreshed) {
          expireSession();
          return;
        }
        current = refreshed;
        setSession(refreshed);
      }

      await load(current.accessToken, days);
    })();

    return () => {
      cancelled = true;
    };
  }, [session, config, days, load, expireSession]);

  const setLeadStatus = async (lead: Lead, status: Lead["status"]) => {
    if (!session) return;
    setLeads((prev) => prev.map((l) => (l.sk === lead.sk ? { ...l, status } : l)));
    try {
      await apiFetch("/api/admin/leads", session.accessToken, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sk: lead.sk, status }),
      });
    } catch {
      setLeads((prev) => prev.map((l) => (l.sk === lead.sk ? { ...l, status: lead.status } : l)));
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-4">
          <h1 className="text-2xl">Painel admin</h1>
          <p className="text-sm text-muted-foreground">
            Acesso restrito. O login é pelo Cognito, com senha e o código de 6
            dígitos do app autenticador. No primeiro acesso o próprio Cognito
            mostra o QR code para cadastrar o autenticador.
          </p>
          {authError ? (
            <p className="text-sm text-destructive" role="alert">{authError}</p>
          ) : null}
          {config ? (
            <Button className="w-full" onClick={() => startLogin(config)}>
              Entrar
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {checking
                ? "Verificando a configuração..."
                : "Login não configurado nesta origem. Ele passa a funcionar depois do primeiro deploy da API."}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border sticky top-0 bg-background/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">Painel</span>
            {loading ? <span className="text-xs text-muted-foreground">carregando...</span> : null}
          </div>
          <div className="flex items-center gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border border-border transition-colors",
                  days === d ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent",
                )}
              >
                {d}d
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Kpi label="Acessos" value={stats.kpis.views} />
              <Kpi label="Visitantes" value={stats.kpis.uniqueSessions} hint="sessões únicas" />
              <Kpi label="Downloads CV" value={stats.kpis.cvDownloads} />
              <Kpi label="Mensagens" value={stats.kpis.leads} hint={`${stats.kpis.newLeads} não lidas`} />
              <Kpi label="Cliques sociais" value={stats.kpis.socialClicks} />
              <Kpi label="Cases abertos" value={stats.kpis.projectViews} />
            </div>

            <Panel title={`Acessos · últimos ${stats.rangeDays} dias`}>
              <DailyChart data={stats.daily} />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{stats.daily[0]?.day}</span>
                <span>{stats.daily[stats.daily.length - 1]?.day}</span>
              </div>
            </Panel>

            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Origem (país)">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-sm text-muted-foreground">Brasil</div>
                    <div className="text-2xl font-semibold">{stats.geography.br}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-sm text-muted-foreground">Exterior</div>
                    <div className="text-2xl font-semibold">{stats.geography.international}</div>
                  </div>
                </div>
                <Bars
                  items={stats.geography.countries.map((c) => ({
                    key: `${COUNTRY_FLAGS[c.code] || "🌐"} ${c.code}`,
                    value: c.count,
                  }))}
                  empty="Sem dados ainda."
                />
              </Panel>

              <Panel title="Cidades">
                <Bars
                  items={stats.geography.cities.map((c) => ({ key: c.city, value: c.count }))}
                  empty="Sem dados ainda."
                />
              </Panel>

              <Panel title="Dispositivos">
                <Bars items={stats.devices} empty="Sem dados ainda." />
              </Panel>

              <Panel title="Navegadores">
                <Bars items={stats.browsers} empty="Sem dados ainda." />
              </Panel>

              <Panel title="Páginas / âncoras">
                <Bars items={stats.topPaths} empty="Sem dados ainda." />
              </Panel>

              <Panel title="Idioma">
                <Bars items={stats.languages} empty="Sem dados ainda." />
              </Panel>
            </div>

            <Panel title={`Leads recebidos (${leads.length})`}>
              {leads.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
              ) : (
                <div className="divide-y divide-border">
                  {leads.map((lead) => (
                    <div key={lead.sk} className="py-3">
                      <button
                        className="w-full text-left flex items-start justify-between gap-4"
                        onClick={() => setExpanded(expanded === lead.sk ? null : lead.sk)}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {lead.status === "new" ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">nova</span>
                            ) : null}
                            <span className="font-medium truncate">{lead.name}</span>
                            <span className="text-muted-foreground truncate">{lead.email}</span>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{lead.subject}</div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap text-right">
                          <div>{new Date(lead.createdAt).toLocaleString("pt-BR")}</div>
                          <div>{lead.countryName || "—"}</div>
                        </div>
                      </button>
                      {expanded === lead.sk ? (
                        <div className="mt-3 space-y-3">
                          <p className="text-sm whitespace-pre-wrap bg-muted/40 rounded-lg p-3">{lead.message}</p>
                          <div className="flex items-center gap-2">
                            <a
                              className="text-sm text-primary hover:underline"
                              href={`mailto:${lead.email}?subject=Re: ${encodeURIComponent(lead.subject)}`}
                            >
                              Responder por e-mail
                            </a>
                            <span className="grow" />
                            {(["new", "read", "replied"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => setLeadStatus(lead, s)}
                                className={cn(
                                  "px-2.5 py-1 rounded-md text-xs border border-border transition-colors",
                                  lead.status === s ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent",
                                )}
                              >
                                {s === "new" ? "não lida" : s === "read" ? "lida" : "respondida"}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </>
        ) : (
          <p className="text-muted-foreground">Carregando métricas...</p>
        )}
      </div>
    </main>
  );
}