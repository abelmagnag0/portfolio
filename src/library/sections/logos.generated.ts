// GERADO por `scripts/prepare-logos.mjs` — não edite à mão.
// Rode `pnpm logos` para regerar as imagens e este arquivo juntos.

export type ProjectLogo = { src: string; width: number; height: number };

export const PROJECT_LOGOS = {
  "cge": { src: '/projects/cge/logo-trim.avif', width: 88, height: 128 },
  "cursology": { src: '/projects/cursology/logo-trim.avif', width: 424, height: 128 },
  "extreme-digital": { src: '/projects/extreme-digital/logo-trim.avif', width: 346, height: 128 },
  "prodigio": { src: '/projects/prodigio/logo-trim.avif', width: 172, height: 128 },
  "proraiz": { src: '/projects/proraiz/logo-trim.avif', width: 294, height: 128 },
  "raiz": { src: '/projects/raiz/logo-trim.avif', width: 106, height: 128 },
} as const satisfies Record<string, ProjectLogo>;
