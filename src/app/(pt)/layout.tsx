import { RootShell } from "@/library/app/root-shell";
import {
  ALTERNATE_LANGUAGES,
  DEFAULT_OG,
  LOCALE_PATH,
  PAGE_TITLE,
  ROLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/library/seo/site";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: `Abel Magnago · ${ROLE}`,
  title: {
    default: PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Abel Magnago",
    "Engenheiro de Software",
    "Desenvolvedor Full Stack",
    "Engenheiro de Software Rio de Janeiro",
    "Desenvolvedor back-end",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "APIs REST",
    "Arquitetura de software",
    "Migração de sistemas legados",
    "Automação de processos",
    "Governo digital",
    "Tecnologia jurídica",
    "Educação digital",
    "IA em produção",
    "RAG",
    "Busca vetorial",
    "Abel dev",
    "Abel developer",
    "Full Stack Developer",
  ],
  authors: [{ name: "Abel Magnago", url: SITE_URL }],
  creator: "Abel Magnago",
  publisher: "Abel Magnago",
  category: "technology",
  alternates: {
    canonical: LOCALE_PATH["pt-BR"],
    languages: ALTERNATE_LANGUAGES,
  },
  openGraph: {
    type: "website",
    url: SITE_URL + LOCALE_PATH["pt-BR"],
    title: PAGE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: DEFAULT_OG.url,
        width: DEFAULT_OG.width,
        height: DEFAULT_OG.height,
        alt: DEFAULT_OG.alt,
        type: DEFAULT_OG.type,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG.url,
        alt: DEFAULT_OG.alt,
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

export default function PtLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="pt-BR">{children}</RootShell>;
}
