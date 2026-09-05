import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('testimonial stylesheet gives long-form complaints a centered readable layout', () => {
  const css = readFileSync(new URL('../complaints.css', import.meta.url), 'utf8');
  assert.match(css, /\.complaints-list\s*\{[^}]*max-width:\s*980px/s);
  assert.match(css, /\.complaint-card__content\s+p\s*\{[^}]*font-weight:\s*400/s);
  assert.match(css, /\.complaint-card__content\s+p\s*\+\s*p\s*\{[^}]*margin-top:/s);
  assert.match(css, /@media\s*\(max-width:\s*620px\)/);
});
