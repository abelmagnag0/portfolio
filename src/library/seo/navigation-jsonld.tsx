import { JsonLdScript } from "next-seo";
import type { Lang } from "@/library/utils/dictionary";
import { localeBase } from "./site";

/**
 * Marcações de navegação do site (SiteNavigationElement).
 *
 * Os hashes precisam acompanhar os `id` das seções reais — apontar para uma
 * âncora que não existe é pior do que não ter a marcação.
 */
export function NavigationJsonLd({ lang = "pt-BR" }: { lang?: Lang }) {
  const en = lang === "en";
  const base = localeBase(lang);

  const navItems = [
    { name: en ? "Home" : "Início", alternateName: en ? "Início" : "Home", hash: "#home" },
    { name: en ? "Work" : "Cases", alternateName: en ? "Cases" : "Work", hash: "#work" },
    {
      name: en ? "Track record" : "Trajetória",
      alternateName: en ? "Trajetória" : "Track record",
      hash: "#experience",
    },
    {
      name: en ? "Credentials" : "Credenciais",
      alternateName: en ? "Credenciais" : "Credentials",
      hash: "#credentials",
    },
    {
      name: en ? "How I work" : "Como trabalho",
      alternateName: en ? "Como trabalho" : "How I work",
      hash: "#capabilities",
    },
    { name: en ? "Contact" : "Contato", alternateName: en ? "Contato" : "Contact", hash: "#contact" },
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: navItems.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      alternateName: item.alternateName,
      url: `${base}/${item.hash}`,
    })),
  } as const;

  return <JsonLdScript data={data} scriptKey="site-navigation" />;
}