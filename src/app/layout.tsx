import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://abel.dev.br"),
  applicationName: "Abel Magnago · Portfólio",
  title: {
    default: "Abel Magnago",
    template: "%s | Abel Magnago",
  },
  description:
    "Desenvolvedor Full Stack e Mobile. Especialista em React, Next.js, Node.js, TypeScript, React Native e AWS.",
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
  },
  openGraph: {
    type: "website",
    url: "https://abel.dev.br/",
    title: "Abel Magnago",
    description:
      "Desenvolvedor Full Stack: React, Next.js, Node.js, TypeScript, React Native e AWS.",
    siteName: "Abel Magnago",
    locale: "pt_BR",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 1200,
        alt: "Abel Magnago",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abel Magnago",
    description:
      "Desenvolvedor Full Stack: React, Next.js, Node.js, TypeScript, React Native e AWS.",
    images: [
      {
        url: "/hero.webp",
        alt: "Abel Magnago",
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
