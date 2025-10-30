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
        url: "/hero.jpeg",
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
        url: "/hero.jpeg",
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
      { url: "/icon.png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
