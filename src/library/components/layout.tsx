import * as React from 'react';
import { cn } from './utils';

/**
 * Coluna de conteúdo. Uma única largura para o site inteiro: largura de
 * leitura confortável e margens que crescem com a tela.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[78rem] px-5 sm:px-8 lg:px-12', className)}>
      {children}
    </div>
  );
}

/** Fio de 1px — a única separação entre blocos, no lugar de sombra e card. */
export function Rule({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-rule', className)} aria-hidden="true" />;
}

/**
 * Cabeçalho de seção.
 *
 * Só o título e, quando precisa, uma linha de contexto. Sem rótulo em caixa
 * alta repetindo o título e sem número de página: nada disso é informação.
 */
export function SectionHead({
  title,
  subtitle,
  className,
  children,
  anchor,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  /** Alvo do tour de decisões (`[data-decision-anchor]`). */
  anchor?: string;
}) {
  return (
    <header className={cn('pt-6', className)} data-decision-anchor={anchor}>
      <Rule />

      <div className="mt-8 grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <h2 className="text-2xl md:text-3xl lg:col-span-7">{title}</h2>
        {subtitle ? (
          <p className="max-w-[46ch] text-base text-ink-soft lg:col-span-5 lg:pt-1">{subtitle}</p>
        ) : null}
      </div>

      {children}
    </header>
  );
}