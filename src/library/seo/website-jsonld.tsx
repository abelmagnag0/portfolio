import { JsonLdScript } from "next-seo";
import type { Lang } from "@/library/utils/dictionary";
import {
  CURRENT_EMPLOYER,
  PERSON_ID,
  ROLE,
  ROLE_EN,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_NAME,
  SITE_URL,
  SOCIAL,
} from "./site";

/**
 * WebSite + Person: diz ao Google quem mantém o site e o que ele faz.
 * O `name` sai do mesmo `ROLE` usado no resto do site, para o posicionamento
 * não divergir entre a página, o cartão de link e o dado estruturado.
 *
 * A `Person` referencia o mesmo `@id` do nó do `root-shell` em vez de repetir
 * os dados: dois nós com o mesmo `@id` são a mesma entidade para o buscador, e
 * repetir o conteúdo só cria duas versões que podem divergir.
 */
export function WebsiteJsonLd({ lang = "pt-BR" }: { lang?: Lang }) {
  const en = lang === "en";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: en ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
        inLanguage: en ? "en" : "pt-BR",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: en ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
        jobTitle: en ? ROLE_EN : ROLE,
        worksFor: { "@type": "Organization", name: CURRENT_EMPLOYER },
        sameAs: [SOCIAL.github, SOCIAL.linkedin],
      },
    ],
  } as const;

  return <JsonLdScript data={data} scriptKey="website" />;
}