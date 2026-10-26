import { Container } from '@/library/components/layout';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';

/**
 * A capa — a folha de rosto.
 *
 * A primeira seção do site não é uma manchete: é uma folha de rosto de
 * documento impresso, no meio da qual está o autor. Aqui a página fala na
 * primeira pessoa, uma vez, e depois cala — o resto do site volta a ser
 * documento, em terceira pessoa e alinhado à esquerda.
 *
 * A composição é a de uma folha de rosto: o cargo, o nome em serifa grande e
 * uma frase, tudo centrado, e, no lugar de uma ilustração, a assinatura das
 * iniciais desenhada na base. O centro é a exceção assumida deste arquivo: as
 * seções abaixo continuam à esquerda, porque centro é o default do template e
 * o que mais rápido faz uma página parecer montada por máquina. Aqui não é
 * default, é a folha de rosto.
 *
 * Decisões que valem registro:
 *
 *  - NADA de imagem. A assinatura no rodapé da folha é um traço só: um
 *    `<path>` de treze pontos, sem bitmap e sem vetor importado, dentro do
 *    HTML que já vinha. São menos de 300 bytes de marcação — nada chega
 *    depois do texto e nada quebra sem rede. A mesma peça como arquivo
 *    custaria uma requisição. Aqui ela é código.
 *  - Uma cor só. Fora papel e tinta existe apenas o cobalto do traço — o
 *    acento do site, e o único elemento colorido numa página feita de preto,
 *    branco e fio de 1px.
 *  - Desenhada, não ilustrada. O traço é a assinatura do autor na folha: sem
 *    preenchimento, sem gradiente, sem máscara — uma linha com o mesmo peso em
 *    toda a extensão. A peça anterior era um corpo celeste com três camadas de
 *    superfície, e o motivo saiu de cena justamente por isso: um arco grande
 *    subindo do rodapé já é a assinatura visual de outra pessoa. Um monograma,
 *    feito de um traço que começa e termina fora das letras, é o mesmo
 *    trocadilho da capa — de ponta a ponta — desenhado.
 *  - A coreografia é uma só, e é esta. O texto entra com `.rise` e os atrasos
 *    `d-*` que o hero já usa; a assinatura não anima. Uma página com um
 *    movimento orquestrado não parece montada por máquina; cinco movimentos
 *    parecem.
 *  - Server component. Não precisa de JavaScript para desenhar isto, e a nota
 *    de decisão do tour cita o número que depende disso.
 */
export function CoverSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.cover;

  return (
    <section id="home" className="cover">
      <Container className="cover-sheet">
        <div className="cover-stage">
          <div className="cover-intro">
            {/* O cargo. Identidade, não sinal de disponibilidade. */}
            <p className="eyebrow rise d-1">{copy.role}</p>

            <h1 className="cover-name rise d-2" data-decision-anchor="home">
              <span className="cover-line">Abel</span>
              <span className="cover-line">Magnago</span>
            </h1>

            <p className="cover-lede rise d-3">{copy.intro}</p>
          </div>

          {/* O monograma no rodapé da folha.

              A assinatura do autor, não uma ilustração: as iniciais num traço
              só, de ponta a ponta — que é literalmente a frase logo acima,
              desenhada. O traço entra pela esquerda na linha de base, sobe a
              perna esquerda do A, desce a direita, entra na barra pelo lado
              direito, volta pela esquerda, sai pelo pé esquerdo, atravessa
              para o M pela base e sai pela direita. O retraço entre a barra e
              o pé esquerdo é invisível porque tem a mesma cor, a mesma
              espessura e a mesma junta — a caneta não sai do papel.

              A grade, em unidades do viewBox de 182x78 (razão 7/3, exata):

                base 77 (o datum), ápice 1 — a letra tem 76 de altura;
                A de 24 a 72 (48 de largura, 0,632 da altura);
                M de 94 a 158 (64 de largura, 0,842);
                vão entre as letras de 22 (0,289 da altura);
                barra do A a 43,9 — 43,6% do ápice —, e o vale do M a 54,2, 70%;
                ponta de fio de 24 de cada lado.

              As duas pontas são o que faz a peça ler como assinatura: a linha
              começa antes das letras e continua depois delas, como quem
              encosta a caneta no papel, escreve e para. Sem elas o desenho
              vira um logotipo fechado; com elas, a base alinha com o fio de
              1px das marcas de registro e a assinatura fica na mesma linha do
              documento.

              O dimensionamento é todo do CSS (`.cover-mark`) — aqui não há
              `preserveAspectRatio` nenhum, e é isso que impede o recorte. A
              peça anterior ocupava uma faixa de 1200x150 com `xMidYMax slice`,
              que escala pelo MAIOR dos dois quocientes: em tela larga e baixa
              quem manda é a largura, a altura desenhada passa da caixa e o
              recorte come o topo — num arco abstrato passa, num A o ápice
              desaparece. Um monograma precisa escalar igual nos dois eixos. */}
          <svg
            className="cover-mark"
            viewBox="0 0 182 78"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className="cover-mark-line"
              d="M 0 77 L 24 77 L 48 1 L 72 77 L 61.5 43.9 L 34.5 43.9 L 24 77 L 94 77 L 110 1 L 126 54.2 L 142 1 L 158 77 L 182 77"
            />
          </svg>
        </div>

        {/* A base da folha: o convite a descer. */}
        <div className="cover-marks">
          <a href="#profile" className="cover-scroll">
            {copy.scroll}
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1" />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}