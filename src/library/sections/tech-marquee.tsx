/**
 * Faixa de tecnologias — a "assinatura de dev" que fica entre o hero e os
 * cases.
 *
 * Marcas monocromáticas em slot de altura única, correndo em loop infinito.
 * Decisões:
 *
 *  - A faixa inteira é `aria-hidden`: é decoração, e o nome de cada tecnologia
 *    já está em texto nas seções de cases e capacidades. Um leitor de tela não
 *    precisa ouvir "Node.js, TypeScript…" duas vezes.
 *  - O trilho carrega a lista DUPLICADA e anima até -50%: quando a primeira
 *    metade sai, a segunda ocupa exatamente o mesmo lugar — a emenda é
 *    invisível porque é a mesma lista. Em `prefers-reduced-motion` a animação
 *    para e a cópia é escondida no CSS, senão viraria conteúdo repetido.
 *  - Server component de propósito: nada aqui precisa de JS. O movimento é
 *    uma animação de CSS no trilho, e a lista é estática no build.
 *  - Texto em vez de ícone por tecnologia: 13 marcas de terceiros desenhadas
 *    à mão ficam parecidas e erradas; a tipografia monoespaçada é o único
 *    "escudo de marca" honesto que a página tem. O tamanho do texto normaliza
 *    a altura do slot — uniformidade vem da estrutura, não de ajuste fino.
 */
const TECHS = [
  'Node.js',
  'TypeScript',
  'React',
  'Next.js',
  'AWS',
  'PostgreSQL',
  'MongoDB',
  'GraphQL',
  'Docker',
  'Firebase',
  'Tailwind',
  'Storybook',
  'LLMs · MCP',
] as const;

function List({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0">
      {TECHS.map((name) => (
        <span
          key={name}
          className="grid h-11 shrink-0 items-center px-10 text-sm font-medium tracking-[0.22em] text-ink-faint uppercase"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <div className="marquee-mask band overflow-hidden border-y border-rule py-3" aria-hidden="true">
      <div className="marquee-track">
        <List />
        <List hidden />
      </div>
    </div>
  );
}
