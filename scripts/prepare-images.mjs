/**
 * Gera as imagens do retrato a partir de `assets/portrait-source.png`.
 *
 * Cada formato existe por um motivo específico na página:
 *   - portrait-4x5    → chapa principal do hero (retrato 4:5)
 *   - portrait-square → avatar pequeno no card de contato
 *
 * A fonte atual é 928×1152, ou seja 0,806 — praticamente 4:5 nativo. Por isso
 * o recorte do hero quase não recorta: ele apara a largura até bater 4:5 exatos
 * (921×1152) e só então reduz. Nada é esticado.
 *
 * Cuidado com a ordem dos filtros: recortar uma janela 800×640 e depois escalar
 * para 640×800 NÃO é recorte — é esticamento vertical de 1,25×. Sempre `crop`
 * primeiro, `scale` depois.
 *
 * O recorte quadrado é ancorado na face, e não no centro da imagem. Medido por
 * detecção de tom de pele na fonte: a face fica em torno de x≈420 e o topo da
 * cabeça em y≈128, então o centro geométrico da foto não é o centro do rosto.
 * Recortar pelo centro aqui deixaria a cabeça baixa demais no avatar.
 *
 * Requer `ffmpeg` no PATH. Rode com `pnpm images` depois de trocar a fonte.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'assets/portrait-source.png');
const outDir = resolve(root, 'public');

if (!existsSync(source)) {
  console.error(`[images] fonte não encontrada: ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

/** @type {{name: string, scale: string, vf: string, quality: number}[]} */
const outputs = [
  {
    name: 'portrait-4x5.webp',
    // 4:5 exato a partir de 928×1152: apara 7px de cada lado e reduz para 640×800.
    vf: 'crop=w=921:h=1152:x=(iw-921)/2:y=0,scale=640:800',
    quality: 88,
  },
  {
    name: 'portrait-4x5-sm.webp',
    vf: 'crop=w=921:h=1152:x=(iw-921)/2:y=0,scale=320:400',
    quality: 84,
  },
  {
    name: 'portrait-square.webp',
    // Janela 580×580 centrada na face (centro medido ≈ 420,360), não na imagem.
    vf: 'crop=w=580:h=580:x=130:y=70,scale=512:512',
    quality: 88,
  },
];

for (const { name, vf, quality } of outputs) {
  const target = resolve(outDir, name);
  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', source,
      '-vf', vf,
      '-c:v', 'libwebp',
      '-quality', String(quality),
      '-compression_level', '6',
      target,
    ],
    { stdio: 'inherit' },
  );
  const kb = (statSync(target).size / 1024).toFixed(1);
  console.log(`[images] ${name} → ${kb} KB`);
}

console.log('[images] pronto.');