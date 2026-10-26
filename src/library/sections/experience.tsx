import { Container, SectionHead } from '@/library/components/layout';
import { TrackedLink } from '@/library/components/tracked-link';
import { ArrowRight } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';
import { experienceData, getExperienceCopy } from './experience.data';

/**
 * Trajetória — versão enxuta.
 *
 * Uma linha por cargo, e a stack logo abaixo. Sem `<details>`, sem bullets: o
 * detalhe de cada entrega está no CV, e a seção termina apontando para ele. Isso
 * resolve os dois problemas da versão anterior ao mesmo tempo — a seção tinha
 * virado o currículo inteiro, e o portfólio não tinha nenhuma chamada para o CV.
 *
 * O rail fica na coluna 1 da malha de 12 (`col-span-1`), não num `left-N`
 * adivinhado, então ele acompanha o alinhamento da página.
 *
 * Pinta a banda alternada (`band`) porque nada aqui é pintado com `bg-paper`
 * — a lista é fio e espaço. A regra de quem pode bandear está em `globals.css`.
 */
export function ExperienceSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.experience;
  const main = experienceData.filter((role) => !role.minor);
  const minor = experienceData.filter((role) => role.minor);
  const cvHref = lang === 'pt-BR' ? '/cv/pt-br.pdf' : '/cv/en.pdf';

  return (
    <section id="experience" className="cv-auto band py-20 lg:py-28">
      <Container>
        <SectionHead
          title={copy.title}
          subtitle={copy.subtitle}
          anchor="experience"
        />

        <ol className="mt-16 lg:mt-20">
          {main.map((role) => {
            const c = getExperienceCopy(role, lang);

            return (
              <li
                key={role.key}
                className="grid grid-cols-12 gap-x-5 border-t border-rule py-7 first:border-t-0 first:pt-0 lg:gap-x-6"
              >
                <div className="col-span-1 pt-2" aria-hidden="true">
                  <span className={role.current ? 'block size-1.5 bg-signal' : 'block size-1.5 bg-rule-strong'} />
                </div>

                <div className="col-span-11 lg:col-span-7">
                  <h3 className="text-lg">{c.role}</h3>
                  <p className="mt-1 text-sm text-ink">{role.company}</p>
                  <p className="mt-3 max-w-[56ch] text-sm text-ink-soft">{c.line}</p>
                </div>

                <div className="col-span-11 col-start-2 mt-4 lg:col-span-4 lg:col-start-9 lg:mt-0">
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink">
                    {c.period}
                  </p>
                  <p className="mt-2 text-sm text-ink-faint">
                    {c.employment} · {c.location}
                  </p>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-ink-faint">
                    {role.stack.join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {minor.length > 0 ? (
          <ul className="border-t border-rule pt-5">
            {minor.map((role) => {
              const c = getExperienceCopy(role, lang);
              return (
                <li
                  key={role.key}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-soft"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-faint">
                    {c.period}
                  </span>
                  <span>
                    {c.role} · {role.company}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <p className="mt-10 border-t border-rule-strong pt-5">
          <TrackedLink
            href={cvHref}
            download
            event="cv_download"
            eventName={lang === 'pt-BR' ? 'cv-pt-br' : 'cv-en'}
            className="link-rule hover:link-rule-on inline-flex min-h-6 items-center gap-2 text-sm font-medium text-ink"
          >
            {lang === 'pt-BR'
              ? 'O detalhe de cada cargo está no currículo. Baixar CV'
              : 'The detail for each role is in the résumé. Download CV'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </TrackedLink>
        </p>
      </Container>
    </section>
  );
}