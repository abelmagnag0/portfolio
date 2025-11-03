import { DEFAULT_OG, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/library/seo/site";
import type { Metadata, Viewport } from "next";
import { ProfilePageJsonLd } from "next-seo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Abel Magnago · Portfólio",
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Abel Magnago",
    "Abel dev",
    "Abel developer",
    "Desenvolvedor Full Stack",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "React Native",
    "AWS",
    "Serverless",
    "Desenvolvedor React",
    "Desenvolvedor Next.js",
    "Portfolio",
    "Freelancer",
    "Programador Front-end",
    "Programador Back-end",
  ],
  authors: [{ name: "Abel Magnago", url: "https://abel.dev.br" }],
  creator: "Abel Magnago",
  publisher: "Abel Magnago",
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL + "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "pt_BR",
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
    title: SITE_NAME,
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
      { url: "/favicon.svg", type: "image/svg+xml", rel: "icon" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [
      "/favicon.svg",
    ],
    apple: [
      "/icon.png",
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSON-LD global: página de perfil da pessoa (ideal para portfólio pessoal) */}
        <ProfilePageJsonLd
          mainEntity={{
            name: SITE_NAME,
            alternateName: "Abel dev",
            description: SITE_DESCRIPTION,
            sameAs: [
              "https://github.com/abelmagnag0",
              "https://www.linkedin.com/in/abel-magnago1",
            ],
            url: SITE_URL,
          }}
        />
        {/* Evita flash de tema e adiciona toggle leve sem React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { 
  const r = document.documentElement;
  const getStored = () => (localStorage.getItem('theme'));
  const prefersDark = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const apply = (t) => { if (t === 'dark') r.classList.add('dark'); else r.classList.remove('dark'); };
  const initial = (() => { const s = getStored(); return (s === 'light' || s === 'dark') ? s : (prefersDark() ? 'dark' : 'light'); })();
  apply(initial);
  // Toggle por delegação (sem esperar DOMContentLoaded)
  document.addEventListener('click', (e) => {
    const btn = (e.target && (e.target.closest ? e.target.closest('[data-theme-toggle]') : null));
    if (!btn) return;
    const next = r.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    apply(next);
  }, true);
} catch(_){} })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
