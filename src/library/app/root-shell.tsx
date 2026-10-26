import { Analytics } from "@/library/analytics/analytics";
import { SettingsProvider } from "@/library/utils/settings-provider";
import {
  ROLE,
  ROLE_EN,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_NAME,
  SITE_URL,
} from "@/library/seo/site";
import type { Lang } from "@/library/utils/dictionary";
import { JsonLdScript, ProfilePageJsonLd } from "next-seo";
import { JetBrains_Mono, Newsreader, Public_Sans } from "next/font/google";
import "../../app/globals.css";

/**
 * Três famílias, três papéis — e uma distinção óbvia entre elas:
 *
 *   Newsreader     → display. Serifa editorial com contraste alto. Só aparece
 *                    grande; é o que dá voz à página em vez de mais um grotesco.
 *   Public Sans    → corpo e interface. Neutra, assenta em 16-18px sem cansar.
 *   JetBrains Mono → números, rótulos de seção, stack, datas.
 *
 * Nada de Inter/Roboto/system-ui como fonte principal: é o primeiro sintoma de
 * página gerada por máquina. O fallback abaixo existe para o FOUT em conexão
 * ruim, não como escolha.
 */
// Só o eixo normal: a itálica nunca é usada em nenhuma regra de estilo, e
// pedi-la fazia o Next pré-carregar mais um arquivo de 63 kB em toda visita —
// o maior dos quatro, baixado com prioridade alta para não ser lido.
const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const body = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Aplica o tema antes do primeiro paint e instala o toggle por delegação,
 * sem depender da hidratação do React.
 *
 * O padrão é o escuro — a página é desenhada em cinza quase preto. O claro
 * (papel quente) continua existindo e vence quando o visitante o escolheu
 * antes (localStorage) ou quando o sistema operacional pede claro.
 */
const THEME_SCRIPT = `(() => { try {
  const r = document.documentElement;
  const getStored = () => (localStorage.getItem('theme'));
  const prefersLight = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  const apply = (t) => { r.classList.remove('dark', 'light'); r.classList.add(t === 'light' ? 'light' : 'dark'); };
  const initial = (() => { const s = getStored(); if (s === 'light' || s === 'dark') return s; return prefersLight() ? 'light' : 'dark'; })();
  apply(initial);
  document.addEventListener('click', (e) => {
    const btn = (e.target && (e.target.closest ? e.target.closest('[data-theme-toggle]') : null));
    if (!btn) return;
    const next = r.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    apply(next);
  }, true);
} catch(_){} })();`;

/**
 * Casca comum a todas as rotas: `<html>`/`<body>`, fontes, JSON-LD de perfil,
 * script de tema, provider de idioma e analytics. Cada route group renderiza
 * sua própria casca com o `lang` correto, para que o HTML estático de cada
 * idioma saia com o atributo certo (não só o conteúdo client-side).
 */
export function RootShell({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const description = lang === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="antialiased">
        {/* JSON-LD global: página de perfil da pessoa (ideal para portfólio pessoal) */}
        <ProfilePageJsonLd
          mainEntity={{
            name: SITE_NAME,
            alternateName: "Abel dev",
            description,
            sameAs: [
              "https://github.com/abelmagnag0",
              "https://www.linkedin.com/in/abel-magnago1",
            ],
            url: SITE_URL,
          }}
        />
        {/* Identificação (cargo, áreas, idiomas) — campos que o tipo Person do
            next-seo não expõe, então vão num nó Person próprio. É quem ele é,
            não sinal de que está procurando vaga. */}
        <JsonLdScript
          scriptKey="person-profile"
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: SITE_NAME,
            jobTitle: lang === "en" ? ROLE_EN : ROLE,
            knowsAbout: [
              "Node.js",
              "TypeScript",
              "React",
              "Next.js",
              "PostgreSQL",
              "MongoDB",
              "AWS",
              "Docker",
              "Software Architecture",
              "Legacy System Migration",
            ],
            knowsLanguage: ["pt-BR", "en"],
            sameAs: [
              "https://github.com/abelmagnag0",
              "https://www.linkedin.com/in/abel-magnago1",
            ],
            url: SITE_URL,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <SettingsProvider initialLang={lang}>
          <Analytics />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}