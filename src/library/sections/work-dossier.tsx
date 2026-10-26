'use client';

import { ArrowRight } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getWorkCopy, type WorkCase } from './work.data';

/**
 * O dossiê de um case, em painel lateral.
 *
 * Carregado por `import()` a partir de `work-board.tsx` — este arquivo não
 * entra no bundle inicial da página. Quando é preciso, chega: carrossel,
 * textos longos e a lógica de painel vêm todos juntos.
 *
 * Decisões:
 *
 *  - Painel lateral que ocupa a altura toda, e não caixa flutuante no centro.
 *    O dossiê é um documento (problema → papel → resultado → stack) e um
 *    documento se lê pela altura. Também deixa a página visível atrás do
 *    fundo escurecido, o que mantém o contexto de onde o visitante estava.
 *
 *  - O fundo escurecido é um `<button>` de verdade, rotulado "fechar". Custa
 *    uma linha e resolve três coisas de uma vez: clique fora fecha, o
 *    controle é alcançável por teclado, e o leitor de tela anuncia o que ele
 *    faz. A alternativa (camada invisível com `onClick`) não teria nenhuma
 *    das três.
 *
 *  - Foco inicial no painel, `aria-modal`, Esc fecha e o foco volta para o
 *    card que abriu (isso é feito em `work-board.tsx`, que guarda o elemento).
 *
 *  - As telas só aparecem aqui. O card mostra a primeira; o carrossel carrega
 *    as outras sob demanda, uma por vez (`key` troca o `<img>`, então só a
 *    imagem visível é requisitada).
 */
export function WorkDossier({
  item,
  lang,
  onClose,
}: {
  item: WorkCase;
  lang: Lang;
  onClose: () => void;
}) {
  const dict = dictionary[lang];
  const copy = dict.work;
  const content = getWorkCopy(item, lang);
  const gallery = item.gallery ?? [];
  const [shot, setShot] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const titleId = `work-dossier-${item.key}`;

  // Esc fecha e as setas andam no carrossel. Um único listener para os dois:
  // registrar dois `keydown` no documento para a mesma interação é convite
  // para eles divergirem.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (gallery.length < 2) return;
      if (event.key === 'ArrowRight') setShot((current) => (current + 1) % gallery.length);
      if (event.key === 'ArrowLeft') {
        setShot((current) => (current - 1 + gallery.length) % gallery.length);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [gallery.length, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const go = (delta: number) =>
    setShot((current) => (current + delta + gallery.length) % gallery.length);

  const navButton =
    'grid size-7 place-items-center border border-rule text-ink-soft transition-colors hover:border-rule-strong hover:text-ink';

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label={copy.close_label}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="panel-in relative flex h-full w-full max-w-3xl flex-col overflow-y-auto overscroll-contain border-l border-rule-strong bg-paper outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-end gap-4 border-b border-rule bg-paper/92 px-5 py-3 backdrop-blur-md lg:px-8">
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close_label}
            className="grid size-8 place-items-center border border-rule text-lg leading-none text-ink-soft transition-colors hover:border-rule-strong hover:text-ink"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="px-5 pt-8 pb-16 lg:px-8 lg:pt-10">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
            {content.subtitle} · {content.period}
          </p>

          <h3 id={titleId} className="mt-4 text-xl md:text-2xl">
            {content.title}
          </h3>

          <div className="mt-5 flex items-center gap-4">
            {item.logo ? (
              <span className="shrink-0 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo.src}
                  alt={item.client}
                  width={item.logo.width}
                  height={item.logo.height}
                  loading="lazy"
                  decoding="async"
                  className="block h-9 w-auto"
                />
              </span>
            ) : null}
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
              {item.client}
              {item.via ? <span> · {item.via}</span> : null}
            </p>
          </div>

          {gallery.length > 0 ? (
            <figure className="mt-8">
              <div className="border border-rule bg-paper-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={gallery[shot]}
                  src={gallery[shot]}
                  alt=""
                  aria-hidden="true"
                  width={1600}
                  height={900}
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>

              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <span className="font-mono text-xs text-ink-faint">
                  {shot + 1} {copy.gallery_counter} {gallery.length} · {copy.gallery_label}
                </span>

                {gallery.length > 1 ? (
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label={copy.gallery_prev}
                      className={navButton}
                    >
                      <ArrowRight className="size-3.5 rotate-180" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label={copy.gallery_next}
                      className={navButton}
                    >
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ) : null}

          <p className="mt-10 text-base text-ink-soft">{content.problem}</p>

          <div className="mt-10 border-t border-rule pt-5">
            <span className="eyebrow">{copy.role_label}</span>
            <p className="mt-3 text-sm text-ink-soft">{content.role}</p>
          </div>

          <div className="mt-8 border-t border-rule pt-5">
            <span className="eyebrow">{copy.outcome_label}</span>
            <dl className="mt-4 grid gap-px bg-rule">
              {content.outcomes.map((outcome) => (
                <div
                  key={outcome.metric}
                  className="grid gap-1 bg-paper py-2.5 sm:grid-cols-[9.5rem_1fr] sm:gap-5"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink">
                    {outcome.metric}
                  </dt>
                  <dd className="text-sm text-ink-soft">{outcome.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 border-t border-rule pt-5">
            <span className="eyebrow">{copy.stack_label}</span>
            <p className="mt-3 font-mono text-xs leading-relaxed text-ink-soft">
              {(lang === 'en' && item.stack_en ? item.stack_en : item.stack).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}