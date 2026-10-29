import { SITE_URL } from "@/library/seo/site";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // 1 dia

/**
 * O export estático do Next gera, ao lado de cada página, um `.txt` com a
 * carga do React Server Components (`/index.txt`, `/pt.txt`, `/admin.txt`).
 * Eles não são páginas: servem para a navegação do próprio site e repetem o
 * conteúdo do HTML. Ficam fora do índice porque são duplicata, não porque
 * escondem alguma coisa.
 *
 * O `$` no fim ancora a regra no nome do arquivo; o `robots.txt` em si é
 * sempre buscado pelos crawlers, independente do que estiver escrito aqui.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/*.txt$"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}