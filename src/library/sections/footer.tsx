import { Container, Rule } from '@/library/components/layout';
import { TrackedLink } from '@/library/components/tracked-link';
import { Github, Linkedin, Mail } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';

/**
 * Rodapé.
 *
 * Fecha o documento: assinatura, índice de navegação e canais — as mesmas três
 * informações de um colofão. O ano vem do build (`output: export` gera HTML
 * estático), então não envelhece sozinho como um "© 2025" escrito à mão.
 */
export function Footer({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.footer;
  const year = new Date().getFullYear();

  const navLinks = [
    { href: '#work', label: dict.nav.work },
    { href: '#experience', label: dict.nav.experience },
    { href: '#credentials', label: dict.nav.credentials },
    { href: '#capabilities', label: dict.nav.capabilities },
    { href: '#source', label: dict.nav.source },
    { href: '#contact', label: dict.nav.contact },
  ];

  const channels = [
    {
      href: 'mailto:abel.magnago@gmail.com',
      label: 'E-mail',
      value: 'abel.magnago@gmail.com',
      icon: Mail,
      external: false,
    },
    {
      href: 'https://www.linkedin.com/in/abel-magnago1',
      label: 'LinkedIn',
      value: '/in/abel-magnago1',
      icon: Linkedin,
      external: true,
    },
    {
      href: 'https://github.com/abelmagnag0',
      label: 'GitHub',
      value: 'abelmagnag0',
      icon: Github,
      external: true,
    },
  ];

  return (
    <footer className="band pb-10 pt-8">
      <Container>
        <Rule className="bg-rule-strong" />

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-2xl tracking-tight text-ink-strong">Abel Magnago</p>
            <p className="mt-2 text-sm text-ink-soft">{copy.role}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
              {copy.location}
            </p>
          </div>

          <nav aria-label={copy.nav_label} className="lg:col-span-3">
            <span className="text-sm font-medium text-ink">{copy.nav_label}</span>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-rule hover:link-rule-on inline-flex min-h-6 items-center text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <span className="text-sm font-medium text-ink">{copy.channels_label}</span>
            <ul className="mt-4 space-y-2.5">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <li key={channel.label}>
                    <TrackedLink
                      href={channel.href}
                      event="social_click"
                      eventName={`footer-${channel.label}`}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                      className="group inline-flex min-h-6 items-center gap-2.5 text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      <Icon className="size-4 text-ink-faint" aria-hidden="true" />
                      <span className="link-rule group-hover:link-rule-on">{channel.value}</span>
                    </TrackedLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-rule pt-6">
          <p className="font-mono text-[0.6875rem] leading-relaxed text-ink-faint">
            © {year} Abel Magnago
          </p>
          <a
            href="#home"
            className="link-rule hover:link-rule-on inline-flex min-h-6 items-center font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
          >
            ↑ {copy.back_to_top}
          </a>
        </div>
      </Container>
    </footer>
  );
}