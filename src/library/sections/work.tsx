import { Container, SectionHead } from '@/library/components/layout';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';
import { WorkBoard } from './work-board';
import { getWorkCopy, workData } from './work.data';

/**
 * Cases como parede de selos: a tela do produto é a capa, o dossiê abre atrás.
 *
 * O que mudou em relação à versão anterior (quatro dossiês abertos, um sob o
 * outro): a ordem do argumento é a mesma, o custo de entrada é que caiu. Quem
 * passa os olhos vê quatro produtos, quatro clientes e quatro problemas —
 * que é o que vende. Quem quer o detalhe abre.
 *
 * Decisões:
 *
 *  - A grade é `grid-cols-2` com `gap-px` sobre fundo `bg-rule`. O fio de 1px
 *    entre os cards é literalmente o fundo aparecendo pela fresta — não há
 *    borda em cada card, então não existe linha duplicada onde dois se
 *    encontram. Dois cards por linha, e não três: quatro cases em três colunas
 *    deixam uma sobra órfã, e dois por linha dão o dobro de largura para a
 *    tela, que é o ponto da mudança.
 *
 *  - A tela entra em `grayscale` e escurecida, e a cor volta no hover. Em
 *    repouso o conjunto fica coeso (as telas vieram de produtos e épocas
 *    diferentes, com paletas que brigam entre si); no hover, a que interessa
 *    acende. É o mesmo truque da referência, e resolve o mesmo problema.
 *
 *  - O card inteiro é um `<button>` (ver `work-board.tsx`), não um link: não
 *    há URL de dossiê neste site estático. Isso mantém a grade como HTML
 *    estático — o título e o cliente ficam no documento, e o dossiê inteiro
 *    acompanha num bloco `sr-only` ao lado do botão (ver o comentário lá
 *    embaixo, perto do `<li>`), para o buscador e para quem navega por teclado.
 *
 *  - O selo do cliente fica sobre uma chapa branca. As logos são opacas, de
 *    fundo branco (a marca ocupava 5–18% de um quadrado 320×320); a chapa é o
 *    fundo que elas sempre tiveram, só recortado por `scripts/prepare-logos.mjs`.
 *    Tingir a chapa de escuro para "casar com o tema" exigiria uma versão
 *    branca de cada logo, que não existe.
 */
export function WorkSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.work;

  return (
    <section id="work" className="cv-auto py-20 lg:py-28">
      <Container>
        <SectionHead
          title={copy.title}
          subtitle={copy.subtitle}
          anchor="work"
        />

        <WorkBoard lang={lang}>
          <ul className="mt-16 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:mt-20">
            {workData.map((item) => {
              const c = getWorkCopy(item, lang);
              const cover = item.gallery?.[0];
              const stack = lang === 'en' && item.stack_en ? item.stack_en : item.stack;

              return (
                <li key={item.key} id={`work-${item.key}`} className="scroll-mt-24">
                  <button
                    type="button"
                    data-work-open={item.key}
                    aria-label={`${copy.open_label}: ${item.client}`}
                    className="group block w-full bg-paper text-left"
                  >
                    {/* Só a tela, sem texto por cima. O selo do cliente fica na
                        chapa branca dele; nada mais é escrito sobre a imagem. */}
                    <div className="relative aspect-video overflow-hidden bg-paper-raised">
                      {cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover}
                          alt=""
                          width={1600}
                          height={900}
                          loading="lazy"
                          decoding="async"
                          aria-hidden="true"
                          className="h-full w-full object-cover object-top grayscale brightness-[0.7] transition duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-100 group-hover:grayscale-0"
                        />
                      ) : null}

                      {item.logo ? (
                        <span className="absolute bottom-5 left-5 bg-white p-1.5 ring-1 ring-black/10 lg:bottom-6 lg:left-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.logo.src}
                            alt={item.client}
                            width={item.logo.width}
                            height={item.logo.height}
                            loading="lazy"
                            decoding="async"
                            className="block h-7 w-auto"
                          />
                        </span>
                      ) : null}
                    </div>

                    {/* Bloco de texto sobre `bg-paper`, não sobre a imagem.
                        É o que torna o contraste do título e do nome do cliente
                        um número medido em vez de uma aposta no brilho de cada
                        tela. Sobre a capa, o texto dependeria de o gradiente
                        escuro compensar exatamente a claridade daquele
                        screenshot — e as telas deste acervo vão de 66% a 98% de
                        área clara, ou seja, o pior caso é o normal. */}
                    <div className="border-t border-rule px-5 py-4 lg:px-6">
                      <h3 className="max-w-[28ch] text-base leading-snug md:text-lg">{c.title}</h3>
                      <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                        {item.client}
                      </p>

                      <span className="mt-4 inline-block text-sm text-ink-soft transition-colors group-hover:text-ink">
                        {copy.open_label}
                      </span>
                    </div>
                  </button>

                  {/* O dossiê inteiro também fica no documento, e não só no
                      chunk que o `import()` traz ao clique. O motivo é de
                      busca: o texto que mais interessa a um recrutador (o
                      problema, o que eu fiz, o resultado) só existia depois do
                      JS, então um crawler que não executa script não via nada
                      além do título e do nome do cliente.

                      O mesmo conteúdo que o painel mostra, com o mesmo
                      `getWorkCopy`, dentro do `<li>` e fora do `<button>` (um
                      `<button>` só aceita conteúdo de frase; blocos ali dentro
                      seriam HTML inválido). `sr-only` esconde da tela sem
                      esconder do robô: `display:none` some para os dois, e
                      `clip-path` some só para os olhos. É o padrão de um
                      acordeão fechado, que o Google indexa. O visitante que
                      abre o painel continua lendo exatamente isto. */}
                  <div className="sr-only" data-work-index={item.key}>
                    <p>{`${c.title}. ${c.subtitle}. ${c.period}.`}</p>
                    <p>{`${item.client}${item.via ? `, ${item.via}` : ''}.`}</p>
                    <p>{`${copy.role_label}: ${c.role}`}</p>
                    <ul>
                      <li>{copy.outcome_label}</li>
                      {c.outcomes.map((o) => (
                        <li key={o.metric}>{`${o.metric}: ${o.text}`}</li>
                      ))}
                    </ul>
                    <p>{`${copy.stack_label}: ${stack.join(', ')}`}</p>
                    <p>{c.problem}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </WorkBoard>
      </Container>
    </section>
  );
}