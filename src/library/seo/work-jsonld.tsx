import type { WorkCase } from "@/library/sections/work.data";
import { getWorkCopy } from "@/library/sections/work.data";
import type { Lang } from "@/library/utils/dictionary";
import { JsonLdScript } from "next-seo";
import { localeBase, SITE_URL } from "./site";

type Props = {
  work: WorkCase[];
  lang?: Lang;
};

/**
 * ItemList de cases como CreativeWork, para o Google entender o conteúdo da
 * página e os setores atendidos. As URLs apontam para as âncoras reais
 * (`#work-<key>`), criadas pelos `id` em `work.tsx`.
 */
export function WorkJsonLd({ work, lang = "pt-BR" }: Props) {
  const base = localeBase(lang);

  const items = work.map((item, idx) => {
    const copy = getWorkCopy(item, lang);
    return {
      "@type": "ListItem",
      position: idx + 1,
      url: `${base}/#work-${item.key}`,
      item: {
        "@type": "CreativeWork",
        name: item.client,
        headline: copy.title,
        abstract: copy.problem,
        about: copy.subtitle,
        // A stack também entra como palavra-chave: é o termo que o buscador
        // indexa quando alguém procura "Node.js" ou "PostgreSQL" junto do
        // nome do cliente — e é o mesmo vocabulário que um ATS procura.
        keywords: (lang === "en" && item.stack_en ? item.stack_en : item.stack).join(", "),
        inLanguage: lang === "en" ? "en" : "pt-BR",
        creator: { "@type": "Person", name: "Abel Magnago", url: SITE_URL },
      },
    } as const;
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items,
  } as const;

  return <JsonLdScript data={data} scriptKey="work-itemlist" />;
}