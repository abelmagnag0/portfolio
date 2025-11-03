import { SITE_URL } from "@/library/seo/site";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // 1 dia

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
