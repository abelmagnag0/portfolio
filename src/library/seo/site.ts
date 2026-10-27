export const SITE_URL = "https://abel.dev.br" as const;
export const SITE_NAME = "Abel Magnago" as const;
/**
 * Posicionamento profissional.
 *
 * Estes textos seguem o currículo do Abel, que é a fonte da verdade — e não o
 * que o site dizia antes. A versão anterior anunciava "Tech Lead & Mobile /
 * React Native"; nenhuma das duas coisas aparece no currículo dele. Ele não tem
 * cargo de liderança formal nem React Native. Alegar isso num portfólio é o tipo
 * de exagero que aparece na primeira entrevista técnica e custa a vaga inteira,
 * então a descrição foi realinhada ao que ele realmente entrega.
 */
export const ROLE = "Engenheiro de Software" as const;
export const ROLE_EN = "Software Engineer" as const;

export const SITE_DESCRIPTION =
  "Engenheiro de Software no Rio de Janeiro: Node.js, TypeScript, React e AWS, sistemas de governo, jurídico e educação e IA em produção." as const;
export const SITE_DESCRIPTION_EN =
  "Software Engineer in Rio de Janeiro: Node.js, TypeScript, React and AWS, government, legal and education systems, and AI in production." as const;

export const SOCIAL = {
  github: "https://github.com/abelmagnag0",
  linkedin: "https://www.linkedin.com/in/abel-magnago1",
} as const;

/**
 * Dados de identificação que alimentam o JSON-LD (`Person`).
 *
 * Ficam aqui, e não soltos nos componentes, para que a página, o cartão de
 * link e o dado estruturado não possam divergir — e para o Google conseguir
 * ligar a pessoa à instituição em que trabalha, à faculdade e à credencial.
 *
 * São afirmações conferíveis (as mesmas que estão na tela, em Formação e
 * Experiência), não um resumo de vendas: dado estruturado inventado é o tipo
 * de exagero que aparece na primeira entrevista técnica.
 */
export const CURRENT_EMPLOYER = "Controladoria-Geral do Estado do Rio de Janeiro" as const;
export const ALMA_MATER = "Universidade Unigranrio | Afya" as const;
export const TOP_CREDENTIAL =
  "Certificate in AI and Digital Transformation in Government, Saïd Business School, University of Oxford" as const;
export const PERSON_ID = `${SITE_URL}/#person` as const;

/**
 * Título da página.
 *
 * O `<title>` é o sinal de maior peso na SERP e o `og:title` é a manchete que
 * aparece no preview de link — que, para um portfólio enviado por LinkedIn ou
 * WhatsApp, é literalmente a primeira coisa que o recrutador lê. Só o nome
 * próprio não diz o que ele faz, então o cargo vai junto nos dois.
 *
 * `og:site_name` continua sendo só o nome: ali o campo é o nome do site, não
 * o da página.
 */
export const PAGE_TITLE = `${SITE_NAME} · ${ROLE}` as const;
export const PAGE_TITLE_EN = `${SITE_NAME} · ${ROLE_EN}` as const;

/**
 * Onde cada idioma mora — fonte única.
 *
 * O inglês é a raiz e o português fica em `/pt`: o alvo principal dele é o
 * mercado de fora, então quem cai de um link compartilhado encontra a versão em
 * inglês. Antes esse mapa estava escrito duas vezes, um em cada layout, e as duas
 * cópias podiam divergir — agora os layouts, o sitemap e o `hreflang` leem daqui.
 *
 * O `x-default` aponta para a raiz por ser o fallback de quem não casa com
 * nenhum idioma declarado.
 */
export const LOCALE_PATH = { "pt-BR": "/pt", en: "/" } as const;

export const ALTERNATE_LANGUAGES = {
  "pt-BR": LOCALE_PATH["pt-BR"],
  en: LOCALE_PATH.en,
  "x-default": LOCALE_PATH.en,
} as const;

/**
 * URL absoluta da raiz de um idioma, **sem barra final**.
 *
 * Existe porque a raiz do inglês é `/`, e concatenar `SITE_URL + "/"` com uma
 * âncora produziria `abel.dev.br//#work`. Aqui o caso da raiz devolve a URL
 * limpa, e o português devolve `abel.dev.br/pt`.
 */
export function localeBase(lang: "pt-BR" | "en"): string {
  const path = LOCALE_PATH[lang];
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export const OG_ALT = `${SITE_NAME} · Engenheiro de Software` as const;
export const OG_ALT_EN = `${SITE_NAME} · Software Engineer` as const;

/**
 * Cartões de preview de link.
 *
 * Apontam para PNGs estáticos em `public/`, gerados por `scripts/build-og.mjs`
 * (`pnpm og`). A convenção `opengraph-image.tsx` do Next não funciona aqui:
 * ela exige runtime de edge e o projeto usa `output: 'export'`, então a rota
 * simplesmente não era gerada — todo preview de link respondia 404.
 */
export const DEFAULT_OG = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: OG_ALT,
} as const;

export const DEFAULT_OG_EN = {
  url: "/og-en.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: OG_ALT_EN,
} as const;
