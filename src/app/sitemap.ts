import { ALTERNATE_LANGUAGES, CONTENT_LAST_MODIFIED, LOCALE_PATH, SITE_URL } from "@/library/seo/site";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // 1 dia

/**
 * Só as duas páginas de casa. O `/admin` fica de fora de propósito: é painel
 * privado e já está barrado no `robots.txt`.
 *
 * As URLs e o `hreflang` saem de `LOCALE_PATH`, a mesma fonte que os layouts
 * usam — assim o sitemap não pode discordar do que o HTML declara.
 *
 * O `lastmod` é a data de conteúdo declarada em `CONTENT_LAST_MODIFIED`, não a
 * hora do build: publicar um ajuste de CSS não é mudança de conteúdo, e um
 * `lastmod` que muda a cada deploy perde a credibilidade como sinal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = CONTENT_LAST_MODIFIED;
  const languages = Object.fromEntries(
    Object.entries(ALTERNATE_LANGUAGES).map(([tag, path]) => [tag, `${SITE_URL}${path}`]),
  );

  return [
    {
      url: `${SITE_URL}${LOCALE_PATH.en}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}${LOCALE_PATH["pt-BR"]}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}