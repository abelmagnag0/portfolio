import type { MetadataRoute } from "next";

export const revalidate = 86400; // 1 dia

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://abel.dev.br";
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
