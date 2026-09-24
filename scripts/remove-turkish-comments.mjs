#!/usr/bin/env node
/**
 * Removes comments that contain Turkish text from source files.
 */

import fs from 'fs';
import path from 'path';
import ts from '../frontend/node_modules/typescript/lib/typescript.js';

const ROOT = path.resolve(import.meta.dirname, '..');

const TURKISH_CHARS = /[şğüöçıİŞĞÜÖÇ]/;

const TURKISH_WORDS = [
  'metinleri', 'metinlerinden', 'derlendi', 'mevcut sayfa', 'yarım kelime', 'kartlar gizli',
  'teknik pafta', 'plaka kilidi', 'plaka etiketi', 'sayfa zemini', 'modal perdesi', 'ana metin',
  'ikincil metin', 'takma ad', 'ekran okuyucu', 'hareket azaltma', 'dar ekran', 'geniş ekran',
  'dikey yedek', 'dokunmatik hedef', 'dokunma geri bildirimi', 'oran korunur', 'yanlar kesilmez',
  'yardımcılar', 'yardimcilar', 'yardimcilari', 'varsayılanlar', 'varsayilanlar', 'temel', 'zaman',
  'gecikme', 'saniye', 'cinsinden', 'sekme', 'plandayken', 'durur', 'olabilir', 'zaten', 'gerekmez',
  'etiketi', 'saati', 'yedek', 'izinleri', 'kopyalanabilir', 'tebligat', 'adresi', 'yeni talep',
  'tipografi', 'kameradan', 'yazılır', 'filtreleri', 'seriler', 'abonelikler', 'gezinmesi',
  'tercihleri', 'kamera karesi', 'elle mod', 'otomatik mod', 'bilgi paneli', 'kontrol kutusu',
  'seviyeleri', 'finansal', 'abonelik', 'bariyer', 'listeler', 'grupsuz', 'tesisler', 'tarife',
  'oturumlar', 'bildirim', 'ekran', 'otoparklar', 'otopark', 'harita', 'kayitli', 'kartlarim',
  'ekleme', 'hooklar', 'liste', 'kaynak:', 'ek:',
];

function isTurkishComment(text) {
  if (TURKISH_CHARS.test(text)) return true;
  const lower = text.toLowerCase();
  return TURKISH_WORDS.some((word) => lower.includes(word));
}

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const CSS_EXTENSIONS = new Set(['.css']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  'public/draco',
]);

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
      continue;
    }
    const ext = path.extname(entry.name);
    if (CODE_EXTENSIONS.has(ext) || CSS_EXTENSIONS.has(ext)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function collectScannerCommentRanges(source) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    source,
  );

  const ranges = [];
  let token = scanner.scan();

  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia
      || token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      const text = scanner.getTokenText();
      if (isTurkishComment(text)) {
        ranges.push({
          start: scanner.getTokenPos(),
          end: scanner.getTextPos(),
        });
      }
    }
    token = scanner.scan();
  }

  return ranges;
}

function collectFullLineCommentRanges(source) {
  const ranges = [];
  const lines = source.split('\n');
  let offset = 0;

  for (const line of lines) {
    const match = line.match(/^(\s*)\/\/(.*)$/);
    if (match && isTurkishComment(match[2])) {
      const start = offset + match[1].length;
      const end = offset + line.length;
      ranges.push({ start, end });
    }
    offset += line.length + 1;
  }

  return ranges;
}

function collectBlockCommentRanges(source) {
  const ranges = [];
  let i = 0;

  while (i < source.length) {
    if (source[i] === '/' && source[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < source.length) {
        if (source[i] === '*' && source[i + 1] === '/') {
          i += 2;
          break;
        }
        i++;
      }
      const text = source.slice(start, i);
      if (isTurkishComment(text)) {
        ranges.push({ start, end: i });
      }
      continue;
    }
    i++;
  }

  return ranges;
}

function collectJsxCommentRanges(source) {
  const ranges = [];
  const pattern = /\{\/\*[\s\S]*?\*\/\}/g;
  let match = pattern.exec(source);
  while (match) {
    if (isTurkishComment(match[0])) {
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
    match = pattern.exec(source);
  }
  return ranges;
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start || b.end - a.end);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const cur = sorted[i];
    if (cur.start <= prev.end) {
      prev.end = Math.max(prev.end, cur.end);
    } else {
      merged.push(cur);
    }
  }

  return merged;
}

function stripRanges(source, ranges) {
  if (ranges.length === 0) return source;

  let out = '';
  let cursor = 0;

  for (const { start, end } of ranges) {
    out += source.slice(cursor, start);
    cursor = end;
  }

  out += source.slice(cursor);
  return cleanupBlankLines(out);
}

function cleanupBlankLines(text) {
  const lines = text.split('\n');
  const cleaned = [];
  let prevBlank = false;

  for (const line of lines) {
    const trimmed = line.trimEnd();
    const isBlank = trimmed.trim() === '';
    if (isBlank && prevBlank) continue;
    cleaned.push(trimmed);
    prevBlank = isBlank;
  }

  while (cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') {
    cleaned.pop();
  }

  return cleaned.join('\n') + (text.endsWith('\n') ? '\n' : '');
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);

  const ranges = mergeRanges(
    CODE_EXTENSIONS.has(ext)
      ? [
          ...collectScannerCommentRanges(original),
          ...collectFullLineCommentRanges(original),
          ...collectBlockCommentRanges(original),
          ...collectJsxCommentRanges(original),
        ]
      : collectBlockCommentRanges(original),
  );

  const updated = stripRanges(original, ranges);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  if (processFile(file)) {
    changed++;
    console.log(path.relative(ROOT, file));
  }
}

console.log(`\nDone: ${changed} file(s) updated.`);
