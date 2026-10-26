import { JsonLdScript } from "next-seo";
import type { Lang } from "@/library/utils/dictionary";
import {
  ROLE,
  ROLE_EN,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_NAME,
  SITE_URL,
} from "./site";

/**
 * WebSite + Person: diz ao Google quem mantém o site e o que ele faz.
 * O `name` sai do mesmo `ROLE` usado no resto do site, para o posicionamento
 * não divergir entre a página, o cartão de link e o dado estruturado.
 */
export function WebsiteJsonLd({ lang = "pt-BR" }: { lang?: Lang }) {
  const en = lang === "en";
  const site = SITE_URL;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: SITE_NAME,
        description: en ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
        inLanguage: en ? "en" : "pt-BR",
        publisher: { "@id": `${site}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${site}/#person`,
        name: SITE_NAME,
        url: site,
        jobTitle: en ? ROLE_EN : ROLE,
        sameAs: [
          "https://github.com/abelmagnag0",
          "https://www.linkedin.com/in/abel-magnago1",
        ],
      },
    ],
  } as const;

  return <JsonLdScript data={data} scriptKey="website" />;
}