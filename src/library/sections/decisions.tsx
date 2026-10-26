'use client';

import * as React from 'react';
import type { DriveStep, Driver, PopoverDOM } from 'driver.js';
import { Eye, EyeOff } from '@/library/icons';
import { track } from '@/library/analytics';
import { useSettings } from '@/library/utils/settings-provider';
import type { DecisionsCopy } from '@/library/utils/dictionary';
import type { DecisionNote } from '@/library/sections/decisions.data';
import { decisionNotes } from '@/library/sections/decisions.data';

const MODE_KEY = 'decisions';
const SEEN_KEY = 'decisions.seen';

type Mode = 'on' | 'off';

interface DecisionsContextType {
  mode: Mode;
  mounted: boolean;
  toggle: () => void;
}

const DecisionsContext = React.createContext<DecisionsContextType | undefined>(undefined);

function useDecisionsCtx() {
  const ctx = React.useContext(DecisionsContext);
  if (!ctx) throw new Error('useDecisions must be used within DecisionsProvider');
  return ctx;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function noteCopy(note: DecisionNote, lang: string) {
  return note.en && lang === 'en' ? note.en : { title: note.title, body: note.body };
}

function anchorSelector(section: DecisionNote['section']) {
  return `[data-decision-anchor="${section}"]`;
}

/** Elementos que este módulo injeta dentro do popover e precisa remover a cada troca de passo. */
const EXTRA_ATTR = 'data-decision-extra';

function clearExtras(wrapper: HTMLElement) {
  wrapper.querySelectorAll(`[${EXTRA_ATTR}]`).forEach((el) => el.remove());
}

function makeButton(label: string, className: string, onClick: () => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Camada de decisões de engenharia — as notas "por que isso foi feito assim".
 *
 * Não são divs dentro das seções. São um tour do driver.js: a página escurece,
 * a seção citada fica recortada no overlay e a nota aparece flutuando ao lado
 * dela. A leitura é a mesma de um produto guiando o primeiro uso, e o conteúdo
 * não disputa espaço com o layout editorial da página.
 *
 * O contrato com o visitante continua em três atos:
 *
 *  1. O tour abre sozinho na primeira visita (uma vez só, marcado em storage).
 *     A primeira nota traz "por que estou vendo isso?" — clicar explica o que
 *     a camada é e oferece parar.
 *  2. Parar desliga as notas e abre um cartão final, com o overlay recortando
 *     o interruptor da navbar — a porta de volta fica visível, não escondida
 *     numa página de configuração.
 *  3. O interruptor (`[data-decisions-toggle]`) liga e desliga a qualquer
 *     momento; desligado, ele reabre o cartão final; ligado, reabre o tour.
 *
 * Decisões de implementação:
 *
 *  - O driver.js entra por import dinâmico: ele só existe no navegador e só é
 *    baixado quando o tour abre de fato (ou quando alguém toca no interruptor).
 *    O HTML estático da home não carrega nada disso.
 *  - O conteúdo do popover é montado com DOM puro dentro de `onPopoverRender`.
 *    O driver recicla o mesmo popover entre passos, então todo elemento extra
 *    leva `data-decision-extra` e é removido antes de cada render — sem isso,
 *    o bloco "por que estou vendo isso?" sobreviveria ao passo seguinte.
 *  - `prefers-reduced-motion` desliga animação e rolagem suave do driver.
 */
export function DecisionsProvider({ children }: { children: React.ReactNode }) {
  const { copy, lang } = useSettings();
  const [mounted, setMounted] = React.useState(false);
  const [mode, setModeState] = React.useState<Mode>('on');

  const driverRef = React.useRef<Driver | null>(null);
  const aliveRef = React.useRef(true);
  const modeRef = React.useRef<Mode>('on');
  const copyRef = React.useRef(copy);
  const langRef = React.useRef(lang);
  const startTourRef = React.useRef<() => void>(() => {});
  const startStoppedTourRef = React.useRef<() => void>(() => {});

  copyRef.current = copy;
  langRef.current = lang;

  const destroyTour = React.useCallback(() => {
    driverRef.current?.destroy();
    driverRef.current = null;
  }, []);

  const setMode = React.useCallback((next: Mode) => {
    modeRef.current = next;
    setModeState(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* storage bloqueado: vale a sessão */
    }
  }, []);

  /** Ato 3 — desligado: um único cartão recortando o interruptor da navbar. */
  const startStoppedTour = React.useCallback(() => {
    void (async () => {
      destroyTour();
      const { driver } = await import('driver.js');
      if (!aliveRef.current || modeRef.current !== 'off') return;

      const t = copyRef.current.decisions;
      const reduced = prefersReducedMotion();

      const instance = driver({
        animate: !reduced,
        duration: reduced ? 0 : 200,
        smoothScroll: !reduced,
        overlayColor: '#0a0a0a',
        overlayOpacity: 0.74,
        overlayClickBehavior: 'none',
        stagePadding: 8,
        stageRadius: 3,
        popoverOffset: 12,
        allowClose: true,
        allowKeyboardControl: true,
        skipMissingElement: true,
        showButtons: [],
        popoverClass: 'decision-popover decision-popover-stopped',
        closeBtnLabel: t.tour_close,
        steps: [
          {
            element: '[data-decisions-toggle]',
            popover: {
              title: t.stopped_title,
              description: t.stopped_body,
              side: 'bottom',
              align: 'end',
              showButtons: [],
              onPopoverRender: (popover) => {
                clearExtras(popover.wrapper);
                const actions = document.createElement('div');
                actions.className = 'decision-why-actions';
                actions.setAttribute(EXTRA_ATTR, '');
                actions.append(
                  makeButton(t.stopped_back, 'decision-action', () => {
                    setMode('on');
                    track('decisions_toggle', 'on');
                    destroyTour();
                    window.setTimeout(() => {
                      if (aliveRef.current) startTourRef.current();
                    }, 60);
                  }),
                  makeButton(t.stopped_got_it, 'decision-action-quiet', () => {
                    destroyTour();
                  }),
                );
                popover.wrapper.appendChild(actions);
              },
            },
          },
        ],
      });

      driverRef.current = instance;
      instance.drive();
    })();
  }, [destroyTour, setMode]);

  /** Atos 1 e 2 — as seis notas, com o convite e a oferta de parar no primeiro passo. */
  const startTour = React.useCallback(() => {
    void (async () => {
      if (!aliveRef.current || modeRef.current !== 'on') return;
      destroyTour();

      const { driver } = await import('driver.js');
      if (!aliveRef.current || modeRef.current !== 'on') return;

      const t = copyRef.current.decisions;
      const currentLang = langRef.current;
      const reduced = prefersReducedMotion();

      const steps: DriveStep[] = decisionNotes.map((note) => {
        const content = noteCopy(note, currentLang);
        return {
          element: anchorSelector(note.section),
          popover: {
            title: content.title,
            description: content.body,
            side: 'bottom',
            align: 'start',
          },
        };
      });

      const instance = driver({
        steps,
        animate: !reduced,
        duration: reduced ? 0 : 220,
        smoothScroll: !reduced,
        overlayColor: '#0a0a0a',
        overlayOpacity: 0.74,
        overlayClickBehavior: 'none',
        stagePadding: 8,
        stageRadius: 3,
        popoverOffset: 12,
        allowClose: true,
        allowKeyboardControl: true,
        skipMissingElement: true,
        showButtons: ['previous', 'next', 'close'],
        showProgress: true,
        progressText: '{{current}} / {{total}}',
        nextBtnText: t.tour_next,
        prevBtnText: t.tour_prev,
        doneBtnText: t.tour_done,
        closeBtnLabel: t.tour_close,
        popoverClass: 'decision-popover',
        onPopoverRender: (popover, opts) => {
          clearExtras(popover.wrapper);
          if (opts.driver.getActiveIndex() !== 0) return;
          renderWhyBlock(popover, t, {
            onStop: () => {
              setMode('off');
              track('decisions_toggle', 'off');
              destroyTour();
              window.setTimeout(() => {
                if (aliveRef.current) startStoppedTourRef.current();
              }, 60);
            },
          });
        },
      });

      driverRef.current = instance;
      instance.drive();
    })();
  }, [destroyTour, setMode]);

  startTourRef.current = startTour;
  startStoppedTourRef.current = startStoppedTour;

  const toggle = React.useCallback(() => {
    const next: Mode = modeRef.current === 'on' ? 'off' : 'on';
    setMode(next);
    track('decisions_toggle', next);
    destroyTour();
    if (next === 'off') {
      window.setTimeout(() => {
        if (aliveRef.current) startStoppedTourRef.current();
      }, 60);
    } else {
      window.setTimeout(() => {
        if (aliveRef.current) startTourRef.current();
      }, 60);
    }
  }, [destroyTour, setMode]);

  // Estado inicial: lê a preferência e decide se o tour abre sozinho. O atraso
  // deixa a capa aparecer antes de o overlay escurecer a página.
  React.useEffect(() => {
    aliveRef.current = true;
    let stored: Mode = 'on';
    let seen = false;
    try {
      stored = localStorage.getItem(MODE_KEY) === 'off' ? 'off' : 'on';
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      /* storage bloqueado: padrão ligado, tour abre */
    }

    modeRef.current = stored;
    setModeState(stored);
    setMounted(true);

    if (stored === 'on' && !seen) {
      const timer = window.setTimeout(() => {
        if (!aliveRef.current) return;
        try {
          localStorage.setItem(SEEN_KEY, '1');
        } catch {
          /* sem persistência: o tour abre de novo na próxima visita */
        }
        startTourRef.current();
      }, 1200);
      return () => window.clearTimeout(timer);
    }

    return () => {
      aliveRef.current = false;
    };
  }, []);

  React.useEffect(
    () => () => {
      aliveRef.current = false;
      driverRef.current?.destroy();
      driverRef.current = null;
    },
    [],
  );

  const value = React.useMemo<DecisionsContextType>(
    () => ({ mode, mounted, toggle }),
    [mode, mounted, toggle],
  );

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>;
}

/**
 * O bloco "por que estou vendo isso?" do primeiro passo.
 *
 * Começa como um link discreto; ao clicar, vira a explicação com as duas
 * saídas — parar ou continuar. A escolha é sempre do visitante: nada desliga
 * sem ele pedir.
 */
function renderWhyBlock(
  popover: PopoverDOM,
  t: DecisionsCopy,
  handlers: { onStop: () => void },
) {
  const block = document.createElement('div');
  block.className = 'decision-why';
  block.setAttribute(EXTRA_ATTR, '');

  const showQuestion = () => {
    block.replaceChildren(
      makeButton(t.tour_why, 'decision-why-link', () => {
        track('decisions_explain');
        showExplanation();
      }),
    );
  };

  const showExplanation = () => {
    const text = document.createElement('p');
    text.className = 'decision-why-text';
    text.textContent = t.tour_intro;

    const actions = document.createElement('div');
    actions.className = 'decision-why-actions';
    actions.append(
      makeButton(t.tour_stop, 'decision-action', handlers.onStop),
      makeButton(t.tour_keep, 'decision-action-quiet', showQuestion),
    );

    block.replaceChildren(text, actions);
    block.setAttribute('tabindex', '-1');
    block.focus({ preventScroll: true });
  };

  showQuestion();
  popover.wrapper.appendChild(block);
}

/**
 * O interruptor da navbar.
 *
 * `data-decisions-toggle` é o alvo do cartão final do tour. O ícone Eye/EyeOff
 * deixa o estado legível sem depender de cor; o rótulo acessível vem do
 * dicionário. Antes da hidratação sai um espaço vazio do mesmo tamanho — o
 * botão não pode existir no HTML estático com um estado que talvez esteja
 * errado (o storage só é lido no cliente), mas a navbar também não pode pular.
 */
export function DecisionsToggle() {
  const { mode, mounted, toggle } = useDecisionsCtx();
  const { copy, lang } = useSettings();

  if (!mounted) return <span aria-hidden="true" className="size-8" />;

  const on = mode === 'on';
  const title = on ? copy.decisions.toggle_off_title : copy.decisions.toggle_on_title;

  return (
    <button
      type="button"
      data-decisions-toggle
      aria-pressed={on}
      aria-label={title}
      title={title}
      onClick={toggle}
      className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-secondary hover:text-ink"
    >
      {on ? (
        <Eye className="size-4" aria-hidden="true" />
      ) : (
        <EyeOff className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">
        {lang === 'en' ? 'Engineering notes' : 'Notas de engenharia'}
      </span>
    </button>
  );
}
