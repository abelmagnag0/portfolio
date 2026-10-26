'use client';

import { track } from '@/library/analytics';
import type { Lang } from '@/library/utils/dictionary';
import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { getWorkCopy, workData, type WorkCase } from './work.data';

type DossierComponent = ComponentType<{
  item: WorkCase;
  lang: Lang;
  onClose: () => void;
}>;

/**
 * Estado do dossiê de um case. A grade de cards NÃO mora aqui.
 *
 * `children` é a grade serializada no servidor e chega pronta pelo RSC: o HTML
 * já sai com título, cliente, selo e tela dentro. Este componente existe só
 * para ter onde guardar "qual case está aberto" — o JS da página não participa
 * da construção do que está abaixo da dobra.
 *
 * A leitura do clique é por delegação, num `data-work-open` no botão do card.
 * Isso evita um componente cliente por card (quatro árvores hidratadas em vez
 * de uma) e mantém o `<button>` como elemento real de teclado — Enter e espaço
 * nele disparam `click`, que sobe até aqui normalmente. A alternativa, uma
 * camada invisível cobrindo o card, resolveria o clique e quebraria o teclado.
 *
 * O dossiê é carregado por `import()` só no primeiro clique: carrossel, textos
 * longos e o próprio código do painel não entram no bundle inicial. O
 * componente carregado fica guardado, então o segundo clique não espera nada.
 */
export function WorkBoard({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [Dossier, setDossier] = useState<DossierComponent | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const loadingRef = useRef(false);

  // Sem isso, o painel fica montado sobre uma página que acabou de trocar de
  // idioma quando o visitante alterna PT/EN com o dossiê aberto.
  useEffect(() => {
    setActiveKey(null);
  }, [lang]);

  const onGridClick = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-work-open]');
      const key = trigger?.dataset.workOpen;
      if (!key) return;

      openerRef.current = trigger;

      const item = workData.find((entry) => entry.key === key);
      if (item) {
        const copy = getWorkCopy(item, lang);
        // `project_view` existia no tipo de evento desde o começo e nunca era
        // emitido — os cases não abriam nada. Agora abrem.
        track('project_view', item.key, { project: item.key, client: item.client, title: copy.title });
      }

      if (!Dossier && !loadingRef.current) {
        loadingRef.current = true;
        const mod = await import('./work-dossier');
        setDossier(() => mod.WorkDossier as DossierComponent);
      }

      setActiveKey(key);
    },
    [Dossier, lang],
  );

  const close = useCallback(() => {
    setActiveKey(null);
    // Devolve o foco a quem abriu: quem navega por teclado não deve cair no
    // início do documento ao fechar o painel.
    openerRef.current?.focus?.();
  }, []);

  const item = activeKey ? workData.find((entry) => entry.key === activeKey) : undefined;

  return (
    <>
      {/* A grade vem como filho do servidor. O `onClick` aqui só escuta:
          o elemento clicável de verdade é o `<button>` dentro de cada card,
          então teclado, foco e leitor de tela continuam vindo do HTML, não
          desta camada. */}
      <div onClick={onGridClick}>{children}</div>

      {Dossier && item ? (
        <Dossier item={item} lang={lang} onClose={close} />
      ) : null}
    </>
  );
}