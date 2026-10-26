/**
 * Gera `public/og.png` — o cartão 1200×630 usado nos previews de link
 * (LinkedIn, WhatsApp, Slack, X).
 *
 * Por que um PNG estático em vez da convenção `opengraph-image.tsx`:
 * o projeto usa `output: 'export'`. A convenção exige runtime de edge, e o
 * Next recusa a gerar o arquivo num export estático — resultado: a rota
 * `/opengraph-image` responde 404 em produção e todo preview de link quebra.
 * Um PNG commitado no `public/` não tem esse problema e ainda custa zero
 * em runtime.
 *
 * As fontes não são "aproximadas": o script lê as regras `@font-face` do CSS
 * que o `next/font` já emitiu em `.next/` e aponta para os mesmos arquivos
 * `.woff2`. O cartão sai com a Newsreader e a JetBrains Mono reais, com os
 * mesmos `unicode-range`, então acentuação e travessão saem certos.
 * Sem build prévio, cai num serif de sistema — degradação, não erro.
 *
 * Uso: `pnpm build && pnpm og`
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Conteúdo dos cartões. Texto de design, não dado do app — por isso mora aqui
 * e não no dicionário.
 *
 * Dois cartões porque cada idioma tem URL própria. A raiz `/` é o inglês e o
 * português fica em `/pt`, então a URL estampada em cada cartão acompanha —
 * mostrar `abel.dev.br` no cartão em português mandaria o leitor para a página
 * em inglês.
 *
 * O preview de link é literalmente a primeira impressão.
 */
const CARDS = [
  {
    file: 'public/og.png',
    name: 'ABEL MAGNAGO',
    role: 'ENGENHEIRO DE SOFTWARE · RIO DE JANEIRO',
    headline: ['Sistemas web', 'desde 2021.'],
    meta: 'Governo, jurídico e educação',
    stack: 'Node · TypeScript · React · AWS',
    url: 'abel.dev.br/pt',
  },
  {
    file: 'public/og-en.png',
    name: 'ABEL MAGNAGO',
    role: 'SOFTWARE ENGINEER · RIO DE JANEIRO',
    headline: ['Web systems', 'since 2021.'],
    meta: 'Government, legal and education',
    stack: 'Node · TypeScript · React · AWS',
    url: 'abel.dev.br',
  },
];

/** Procura o CSS do next/font e devolve as regras @font-face das famílias usadas. */
function collectFontFaces() {
  const cssDir = join(root, '.next/static/css');
  if (!existsSync(cssDir)) return { css: '', found: false };

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.css')) files.push(full);
    }
  };
  walk(cssDir);

  const wanted = /font-family:\s*['"]?(Newsreader|JetBrains Mono|Public Sans)['"]?/;
  const blocks = [];
  for (const file of files) {
    const css = readFileSync(file, 'utf8');
    for (const block of css.match(/@font-face\s*\{[^}]*\}/g) ?? []) {
      if (!wanted.test(block)) continue;
      // Aponta para o arquivo local em vez da URL do site.
      const local = block.replace(
        /url\((\/?)([^)]+?\.woff2)\)/g,
        (_m, _slash, p) => `url("file://${join(root, '.next', String(p))}")`,
      );
      blocks.push(local);
    }
  }
  return { css: blocks.join('\n'), found: blocks.length > 0 };
}

const { css: fontFaces, found } = collectFontFaces();
console.log(
  found
    ? `[og] ${fontFaces.split('@font-face').length - 1} @font-face reaproveitadas do build`
    : '[og] build não encontrado — usando serif de sistema',
);

const serifStack = found
  ? "'Newsreader', Georgia, serif"
  : "Georgia, 'DejaVu Serif', 'Liberation Serif', serif";
const monoStack = found ? "'JetBrains Mono', monospace" : "ui-monospace, 'DejaVu Sans Mono', monospace";

const buildHtml = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontFaces}
*{margin:0;padding:0;box-sizing:border-box}
/* Paleta do tema padrão do site (escuro), lida dos mesmos tokens de
   globals.css: papel #131313, tinta #e2e2e2, tinta forte #fff,
   tinta fraca #8a8a85, fio rgba(255,255,255,.18). O cartão de preview é a
   primeira impressão do link — sair em creme enquanto o site abre em escuro
   seria anunciar outro site. */
body{
  width:${WIDTH}px;height:${HEIGHT}px;background:#131313;color:#E2E2E2;
  font-family:${serifStack};
  -webkit-font-smoothing:antialiased;
}
.card{position:relative;width:${WIDTH}px;height:${HEIGHT}px;padding:64px 72px;
  display:flex;flex-direction:column;justify-content:space-between;}
.row{display:flex;align-items:center;justify-content:space-between}
.mono{font-family:${monoStack};text-transform:uppercase;letter-spacing:.14em;
  font-size:15px;font-weight:500}
.faint{color:#8A8A85}
.rule{height:1px;background:rgba(255,255,255,.18);width:100%}
.brand{display:flex;align-items:center;gap:18px}
.mark{width:44px;height:44px;background:#1B3FBF;color:#FFFFFF;border-radius:5px;
  display:flex;align-items:center;justify-content:center;
  font-size:23px;font-weight:500;letter-spacing:-1px}
h1{font-size:82px;line-height:1.03;letter-spacing:-.025em;font-weight:400;color:#FFFFFF}
.foot{display:flex;align-items:baseline;justify-content:space-between}
</style></head>
<body>
  <div class="card">
    <div>
      <div class="row">
        <div class="brand">
          <div class="mark">AM</div>
          <span class="mono">${card.name}</span>
        </div>
        <span class="mono faint">${card.role}</span>
      </div>
      <div class="rule" style="margin-top:22px"></div>
    </div>

    <h1>${card.headline[0]}<br>${card.headline[1]}</h1>

    <div>
      <div class="rule"></div>
      <div class="foot" style="margin-top:20px">
        <span class="mono faint">${card.meta} · ${card.stack}</span>
        <span class="mono">${card.url}</span>
      </div>
    </div>
  </div>
</body></html>`;

for (const card of CARDS) {
  const htmlPath = join(root, `.next/og-card-${card.file.replace(/[^a-z0-9]/gi, '_')}.html`);
  writeFileSync(htmlPath, buildHtml(card));

  const outPath = join(root, card.file);
  execFileSync(
    'chromium',
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${outPath}`,
      '--virtual-time-budget=4000',
      `file://${htmlPath}`,
    ],
    { stdio: 'ignore' },
  );

  if (!existsSync(outPath)) {
    console.error(`[og] falhou: chromium não gerou ${card.file}`);
    process.exit(1);
  }
  console.log(`[og] ${card.file} gerado (${WIDTH}×${HEIGHT})`);
}