import { ProjectModalTrigger } from './project-modal-trigger';
import { projectsData, type Project } from './projects.data';
 

function TypeBadge({ type }: { type: Project['type'] }) {
  const text = type === 'privado' ? 'Privado' : type === 'autoral' ? 'Autoral' : 'Público';
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {text}
    </span>
  );
}

export function ProjectsSectionSSR() {
  // Mostrar apenas o projeto LMS por enquanto
  const cards: Project[] = projectsData.filter((p) => p.key === 'lms');

  return (
    <section id="projetos" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Projetos em Destaque</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((project) => {
            const logo1x = project.logo || project.images?.[0] || '';
            const isLogoAvif = logo1x.endsWith('.avif');
            const logo2x = isLogoAvif ? logo1x.replace('.avif', '@2x.avif') : logo1x;
            const card1x = project.card || project.images?.[0] || '';
            const isCardAvif = card1x.endsWith('.avif');
            const card2x = isCardAvif ? card1x.replace('.avif', '@2x.avif') : card1x;
            return (
              <article
                key={project.key}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col mx-auto w-full max-w-[260px] md:max-w-[274px] lg:max-w-[250px]"
              >
                {/* Botão invisível cobrindo todo o card para abrir o modal */}
                <ProjectModalTrigger project={project} overlay label={`Abrir detalhes do projeto ${project.title}`} />

                {/* Área de mídia com dimensão fixa para todas resoluções (logo sempre contida) */}
                <div className="relative overflow-hidden project-card h-56 w-full">
                  {/* Preview (hover/touch) */}
                  <picture className="absolute inset-0">
                    {isCardAvif && (
                      <source srcSet={`${card1x} 1x, ${card2x} 2x`} type="image/avif" />
                    )}
                    <img
                      src={card1x}
                      alt={`Prévia do projeto ${project.title}`}
                      loading="lazy"
                      decoding="async"
                      className="preview absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    />
                  </picture>
                  {/* Logo (desktop padrão) - ocupar 100% da área sem padding/margem; bg-card garante fundo neutro atrás do logo */}
                  <div className="logo absolute inset-0 grid place-items-center bg-card transition-opacity duration-300">
                    {isLogoAvif ? (
                      <picture>
                        <source srcSet={`${logo1x} 1x, ${logo2x} 2x`} type="image/avif" />
                        <img
                          src={logo1x}
                          alt={`Logo do projeto ${project.title}`}
                          loading="lazy"
                          decoding="async"
                          className="logo-img w-full h-full object-contain drop-shadow-md"
                        />
                      </picture>
                    ) : (
                      <img
                        src={logo1x}
                        alt={`Logo do projeto ${project.title}`}
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
                  <h3 className="text-xl mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 grow">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech) => (
                      <span key={tech} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.impact && <div className="text-sm text-primary">{project.impact}</div>}
                </div>

                {/* Overlay visual no hover cobrindo o card inteiro */}
                <div className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="px-3 py-1.5 rounded-full bg-background/80 border border-border text-sm text-foreground">Clique para ver mais</span>
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
