import type { MetadataRoute } from "next";

export const revalidate = 86400; // 1 dia

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://abel.dev.br/sitemap.xml",
    host: "https://abel.dev.br",
  };
}
