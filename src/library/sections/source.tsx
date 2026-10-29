import { Container, SectionHead } from '@/library/components/layout';
import { TrackedLink } from '@/library/components/tracked-link';
import { ArrowRight, Github } from '@/library/icons';
import { PORTFOLIO_REPO } from '@/library/seo/site';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';

/**
 * "O código deste site".
 *
 * A página afirma bastante: stack, infraestrutura, painel, IA. Esta seção é
 * onde qualquer uma dessas afirmações pode ser conferida, apontando para o
 * mesmo repositório que gera o que está na tela.
 *
 * Fica em papel, entre a stack (banda) e o contato (papel). O contato não pode
 * virar banda por causa dos painéis pintados, então o degrau de superfície
 * volta a subir só no rodapé. Ver a regra em `globals.css`.
 *
 * A lista da esquerda é a arquitetura em cinco linhas; o quadro da direita é o
 * repositório em si, com o mapa de pastas e a saída. Ele parece uma ficha, não
 * um card de produto: fio de 1px, mono e nenhum ícone além do GitHub.
 */
export function SourceSection({ lang }: { lang: Lang }) {
  const copy = dictionary[lang].source;

  return (
    <section id="source" className="cv-auto py-20 lg:py-28">
      <Container>
        <SectionHead title={copy.title} subtitle={copy.subtitle} anchor="source" />

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <dl className="lg:col-span-7">
            {copy.entries.map((entry) => (
              <div
                key={entry.label}
                className="grid gap-x-8 gap-y-2 border-t border-rule py-6 sm:grid-cols-12"
              >
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint sm:col-span-3 sm:pt-1">
                  {entry.label}
                </dt>
                <dd className="max-w-[58ch] text-sm leading-relaxed text-ink-soft sm:col-span-9">
                  {entry.line}
                </dd>
              </div>
            ))}
          </dl>

          <aside className="lg:col-span-5">
            <div className="border border-rule-strong">
              <div className="flex items-center gap-2 border-b border-rule px-5 py-4">
                <Github className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                  {copy.repo_label}
                </span>
                <span className="ml-auto font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                  {copy.repo_visibility}
                </span>
              </div>

              <div className="px-5 py-5">
                <p className="font-mono text-sm text-ink-strong">abelmagnag0/portfolio</p>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink-faint">
                  {copy.repo_stack}
                </p>
              </div>

              <div className="border-t border-rule px-5 py-4">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                  {copy.tree_label}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {copy.tree.map((node) => (
                    <li key={node.path} className="flex gap-4 font-mono text-xs leading-relaxed">
                      <span className="w-20 shrink-0 text-ink">{node.path}</span>
                      <span className="text-ink-faint">{node.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-rule p-3">
                <TrackedLink
                  href={PORTFOLIO_REPO}
                  target="_blank"
                  rel="noreferrer noopener"
                  event="outbound_click"
                  eventName="portfolio-repo"
                  className="group flex items-center justify-between gap-4 rounded-md bg-accent-cobalt px-4 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-cobalt/88"
                >
                  {copy.cta}
                  <ArrowRight
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </TrackedLink>
              </div>
            </div>

            <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
              {copy.readme_note}
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
