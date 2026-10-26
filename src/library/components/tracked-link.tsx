'use client';

import * as React from 'react';
import { track, type AnalyticsEventType } from '@/library/analytics';

type Props = React.ComponentProps<'a'> & {
  /** Evento enviado para `/api/track` no clique. */
  event: AnalyticsEventType;
  eventName?: string;
};

/**
 * `<a>` que registra o clique no analytics first-party antes de navegar.
 *
 * Existe para que as seções que só exibem links (contato, rodapé) continuem
 * sendo server components: o único pedaço que vira cliente é este.
 */
export function TrackedLink({ event, eventName, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventName ?? rest.href ?? '');
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}