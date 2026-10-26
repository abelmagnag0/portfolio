import { RootShell } from "@/library/app/root-shell";
import {
  ALTERNATE_LANGUAGES,
  DEFAULT_OG_EN,
  LOCALE_PATH,
  OG_ALT_EN,
  PAGE_TITLE_EN,
  ROLE_EN,
  SITE_DESCRIPTION_EN,
  SITE_NAME,
  SITE_URL,
} from "@/library/seo/site";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: `Abel Magnago · ${ROLE_EN}`,
  title: {
    default: PAGE_TITLE_EN,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_EN,
  keywords: [
    "Abel Magnago",
    "Software Engineer",
    "Full Stack Engineer",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "Software architecture",
    "Legacy system migration",
    "Process automation",
    "Digital government",
    "Legal tech",
    "EdTech",
    "Abel dev",
    "Abel developer",
    "Full Stack Developer",
  ],
  authors: [{ name: "Abel Magnago", url: SITE_URL }],
  creator: "Abel Magnago",
  publisher: "Abel Magnago",
  category: "technology",
  alternates: {
    canonical: LOCALE_PATH.en,
    languages: ALTERNATE_LANGUAGES,
  },
  openGraph: {
    type: "website",
    url: SITE_URL + LOCALE_PATH.en,
    title: PAGE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    images: [
      {
        url: DEFAULT_OG_EN.url,
        width: DEFAULT_OG_EN.width,
        height: DEFAULT_OG_EN.height,
        alt: OG_ALT_EN,
        type: DEFAULT_OG_EN.type,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    images: [
      {
        url: DEFAULT_OG_EN.url,
        alt: OG_ALT_EN,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Acompanha o tema do site em vez de fixar um azul que não existe mais na
  // paleta: barra do navegador clara sobre o papel, escura sobre o escuro.
  // O escuro é o tema padrão, e o valor é o `--paper` de `globals.css`
  // (#131313) — não um quase-preto inventado aqui, que deixaria a barra do
  // navegador com um degrau visível contra a página.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
  ],
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="en">{children}</RootShell>;
}
