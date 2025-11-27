import { JsonLdScript } from "next-seo";
import { SITE_URL } from "./site";

/**
 * Marcações de navegação do site (SiteNavigationElement).
 */
export function NavigationJsonLd() {
  const navItems = [
    { name: "Início", alternateName: "Home", hash: "#home" },
    { name: "Sobre", alternateName: "About", hash: "#about" },
    { name: "Cases", alternateName: "Projects", hash: "#projects" },
    { name: "Contato", alternateName: "Contact", hash: "#contact" },
  ] as const;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: navItems.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      alternateName: item.alternateName,
      url: `${SITE_URL}/${item.hash}`,
    })),
  } as const;

  return <JsonLdScript data={data} scriptKey="site-navigation" />;
}
