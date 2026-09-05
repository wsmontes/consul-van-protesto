import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('home exposes favicon and social sharing metadata for production domain', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /rel=["']icon["'][^>]+assets\/favicon\.svg/i);
  assert.match(html, /property=["']og:title["']/i);
  assert.match(html, /property=["']og:description["']/i);
  assert.match(html, /property=["']og:url["'][^>]+https:\/\/consulixobrasil\.com\//i);
  assert.match(html, /property=["']og:image["'][^>]+images\.weserv\.nl\/\?url=consulixobrasil\.com%2Fassets%2Fog-consulixo\.svg[^>]+output=jpg/i);
  assert.match(html, /name=["']twitter:card["'][^>]+summary_large_image/i);
  assert.match(html, /name=["']twitter:image["'][^>]+images\.weserv\.nl/i);
});
