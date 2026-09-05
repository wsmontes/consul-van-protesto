import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('home contains every requested primary section and CTA', async () => {
  const html = await text('index.html');
  for (const id of ['como-funciona', 'classicos', 'indice', 'conte-sua-historia', 'comunidade', 'por-que']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /CONSULIXO DO BRASIL EM VANCOUVER/i);
  assert.match(html, /CONTE SUA HISTÓRIA/i);
});

test('home form includes requested complaint fields and consent', async () => {
  const html = await text('index.html');
  for (const name of ['name', 'email', 'service', 'date', 'description', 'waitTime', 'resolved', 'rating', 'consent']) {
    assert.match(html, new RegExp(`name=["']${name}["']`));
  }
});

test('home explains central moderated publication instead of local preview', async () => {
  const html = await text('index.html');
  assert.match(html, /base central/i);
  assert.match(html, /moderad/i);
  assert.doesNotMatch(html, /salvo apenas neste navegador/i);
});

test('all pages carry an explicit independent non-official disclaimer', async () => {
  for (const page of ['index.html', 'privacidade.html', 'termos.html', 'contato.html']) {
    const html = await text(page);
    assert.match(html, /site independente/i, page);
    assert.match(html, /não (é|somos) (um )?site oficial|não tem vínculo/i, page);
  }
});

test('stylesheet includes mobile behavior and reduced-motion support', async () => {
  const css = await text('styles.css');
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.match(css, /prefers-reduced-motion/i);
  assert.match(css, /:focus-visible/i);
});

test('app connects the complaint module to Supabase and approved public data', async () => {
  const js = await text('js/app.js');
  assert.match(js, /normalizeComplaint/);
  assert.match(js, /createComplaintApi/);
  assert.match(js, /listApproved/);
  assert.match(js, /submit\(complaint\)/);
  assert.doesNotMatch(js, /localStorage/);
});
