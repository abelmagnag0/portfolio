"use client";
import { Badge } from '@/library/components/badge';
import { Globe, Lock } from '@/library/icons';
import { dictionary } from '@/library/utils/dictionary';
import { useSettings } from '@/library/utils/settings-provider';
import { ProjectModalTrigger } from './project-modal-trigger';
import { getProjectCopy, projectsData, type Project } from './projects.data';

function TypeBadge({ type }: { type: Project['type'] }) {
  const { lang } = useSettings();
  const badge = dictionary[lang].projects.badge;
  const config = (() => {
    if (type === 'publico') {
      return {
        className: 'border-transparent bg-[#244782] text-white hover:bg-[#244782]/90 focus-visible:ring-[#244782]/30',
        icon: <Globe className="w-3 h-3" />,
        label: badge.public,
      } as const;
    }
    if (type === 'privado') {
      return {
        className: 'border-transparent bg-[#8f1d1d] text-white hover:bg-[#8f1d1d]/90 focus-visible:ring-[#8f1d1d]/30',
        icon: <Lock className="w-3 h-3" />,
        label: badge.private,
      } as const;
    }
    return {
      className: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30',
      icon: <Globe className="w-3 h-3" />,
      label: badge.authoral,
    } as const;
  })();

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export function ProjectsSectionSSR() {
  const { lang } = useSettings();
  const m = dictionary[lang].projects;
  const cards: Project[] = projectsData;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4" suppressHydrationWarning>{m.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((project) => {
            const copy = getProjectCopy(project, lang);
            const logo1x = project.logo || project.images?.[0] || '';
            const isLogoAvif = logo1x.endsWith('.avif');
            const logo2x = isLogoAvif ? logo1x.replace('.avif', '@2x.avif') : logo1x;
            const card1x = project.card || project.gallery?.[0] || project.images?.[0] || logo1x;
            const isCardAvif = !!project.card && card1x.endsWith('.avif');
            const card2x = isCardAvif ? card1x.replace('.avif', '@2x.avif') : '';
            const overlayPrompt = lang === 'pt-BR' ? 'Ver case completo' : 'View full case';
            const modalLabel = lang === 'pt-BR'
              ? `Abrir case completo de ${copy.title}`
              : `Open full case for ${copy.title}`;
            const previewAlt = lang === 'pt-BR' ? `Prévia do projeto ${copy.title}` : `Project preview for ${copy.title}`;
            const logoAlt = lang === 'pt-BR' ? `Logo do projeto ${copy.title}` : `Project logo for ${copy.title}`;
            return (
              <article
                key={project.key}
                id={`project-${project.key}`}
                className="group relative border border-border rounded-2xl overflow-hidden h-full flex flex-col mx-auto w-full max-w-[260px] md:max-w-[274px] lg:max-w-[250px] bg-muted dark:bg-card shadow-sm hover:shadow-md hover:border-primary/50 dark:shadow-none dark:hover:shadow-none transition-all"
              >
                {/* Botão invisível cobrindo todo o card para abrir o modal */}
                <ProjectModalTrigger project={project} overlay label={modalLabel} />

                {/* Área de mídia com dimensão fixa para todas resoluções (logo sempre contida) */}
                <div className="relative overflow-hidden project-card aspect-square w-full bg-muted dark:bg-muted/20 border-b border-border">
                  {/* Preview (hover/touch) */}
                  <picture className="absolute inset-0">
                    {isCardAvif && card2x && (
                      <source srcSet={`${card1x} 1x, ${card2x} 2x`} type="image/avif" />
                    )}
                    <img
                      src={card1x}
                      alt={previewAlt}
                      loading="lazy"
                      decoding="async"
                      className="preview absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    />
                  </picture>
                  {/* Logo (desktop padrão) - ocupar 100% da área sem padding/margem; bg-card garante fundo neutro atrás do logo */}
                  <div className="logo absolute inset-0 grid place-items-center bg-muted dark:bg-card transition-opacity duration-300">
                    {isLogoAvif ? (
                      <picture>
                        <source srcSet={`${logo1x} 1x, ${logo2x} 2x`} type="image/avif" />
                        <img
                          src={logo1x}
                          alt={logoAlt}
                          loading="lazy"
                          decoding="async"
                          className="logo-img w-full h-full object-contain drop-shadow-md"
                        />
                      </picture>
                    ) : (
                      <img
                        src={logo1x}
                        alt={logoAlt}
                        loading="lazy"
                        decoding="async"
                        className="logo-img w-full h-full object-contain drop-shadow-md"
                      />
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <TypeBadge type={project.type} />
                  </div>
                </div>

                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl mb-2" suppressHydrationWarning>{copy.title}</h3>
                  <p className="text-muted-foreground mb-4 grow" suppressHydrationWarning>{copy.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech) => (
                      <span key={tech} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {copy.impact && <div className="text-sm text-primary" suppressHydrationWarning>{copy.impact}</div>}
                </div>

                {/* Overlay visual no hover cobrindo o card inteiro */}
                <div className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="px-3 py-1.5 rounded-full bg-background/80 border border-border text-sm text-foreground" suppressHydrationWarning>
                      {overlayPrompt}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSectionSSR;
