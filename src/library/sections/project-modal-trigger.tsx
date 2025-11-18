"use client";

import { cn } from "@/library/components/utils";
import { useSettings } from "@/library/utils/settings-provider";
import { useCallback, useState, type ComponentType, type ReactNode } from "react";
import type { Project } from "./projects.data";

type TriggerProps = {
  project: Project;
  overlay?: boolean; // quando true, o botão cobre todo o card e fica invisível
  className?: string; // classes extras para customização
  label?: string; // acessibilidade em modo overlay
  children?: ReactNode; // conteúdo opcional quando não for overlay
};

// Carrega o modal apenas quando necessário
export function ProjectModalTrigger({ project, overlay = false, className, label, children }: TriggerProps) {
  const { lang } = useSettings();
  const [open, setOpen] = useState(false);
  const [LoadedModal, setLoadedModal] = useState<null | ComponentType<{ project: Project; open: boolean; onOpenChangeAction: (v: boolean) => void }>>(null);
  const defaultLabel = lang === 'pt-BR' ? 'Ver detalhes' : 'View details';
  const resolvedLabel = label ?? defaultLabel;

  const onClick = useCallback(async () => {
    if (!LoadedModal) {
      const mod = await import("./project-modal");
      setLoadedModal(() => mod.ProjectModal as unknown as ComponentType<{ project: Project; open: boolean; onOpenChangeAction: (v: boolean) => void }>);
    }
    setOpen(true);
  }, [LoadedModal]);

  const btnClass = overlay
    ? cn("absolute inset-0 z-30 opacity-0 focus:opacity-0", className)
    : cn("mt-2 text-sm text-primary hover:underline");

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={btnClass}
        aria-label={overlay ? resolvedLabel : undefined}
      >
        {overlay ? null : (children ?? resolvedLabel)}
      </button>
      {LoadedModal && (
        <LoadedModal project={project} open={open} onOpenChangeAction={setOpen} />
      )}
    </>
  );
}
