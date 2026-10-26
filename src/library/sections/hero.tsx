import { Container } from '@/library/components/layout';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';
import { ArrowRight } from '@/library/icons';

/**
 * A seção de perfil.
 *
 * A capa (`cover.tsx`) é a folha de rosto; daqui para baixo, o site é o
 * documento que sempre foi: fio de 1px, texto e retrato emoldurado.
 *
 * O retrato é uma chapa emoldurada por fio de 1px, como impresso: sem foto
 * circular, sem gradiente e sem pill. Nada anima aqui, porque a coreografia
 * de entrada é uma só e acontece na capa.
 */
export function HeroSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.hero;

  return (
    <section id="profile" className="relative pt-6 pb-16 lg:pb-24">
      <Container>
        <div className="h-px w-full bg-rule-strong" aria-hidden="true" />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:row-start-1">
            <p className="max-w-[54ch] text-lg text-ink-soft">{copy.lead}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#work"
                className="inline-flex items-center gap-2.5 rounded-md bg-accent-cobalt px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-cobalt/88"
              >
                {copy.cta_work}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="link-rule hover:link-rule-on inline-flex min-h-6 items-center py-1 text-sm font-medium text-ink"
              >
                {copy.cta_contact}
              </a>
            </div>

            <p className="mt-8 max-w-[52ch] font-mono text-xs leading-relaxed text-ink-faint">
              {copy.note}
            </p>
          </div>

          <figure className="lg:col-span-5 lg:row-start-1">
            <div className="border border-rule-strong bg-paper-raised p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait-4x5.webp"
                srcSet="/portrait-4x5-sm.webp 320w, /portrait-4x5.webp 640w"
                sizes="(min-width: 1024px) 32rem, 92vw"
                width={640}
                height={800}
                alt={copy.portrait_alt}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                <span>Abel Magnago</span>
                <span>Rio de Janeiro</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
