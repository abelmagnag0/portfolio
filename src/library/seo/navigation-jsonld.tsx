import { JsonLdScript } from "next-seo";
import { SITE_URL } from "./site";

/**
 * Marcações de navegação do site (SiteNavigationElement).
 */
export function NavigationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: ["Home", "Projetos", "Contato"],
    url: [`${SITE_URL}/#home`, `${SITE_URL}/#projetos`, `${SITE_URL}/#contato`],
  } as const;

  return <JsonLdScript data={data} scriptKey="site-navigation" />;
}
