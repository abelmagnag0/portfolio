import { Container, SectionHead } from '@/library/components/layout';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';

/**
 * "Como trabalho" no lugar do antigo grid de skills.
 *
 * A seção antiga listava quatro cards idênticos com ícone, título e três
 * tecnologias — que é exatamente o que "React, Node, AWS" já diz na seção de
 * cases. Aqui o que aparece é escopo: o que o Abel assume, não com que
 * ferramenta. A lista de tecnologias entra como legenda monoespaçada, no mesmo
 * formato usado em cases e trajetória.
 *
 * Banda alternada (`band`) como a trajetória: esta seção também é só fio e
 * espaço, e o degrau de superfície é o que separa uma da outra sem borda
 * dupla. Ver a regra em `globals.css`.
 */
export function CapabilitiesSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.capabilities;

  return (
    <section id="capabilities" className="cv-auto band py-20 lg:py-28">
      <Container>
        <SectionHead
          title={copy.title}
          subtitle={copy.subtitle}
          anchor="capabilities"
        />

        <ol className="mt-16 lg:mt-20">
          {copy.groups.map((group) => (
            <li
              key={group.name}
              className="grid gap-x-8 gap-y-4 border-t border-rule py-8 lg:grid-cols-12"
            >
              <h3 className="text-lg lg:col-span-4">{group.name}</h3>

              <div className="lg:col-span-8">
                <p className="max-w-[58ch] text-sm text-ink-soft">{group.line}</p>
                <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
                  {group.tools.join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}