/**
 * As decisões de engenharia por trás do site — o conteúdo da camada opcional.
 *
 * Uma nota por seção, na ordem em que as seções aparecem. Cada nota explica uma
 * escolha real, com número quando existe. Texto curto, sem adjetivo.
 *
 * PT-BR nasce aqui; `en` espelha a estrutura, como no resto do projeto.
 */
export type DecisionNote = {
  /** ID da seção: casa com o `id` do `<section>`. */
  section: 'home' | 'work' | 'experience' | 'credentials' | 'capabilities' | 'contact';
  title: string;
  body: string;
  en?: { title: string; body: string };
};

export const decisionNotes: DecisionNote[] = [
  {
    section: 'home',
    title: 'A assinatura da capa é um traço, não um arquivo.',
    body:
      'As iniciais são um path SVG de treze pontos, com menos de 300 bytes. Não tem imagem nem fonte externa, então nada carrega depois do texto. O tamanho é limitado pela altura reservada no palco, então o traço não encosta no texto nem é cortado em nenhuma largura.',
    en: {
      title: 'The signature on the cover is a stroke, not a file.',
      body:
        'The initials are a thirteen-point SVG path, under 300 bytes. No image and no external font, so nothing loads after the text. The size is capped by the height reserved in the stage, so the stroke never touches the text and is never cropped at any width.',
    },
  },
  {
    section: 'work',
    title: 'O detalhe abriu quando o card fechou.',
    body:
      'Antes os projetos ficavam abertos na página, um embaixo do outro, e quem chegava via um muro de texto. Virou card com capa: um clique a mais para o detalhe, e a primeira tela da página de volta. As telas ficam em preto e branco porque vieram de produtos e épocas diferentes.',
    en: {
      title: 'The detail opened when the card closed.',
      body:
        'The projects used to sit open on the page, one under the other, and anyone arriving saw a wall of text. It became a card with a cover: one extra click for the detail, and the first screen of the page back. The screens are in black and white because they come from different products and different eras.',
    },
  },
  {
    section: 'experience',
    title: 'Uma linha por cargo. O resto fica no CV.',
    body:
      'A seção já foi o currículo inteiro copiado na página. Uma linha por cargo resolveu, e o detalhe de cada cargo fica no PDF. Informação em um lugar só, senão uma das duas versões envelhece errada.',
    en: {
      title: 'One line per role. The rest stays in the CV.',
      body:
        'This section used to be the entire résumé copied onto the page. One line per role fixed it, and the detail of each role stays in the PDF. Information in one place, otherwise one of the two versions ages wrong.',
    },
  },
  {
    section: 'credentials',
    title: 'O que dá para conferir.',
    body:
      'Sem blog e sem palestra, o que sobra é o certificado com a instituição e a data. Um bloco com meus repositórios já ficou aqui, mas quem quer ver código vai no GitHub, e o link está no fim da página.',
    en: {
      title: 'What you can check.',
      body:
        'No blog and no talks, so what is left is the certificate with the institution and the date. A block with my repositories used to sit here, but anyone who wants to see code goes to GitHub, and the link is at the bottom of the page.',
    },
  },
  {
    section: 'capabilities',
    title: 'Área, não lista de tecnologia.',
    body:
      'A seção antiga eram quatro cards iguais, com três tecnologias cada. "React, Node, AWS" já aparece nos projetos. O que interessa é o que eu uso em cada área, e as tecnologias ficam na legenda.',
    en: {
      title: 'Area, not a technology list.',
      body:
        'The old section was four identical cards, each with three technologies. "React, Node, AWS" already shows up in the projects. What matters is what I use in each area, and the technologies sit in the caption.',
    },
  },
  {
    section: 'contact',
    title: 'Sem captcha.',
    body:
      'Um campo invisível resolve a maior parte do spam. A validação roda no navegador e de novo no servidor, porque não dá para confiar no que chega do navegador.',
    en: {
      title: 'No captcha.',
      body:
        'An invisible field handles most spam. Validation runs in the browser and again on the server, because you cannot trust what arrives from the browser.',
    },
  },
];
