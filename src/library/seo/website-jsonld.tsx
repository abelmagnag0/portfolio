import { JsonLdScript } from "next-seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL } from "./site";

/**
 * WebSite JSON-LD com Site Name e Sitelinks Search Box (via SearchAction do Google).
 * Ajuda o Google a exibir o nome do site (Abel Magnago) e pode habilitar sitelinks.
 */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: `${SITE_NAME} · Tech Lead & Engenheiro Full Stack & Mobile`,
    url: `${SITE_URL}/`,
    inLanguage: "pt-BR",
    description: SITE_DESCRIPTION,
    sameAs: [SOCIAL.github, SOCIAL.linkedin],
    potentialAction: {
      "@type": "SearchAction",
      target: `https://www.google.com/search?q=site:${new URL(SITE_URL).host}+{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } as const;

  return <JsonLdScript data={data} scriptKey="website" />;
}
