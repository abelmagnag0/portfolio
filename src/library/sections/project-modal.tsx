"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/library/components/dialog';
import { ImageWithFallback } from '@/library/components/image-with-fallback';
import { useState } from 'react';
import type { Project } from './projects.data';

function ProjectCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const total = images.length || 0;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  if (!total) return null;
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg">
      <a href={images[index]} target="_blank" rel="noopener noreferrer" title="Abrir imagem em nova guia">
        <ImageWithFallback src={images[index]} alt={`${alt} - imagem ${index + 1}`} className="w-full h-full object-cover" />
      </a>
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 border border-border rounded-full px-3 py-1 text-sm"
            aria-label="Imagem anterior"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 border border-border rounded-full px-3 py-1 text-sm"
            aria-label="Próxima imagem"
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

export function ProjectModal({ project, open, onOpenChangeAction }: { project: Project; open?: boolean; onOpenChangeAction?: (v: boolean) => void }) {
  const isControlled = typeof open === 'boolean';
  // Usa a nova galeria se disponível; cai para images por compatibilidade
  const imgs = (project.gallery && project.gallery.length > 0) ? project.gallery : (project.images || []);
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      {!isControlled && (
        <DialogTrigger asChild>
          <button className="mt-2 text-sm text-primary hover:underline" type="button">
            Ver detalhes
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[min(96vw,1100px)] md:w-[min(96vw,1280px)] max-w-none">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ProjectCarousel images={imgs} alt={project.title} />
          <p className="text-muted-foreground">{project.longDescription}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
