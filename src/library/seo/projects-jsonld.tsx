import type { Project } from "@/library/sections/projects.data";
import { JsonLdScript } from "next-seo";
import { SITE_URL } from "./site";

type Props = {
  projects: Project[];
};

/**
 * ItemList de projetos como CreativeWork para ajudar o Google a entender o conteúdo da página.
 * Usa URLs estáveis para cada item (âncoras da seção de projetos).
 */
export function ProjectsJsonLd({ projects }: Props) {
  const items = projects.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${SITE_URL}/#project-${p.key}`,
    item: {
      "@type": "CreativeWork",
      name: p.title,
      description: p.description,
      ...(p.gallery?.[0] ?? p.images?.[0]
        ? { image: new URL(p.gallery?.[0] ?? p.images?.[0]!, SITE_URL).toString() }
        : {}),
    },
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items,
  } as const;

  return <JsonLdScript data={data} scriptKey="projects-itemlist" />;
}
