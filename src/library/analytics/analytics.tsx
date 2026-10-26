"use client";

import { useEffect } from "react";
import { track } from "./index";

/**
 * Dispara o pageview inicial e observa as seções da home para registrar
 * quando o visitante as visualiza (scroll depth por seção).
 * Não renderiza nada.
 */
const SECTIONS = [
  "home",
  "work",
  "experience",
  "credentials",
  "capabilities",
  "contact",
] as const;

export function Analytics() {
  useEffect(() => {
    // Não polui as métricas com acessos ao próprio painel.
    if (window.location.pathname.startsWith("/admin")) return;

    track("pageview");

    const seen = new Set<string>();
    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (seen.has(id)) continue;
          seen.add(id);
          track("section_view", id, { section: id });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}
