import { Container, Rule } from "@/library/components/layout";
import { RootShell } from "@/library/app/root-shell";
import { ArrowRight } from "@/library/icons";
import {
  DEFAULT_OG_EN,
  LOCALE_PATH,
  OG_ALT_EN,
  SITE_NAME,
  SITE_URL,
} from "@/library/seo/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Page not found | ${SITE_NAME}`,
  openGraph: {
    title: `Page not found | ${SITE_NAME}`,
    url: `${SITE_URL}${LOCALE_PATH.en}`,
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
    title: `Page not found | ${SITE_NAME}`,
    images: [{ url: DEFAULT_OG_EN.url, alt: OG_ALT_EN }],
  },
};

/**
 * 404 global. Com múltiplos root layouts ((pt)/(en)) não existe um layout único
 * para compor o not-found, então este arquivo renderiza o documento inteiro.
 * O `noindex` é injetado automaticamente pelo Next.js.
 *
 * Em inglês e não em português: a raiz do site é o inglês, então o erro fala a
 * mesma língua da porta de entrada — e oferece o português para quem veio dele.
 *
 * Mantém a linguagem do resto do site: fio de 1px, texto simples, alinhado à
 * esquerda. Uma 404 centralizada com rótulo em caixa alta espaçada é o mesmo
 * visual de template que o site acabou de abandonar; não faz sentido o erro
 * parecer de outro produto.
 */
export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <main className="min-h-screen pt-6 pb-16">
        <Container>
          <div className="rule-draw h-px w-full bg-rule-strong" aria-hidden="true" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="font-mono text-xs text-ink-faint">404</span>
            <Link
              href={LOCALE_PATH["pt-BR"]}
              hrefLang="pt-BR"
              className="link-rule hover:link-rule-on inline-flex min-h-6 items-center font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
            >
              Versão em português
            </Link>
          </div>

          <div className="mt-16 grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:mt-24">
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl">This page doesn&apos;t exist.</h1>
              <p className="mt-8 max-w-[52ch] text-lg text-ink-soft">
                The address you opened doesn&apos;t exist or has moved. If you came
                from an old link, the content is still here:
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href={LOCALE_PATH.en}
                  className="inline-flex min-h-6 items-center gap-2.5 rounded-md bg-accent-cobalt px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-cobalt/88"
                >
                  Back to the start
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/#work"
                  className="link-rule hover:link-rule-on inline-flex min-h-6 items-center py-1 text-sm font-medium text-ink"
                >
                  See the projects
                </Link>
                <Link
                  href="/#contact"
                  className="link-rule hover:link-rule-on inline-flex min-h-6 items-center py-1 text-sm font-medium text-ink"
                >
                  Get in touch
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 lg:pt-3">
              <ul className="font-mono text-xs leading-relaxed text-ink-faint">
                <li className="flex justify-between gap-4 border-t border-rule py-2.5">
                  <span className="uppercase tracking-[0.12em]">Projects</span>
                  <Link href="/#work" className="inline-flex min-h-6 items-center text-ink-soft hover:text-ink">
                    /#work
                  </Link>
                </li>
                <li className="flex justify-between gap-4 border-t border-rule py-2.5">
                  <span className="uppercase tracking-[0.12em]">Experience</span>
                  <Link href="/#experience" className="inline-flex min-h-6 items-center text-ink-soft hover:text-ink">
                    /#experience
                  </Link>
                </li>
                <li className="flex justify-between gap-4 border-t border-rule py-2.5">
                  <span className="uppercase tracking-[0.12em]">Résumé</span>
                  <a href="/cv/en.pdf" className="inline-flex min-h-6 items-center text-ink-soft hover:text-ink">
                    /cv/en.pdf
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Rule className="mt-20" />
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
            {SITE_NAME} · abel.dev.br
          </p>
        </Container>
      </main>
    </RootShell>
  );
}