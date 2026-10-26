import type { Metadata } from "next";

// Painel privado: nunca indexar.
export const metadata: Metadata = {
  title: "Admin · Painel",
  // Sem isto, a página herdava o canonical da home ("/") e ficava declarando
  // ser uma cópia da página inicial. Com noindex o risco é baixo, mas a
  // declaração é simplesmente falsa — o canonical tem que apontar para si.
  alternates: { canonical: "/admin" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
