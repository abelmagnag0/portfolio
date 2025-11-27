"use client";

import { Badge } from '@/library/components/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/library/components/dialog';
import { ImageWithFallback } from '@/library/components/image-with-fallback';
import { Globe, Lock } from '@/library/icons';
import type { Lang } from '@/library/utils/dictionary';
import { motion } from '@/library/utils/motion';
import { useSettings } from '@/library/utils/settings-provider';
import { useMemo, useState } from 'react';
import { getProjectCopy, projectsData } from './projects.data';

function ProjectCarousel({ images, alt, lang }: { images: string[]; alt: string; lang: Lang }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  if (!images.length) return null;

  const previousLabel = lang === 'pt-BR' ? 'Imagem anterior' : 'Previous image';
  const nextLabel = lang === 'pt-BR' ? 'Próxima imagem' : 'Next image';
  const imageWord = lang === 'pt-BR' ? 'imagem' : 'image';

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-muted dark:bg-muted/20 border border-border">
      <ImageWithFallback
        src={images[index]}
        alt={`${alt} - ${imageWord} ${index + 1}`}
        className="w-full h-full"
      />
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 border border-border rounded-full px-3 py-1 text-sm"
            aria-label={previousLabel}
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 border border-border rounded-full px-3 py-1 text-sm"
            aria-label={nextLabel}
          >
            ▶
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/70 rounded-full px-2 py-1 text-xs">
            {index + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}

export function ProjectsSection() {
  const { t, lang } = useSettings();
  const projects = projectsData;
  const pageSize = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(projects.length / pageSize);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [page, projects]);

  const prevPageLabel = lang === 'pt-BR' ? 'Anterior' : 'Previous';
  const nextPageLabel = lang === 'pt-BR' ? 'Próxima' : 'Next';
  const prevPageAria = lang === 'pt-BR' ? 'Página anterior' : 'Previous page';
  const nextPageAria = lang === 'pt-BR' ? 'Próxima página' : 'Next page';

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4" suppressHydrationWarning>
            {t('projects.title')}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((project, index) => {
            const copy = getProjectCopy(project, lang);
            const previewImage = project.gallery?.[0] ?? project.images?.[0] ?? project.logo ?? '';
            const modalImages = project.gallery && project.gallery.length > 0 ? project.gallery : project.images ?? [];
            const badgeConfig = (() => {
              if (project.type === 'publico') {
                return {
                  className: 'border-transparent bg-[#244782] text-white hover:bg-[#244782]/90 focus-visible:ring-[#244782]/30',
                  icon: <Globe className="w-3 h-3" />,
                  label: t('projects.badge.public'),
                } as const;
              }
              if (project.type === 'privado') {
                return {
                  className: 'border-transparent bg-[#8f1d1d] text-white hover:bg-[#8f1d1d]/90 focus-visible:ring-[#8f1d1d]/30',
                  icon: <Lock className="w-3 h-3" />,
                  label: t('projects.badge.private'),
                } as const;
              }
              return {
                className: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30',
                icon: <Globe className="w-3 h-3" />,
                label: t('projects.badge.authoral'),
              } as const;
            })();

            return (
              <motion.div
                key={project.key}
                id={`project-${project.key}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer border border-border rounded-2xl overflow-hidden transition-all h-full flex flex-col bg-muted dark:bg-card shadow-sm hover:shadow-md hover:border-primary/50 dark:shadow-none dark:hover:shadow-none">
                      <div className="relative aspect-square overflow-hidden bg-muted dark:bg-muted/20 border-b border-border">
                        <ImageWithFallback
                          src={previewImage}
                          alt={copy.title}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className={badgeConfig.className}>
                            {badgeConfig.icon}
                            {badgeConfig.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col grow">
                        <h3 className="text-xl mb-2 group-hover:text-primary transition-colors" suppressHydrationWarning>
                          {copy.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 grow" suppressHydrationWarning>
                          {copy.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.stack.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {copy.impact && (
                          <div className="text-sm text-primary" suppressHydrationWarning>
                            {copy.impact}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle suppressHydrationWarning>{copy.title}</DialogTitle>
                      <DialogDescription suppressHydrationWarning>{copy.description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <ProjectCarousel images={modalImages} alt={copy.title} lang={lang} />

                      <p className="text-muted-foreground" suppressHydrationWarning>
                        {copy.longDescription}
                      </p>

                      <div>
                        <h4 className="mb-2">{t('projects.tech_used')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {copy.impact && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">{t('projects.impact')}</div>
                          <div className="text-lg" suppressHydrationWarning>{copy.impact}</div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </div>
        {/* Paginação simples */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label={prevPageAria}
          >
            {prevPageLabel}
          </button>
          <div className="text-sm">
            {page} / {totalPages}
          </div>
          <button
            className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label={nextPageAria}
          >
            {nextPageLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
