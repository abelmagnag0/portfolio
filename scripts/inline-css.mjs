#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'out');

/**
 * Recursively walk a directory and return all file paths with a given extension.
 * @param {string} dir
 * @param {string} ext
 * @param {string[]} acc
 * @returns {string[]}
 */
function walk(dir, ext = '.html', acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p, ext, acc);
    } else if (e.isFile() && p.endsWith(ext)) {
      acc.push(p);
    }
  }
  return acc;
}

/**
 * Read CSS file content if it exists and is under maxBytes.
 * @param {string} href
 * @param {string} htmlPath
 * @param {number} maxBytes
 */
function readCssForHref(href, htmlPath, maxBytes = 200 * 1024) {
  // Resolve href relative to outDir (absolute) or relative to the html file (relative)
  const isAbsolute = href.startsWith('/');
  const fsPath = isAbsolute
    ? path.join(outDir, href.replace(/^\//, ''))
    : path.join(path.dirname(htmlPath), href);

  if (!fs.existsSync(fsPath)) return null;
  const stat = fs.statSync(fsPath);
  if (!stat.isFile()) return null;
  if (stat.size > maxBytes) return null;
  try {
    const css = fs.readFileSync(fsPath, 'utf8');
    return { css, fsPath };
  } catch {
    return null;
  }
}

/**
 * Inline <link rel="stylesheet" href="..."> into <style> for local CSS files.
 * Returns true if the file was modified.
 */
function inlineStyles(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const original = html;

  // Matches link tags with rel="stylesheet" and captures the href
  const linkRe = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/>?/gi;

  html = html.replace(linkRe, (full, href) => {
    // Only inline local Next-generated CSS (/_next/static/css/* or app/*.css)
    if (!href) return full;
    const isLocalCss = href.startsWith('/_next/static/css/') || href.includes('/app/') || href.endsWith('.css');
    if (!isLocalCss) return full;

    const result = readCssForHref(href, htmlPath);
    if (!result) return full;

    const { css } = result;
    const inlined = `<style data-inlined-href="${href}">\n${css}\n</style>`;
    return inlined;
  });

  if (html !== original) {
    fs.writeFileSync(htmlPath, html);
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.error(`[inline-css] Pasta 'out/' não encontrada. Rode 'next build' antes.`);
    process.exit(1);
  }

  const htmlFiles = walk(outDir, '.html');
  let modified = 0;
  for (const file of htmlFiles) {
    if (inlineStyles(file)) {
      modified++;
      console.log(`[inline-css] Inlined CSS em: ${path.relative(outDir, file)}`);
    }
  }
  if (modified === 0) {
    console.log('[inline-css] Nenhum <link rel="stylesheet"> local encontrado para inlining.');
  } else {
    console.log(`[inline-css] Concluído. ${modified} arquivo(s) HTML atualizados.`);
  }
}

main();
