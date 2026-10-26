/**
 * Empacota os handlers das Lambdas (backend/*.mjs) em um único arquivo CJS cada,
 * já com as dependências (AWS SDK v3) embutidas — assim o deploy do Serverless
 * só precisa enviar `dist-api/**`, sem node_modules.
 *
 * Uso: node ./scripts/build-api.mjs   (ou: pnpm build:api)
 */
import { build } from "esbuild";
import { rm } from "node:fs/promises";

const ENTRIES = [
  "backend/track.mjs",
  "backend/leads.mjs",
  "backend/admin-config.mjs",
  "backend/admin-stats.mjs",
  "backend/admin-leads.mjs",
];

const OUTDIR = "dist-api";

await rm(OUTDIR, { recursive: true, force: true });

await build({
  entryPoints: ENTRIES,
  outdir: OUTDIR,
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  entryNames: "[name]",
  outExtension: { ".js": ".js" },
  minify: false,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
  define: { "process.env.NODE_ENV": '"production"' },
});

console.log(`[build-api] ${ENTRIES.length} handlers gerados em ${OUTDIR}/`);
