/**
 * Apara a moldura branca das logos de cliente.
 *
 * As logos em `public/projects/<key>/logo.avif` vieram de arquivos quadrados
 * de 320×320 com a marca centralizada e MUITO papel branco em volta — o
 * conteúdo real ocupa entre 5% e 18% da área. Numa tira de cards isso vira
 * uma fileira de quadrados brancos com um selo minúsculo no meio: o olho lê o
 * branco, não a marca.
 *
 * O que este script faz é só medir e recortar — não redesenha, não recolore,
 * não gera versão transparente. A logo continua sendo a logo do cliente, com
 * o fundo branco que ela já tinha; o que sai é a moldura vazia.
 *
 * Detecção de conteúdo: um pixel conta como tinta quando algum canal cai
 * abaixo de 240 OU quando há diferença entre canais acima de 24. A segunda
 * condição existe para marcas coloridas claras (amarelo, ciano), que passam
 * no teste de luminância mas não são branco.
 *
 * Saída: `logo-trim.avif` (altura 128, largura proporcional, par). O arquivo
 * original fica intacto — se o recorte erra, o insumo ainda está lá.
 *
 * Além das imagens, o script escreve `src/library/sections/logos.generated.ts`
 * com a largura e a altura reais de cada logo recortada. Isso não é
 * conveniência: sem os dois números no HTML, o `<img>` não reserva a caixa
 * antes de decodificar, e cada logo empurra o layout quando chega. Como as
 * proporções vão de 0,69:1 (CGE) a 2,3:1 (ProRaiz), a diferença aparece.
 *
 * Requer `ffmpeg` no PATH. Rode com `node scripts/prepare-logos.mjs`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = resolve(root, 'public/projects');

const TARGET_HEIGHT = 128; // 2× a altura máxima de exibição (~56px no dossiê)
const PAD_RATIO = 0.06; // respiro em volta da marca, sobre o lado maior

if (!existsSync(projectsDir)) {
  console.error(`[logos] pasta não encontrada: ${projectsDir}`);
  process.exit(1);
}

/** Decodifica a imagem em RGB cru para poder medir os pixels. */
function rawRGB(file, { scale } = {}) {
  const args = ['-hide_banner', '-loglevel', 'error', '-i', file];
  if (scale) args.push('-vf', `scale=${scale}`);
  args.push('-f', 'rawvideo', '-pix_fmt', 'rgb24', '-');
  return execFileSync('ffmpeg', args, { maxBuffer: 1 << 28 });
}

/** Caixa do conteúdo, ou `null` se a imagem for toda branca. */
function contentBox(buf, w, h) {
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const r = buf[i];
      const g = buf[i + 1];
      const b = buf[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max < 240 || max - min > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

const keys = readdirSync(projectsDir).filter((name) =>
  existsSync(join(projectsDir, name, 'logo.avif')),
);

/** Dimensões medidas, na ordem em que viram o módulo gerado. */
const measured = [];

if (keys.length === 0) {
  console.error('[logos] nenhuma logo encontrada em public/projects/<key>/logo.avif');
  process.exit(1);
}

for (const key of keys) {
  const src = join(projectsDir, key, 'logo.avif');
  const out = join(projectsDir, key, 'logo-trim.avif');

  const buf = rawRGB(src);
  const side = Math.round(Math.sqrt(buf.length / 3));
  const box = contentBox(buf, side, side);

  if (!box) {
    console.warn(`[logos] ${key}: nenhum conteúdo detectado — pulando.`);
    continue;
  }

  const pad = Math.round(Math.max(box.w, box.h) * PAD_RATIO);
  const x = Math.max(0, box.x - pad);
  const y = Math.max(0, box.y - pad);
  const w = Math.min(side - x, box.w + pad * 2);
  const h = Math.min(side - y, box.h + pad * 2);

  // Largura par obrigatória no SVT-AV1; altura fixa em 2× para dar nitidez
  // sem inflar o arquivo.
  const outW = Math.max(2, Math.round((w / h) * TARGET_HEIGHT / 2) * 2);

  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', src,
      '-vf', `crop=${w}:${h}:${x}:${y},scale=${outW}:${TARGET_HEIGHT}`,
      '-c:v', 'libsvtav1',
      '-preset', '6',
      '-crf', '26',
      '-pix_fmt', 'yuv420p',
      out,
    ],
    // O libsvtav1 imprime o próprio banner de configuração independentemente
    // do `-loglevel`; SVT_LOG=1 corta isso sem esconder erro do ffmpeg.
    { stdio: 'inherit', env: { ...process.env, SVT_LOG: '1' } },
  );

  const kb = (statSync(out).size / 1024).toFixed(1);
  console.log(
    `[logos] ${key}: ${w}×${h} (de ${side}×${side}) → ${outW}×${TARGET_HEIGHT} · ${kb} KB`,
  );

  measured.push({ key, width: outW, height: TARGET_HEIGHT });
}

if (measured.length === 0) {
  console.error('[logos] nada foi gerado — módulo de dimensões não escrito.');
  process.exit(1);
}

const generated = `// GERADO por \`scripts/prepare-logos.mjs\` — não edite à mão.
// Rode \`pnpm logos\` para regerar as imagens e este arquivo juntos.

export type ProjectLogo = { src: string; width: number; height: number };

export const PROJECT_LOGOS = {
${measured
  .map(
    ({ key, width, height }) =>
      `  ${JSON.stringify(key)}: { src: '/projects/${key}/logo-trim.avif', width: ${width}, height: ${height} },`,
  )
  .join('\n')}
} as const satisfies Record<string, ProjectLogo>;
`;

const generatedPath = resolve(root, 'src/library/sections/logos.generated.ts');
writeFileSync(generatedPath, generated, 'utf8');
console.log(`[logos] dimensões → ${generatedPath.replace(root + '/', '')}`);
console.log('[logos] pronto.');