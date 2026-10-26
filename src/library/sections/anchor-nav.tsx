"use client";

import { Container } from '@/library/components/layout';
import { DecisionsToggle } from '@/library/sections/decisions';
import { Download, Globe, Moon, Sun } from '@/library/icons';
import { track } from '@/library/analytics';
import { LOCALE_PATH } from '@/library/seo/site';
import { useSettings } from '@/library/utils/settings-provider';
import type { Lang } from '@/library/utils/dictionary';

/**
 * Barra de navegação.
 *
 * É `sticky` (não `fixed`): entra no fluxo do documento, então o hero começa
 * logo abaixo dela em vez de precisar de um padding-top adivinhado — e âncoras
 * de hash param no lugar certo sem gambiarra.
 *
 * O botão de tema não passa por React. A troca de classe é feita pelo script
 * inline de root-shell (aplicado antes do primeiro paint, sem flash) e o ícone
 * certo é escolhido por CSS a partir da classe `.dark`. Nada de estado
 * duplicado entre React e DOM.
 *
 * A troca de idioma também saiu do React, e por um motivo prático. Ela era um
 * `<button onClick={() => router.push('/pt')}>`, e isso a amarrou a duas coisas
 * que não precisavam estar no caminho: a hidratação e o roteador do cliente.
 * Quando a hidratação não acontece — é o que o dev server faz quando os chunks
 * de runtime dão 404 — o `onClick` nunca é anexado, o clique não faz NADA, e o
 * visitante fica numa página em inglês com um botão morto. Como cada idioma tem
 * URL própria (`/` e `/pt`) e raiz de layout própria, a navegação entre eles é
 * uma troca de documento de qualquer jeito: um `<a href>` faz exatamente isso,
 * funciona sem JavaScript, funciona no meio do carregamento, é o que o botão
 * sempre quis ser e é o que o navegador sabe fazer sem ajuda. O `track` do
 * analytics continua no `onClick`, que é o único pedaço aqui que precisava
 * mesmo de JS — e se ele falhar, a navegação acontece do mesmo jeito.
 */
export function AnchorNav() {
  const { lang, copy } = useSettings();

  const links = [
    { href: '#work', label: copy.nav.work },
    { href: '#experience', label: copy.nav.experience },
    { href: '#credentials', label: copy.nav.credentials },
    { href: '#capabilities', label: copy.nav.capabilities },
    { href: '#contact', label: copy.nav.contact },
  ];

  const cvHref = lang === 'pt-BR' ? '/cv/pt-br.pdf' : '/cv/en.pdf';
  const nextLang: Lang = lang === 'pt-BR' ? 'en' : 'pt-BR';
  const nextLangLabel = nextLang === 'en' ? 'EN' : 'PT';

  return (
    <>
      <a href="#work" className="skip-link">
        {copy.nav.skip_to_content}
      </a>

      <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
        <Container>
          {/* A barra só vira linha única em `lg`. Em `md` (768px) o conteúdo
              não cabe: marca + 5 âncoras + tema + idioma + botão de CV passam
              de 700px e a página ganha rolagem horizontal. Até `lg`, a nav
              ocupa a própria linha e rola na horizontal, como no mobile. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 lg:h-14 lg:flex-nowrap lg:py-0">
            <a
              href="#home"
              className="font-display text-sm min-[352px]:text-base tracking-tight text-ink-strong"
              aria-label={lang === 'en' ? 'Back to top' : 'Voltar ao topo'}
            >
              Abel Magnago
            </a>

            <nav
              aria-label={copy.footer.nav_label}
              className="order-last -mx-1 w-full overflow-x-auto px-1 lg:order-none lg:mx-0 lg:w-auto lg:overflow-visible lg:px-0"
            >
              <ul className="flex items-center gap-5 lg:gap-6">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-rule hover:link-rule-on inline-flex min-h-6 items-center whitespace-nowrap py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-1.5">
              <DecisionsToggle />

              <button
                type="button"
                data-theme-toggle
                aria-label={copy.nav.theme_toggle}
                title={copy.nav.theme_toggle}
                className="grid size-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-secondary hover:text-ink"
              >
                <Moon className="size-4 dark:hidden" aria-hidden="true" />
                <Sun className="hidden size-4 dark:block" aria-hidden="true" />
              </button>

              <a
                href={LOCALE_PATH[nextLang]}
                hrefLang={nextLang}
                onClick={() => track('language_switch', nextLang)}
                aria-label={copy.nav.switch_language_title}
                title={copy.nav.switch_language_title}
                className="flex items-center gap-1 rounded-md px-1.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:bg-secondary hover:text-ink"
              >
                <Globe className="size-3.5" aria-hidden="true" />
                <span className="font-medium">{nextLangLabel}</span>
              </a>

              <a
                href={cvHref}
                download
                onClick={() => track('cv_download', lang === 'pt-BR' ? 'cv-pt-br' : 'cv-en')}
                className="inline-flex items-center gap-2 rounded-md border border-rule-strong px-2 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-secondary"
              >
                <Download className="size-3.5" aria-hidden="true" />
                <span className="hidden lg:inline">{copy.nav.download_cv}</span>
                <span className="lg:hidden">CV</span>
              </a>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}