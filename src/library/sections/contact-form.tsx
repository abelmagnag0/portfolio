'use client';

import * as React from 'react';
import { ArrowRight } from '@/library/icons';
import { track } from '@/library/analytics';
import { useSettings } from '@/library/utils/settings-provider';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Estilo compartilhado dos campos: um retângulo rebaixado, com fio de 1px.
 *
 * O campo é pintado com `bg-paper` — um degrau ABAIXO do painel, que é
 * `bg-paper-raised` — e não com a mesma cor dele. Com `bg-paper-raised` o
 * campo sumia dentro do formulário: mesmo tom, e o fio de `--rule` (10%,
 * 1.34:1) ainda mais fraco que a borda do próprio painel (18%, 1.78:1), então
 * não havia contorno nenhum para separar um do outro. A mesma classe de defeito
 * que a `band` documenta em `globals.css`: superfície pintada com a cor da
 * superfície que a contém. Rebaixar resolve as duas coisas de uma vez — o
 * degrau de superfície (#1f1f1f → #131313) dá a separação, e o fio de
 * `--rule-strong` confirma. De quebra o placeholder sobe de 4.75:1 para 5.36:1.
 */
const FIELD =
  'w-full rounded-md border border-rule-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint';

const LABEL = 'mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint';

/**
 * Formulário de contato — o único componente realmente interativo desta seção.
 *
 * É um arquivo separado para que o container (`contact.tsx`) possa continuar
 * sendo server component: só este pedaço entra no bundle do cliente.
 *
 * O contrato com o backend é o mesmo de antes e não deve mudar sem revisar o
 * Lambda em `backend/leads.mjs`: POST `${API_BASE}/api/leads` com
 * `{ name, email, subject, message, company, lang }`, onde `company` é o
 * honeypot (campo invisível; se vier preenchido, é bot).
 */
export function ContactForm() {
  const { lang, copy } = useSettings();
  const f = copy.contact.form;

  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      subject: String(data.get('subject') || '').trim(),
      message: String(data.get('message') || '').trim(),
      company: String(data.get('company') || ''), // honeypot
      lang,
    };

    const valid =
      payload.name.length >= 2 && EMAIL_RE.test(payload.email) && payload.message.length >= 10;

    if (!valid) {
      setStatus('error');
      setError(f.required);
      return;
    }

    setStatus('sending');
    setError('');
    track('contact_submit', payload.subject || 'sem-assunto');

    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus('success');
      track('contact_success');
      form.reset();
    } catch {
      setStatus('error');
      setError(f.error);
      track('contact_error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-rule-strong bg-paper-raised p-8" role="status">
        <h3 className="text-xl">{f.success_title}</h3>
        <p className="mt-3 max-w-[46ch] text-sm text-ink-soft">{f.success_body}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="link-rule hover:link-rule-on mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          {f.success_again}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-rule-strong bg-paper-raised p-6 sm:p-8">
      {/* Honeypot anti-spam: invisível e fora da árvore de acessibilidade */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            {f.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={f.name_ph}
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="email" className={LABEL}>
            {f.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={f.email_ph}
            className={FIELD}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="subject" className={LABEL}>
          {f.subject}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder={f.subject_ph}
          className={FIELD}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={LABEL}>
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={f.message_ph}
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2.5 rounded-md bg-accent-cobalt px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-cobalt/88 disabled:opacity-60"
        >
          {status === 'sending' ? f.sending : f.submit}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Região viva: o leitor de tela anuncia o erro sem mover o foco */}
      <div aria-live="polite" className="mt-4">
        {status === 'error' && error ? (
          <p className="font-mono text-xs leading-relaxed text-destructive">{error}</p>
        ) : null}
      </div>
    </form>
  );
}