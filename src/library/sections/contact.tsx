import { Container, SectionHead, Rule } from '@/library/components/layout';
import { TrackedLink } from '@/library/components/tracked-link';
import { Github, Linkedin, Mail, Download, ArrowRight } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';
import { ContactForm } from './contact-form';

/**
 * Contato.
 *
 * Ordem pensada para conversão, não para simetria: o formulário vem primeiro e
 * ocupa a coluna larga; os canais diretos ficam ao lado de quem já decidiu e
 * não quer preencher campo nenhum. O retrato reaparece aqui de propósito — é
 * onde a pessoa decide falar com alguém, e alguém é mais fácil de contatar do
 * que um formulário.
 */
export function ContactSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.contact;

  const channels = [
    {
      icon: Mail,
      label: 'E-mail',
      value: 'abel.magnago@gmail.com',
      href: 'mailto:abel.magnago@gmail.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: '/in/abel-magnago1',
      href: 'https://www.linkedin.com/in/abel-magnago1',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'abelmagnag0',
      href: 'https://github.com/abelmagnag0',
    },
  ];

  const cvHref = lang === 'pt-BR' ? '/cv/pt-br.pdf' : '/cv/en.pdf';

  return (
    <section id="contact" className="cv-auto py-20 lg:py-28">
      <Container>
        <SectionHead
          title={copy.title}
          subtitle={copy.subtitle}
          anchor="contact"
        />

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-rule-strong bg-paper-raised p-3">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portrait-square.webp"
                  width={512}
                  height={512}
                  alt={dict.hero.portrait_alt}
                  loading="lazy"
                  decoding="async"
                  className="block size-24 shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight text-ink-strong">Abel Magnago</p>
                  <p className="mt-1 text-sm text-ink-soft">{dict.footer.role}</p>
                  <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-faint">
                    {dict.footer.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-sm font-medium text-ink">{copy.channels_label}</span>
              <ul className="mt-4">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.label} className="border-t border-rule">
                      <TrackedLink
                        href={channel.href}
                        event="social_click"
                        eventName={channel.label}
                        {...(channel.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer noopener' }
                          : {})}
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                            {channel.label}
                          </span>
                          <span className="truncate text-sm text-ink-soft">{channel.value}</span>
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </TrackedLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 border-t border-rule pt-5">
              <TrackedLink
                href={cvHref}
                download
                event="cv_download"
                eventName={lang === 'pt-BR' ? 'cv-pt-br' : 'cv-en'}
                className="link-rule hover:link-rule-on inline-flex min-h-6 items-center gap-2 text-sm font-medium text-ink"
              >
                <Download className="size-4" aria-hidden="true" />
                {copy.cv_label}
              </TrackedLink>
            </div>

            <Rule className="mt-8" />
            <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
              {copy.response_note}
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}