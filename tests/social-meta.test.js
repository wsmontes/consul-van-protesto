import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('home exposes favicon and social sharing metadata for production domain', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /rel=["']icon["'][^>]+assets\/favicon\.svg/i);
  assert.match(html, /property=["']og:title["']/i);
  assert.match(html, /property=["']og:description["']/i);
  assert.match(html, /property=["']og:url["'][^>]+https:\/\/consulixobrasil\.com\//i);
  assert.match(html, /property=["']og:image["'][^>]+https:\/\/acjgeiavokkgodhhamak\.supabase\.co\/functions\/v1\/site-assets\/og\.png/i);
  assert.match(html, /property=["']og:image:type["'][^>]+image\/png/i);
  assert.match(html, /property=["']og:image:width["'][^>]+1200/i);
  assert.match(html, /property=["']og:image:height["'][^>]+630/i);
  assert.match(html, /name=["']twitter:card["'][^>]+summary_large_image/i);
  assert.match(html, /name=["']twitter:image["'][^>]+\/site-assets\/og\.png/i);
  assert.doesNotMatch(html, /images\.weserv\.nl|og-consulixo\.svg/i);
});
