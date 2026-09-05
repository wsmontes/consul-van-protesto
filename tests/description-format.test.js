import test from 'node:test';
import assert from 'node:assert/strict';
import * as complaints from '../js/complaints.js';

const requireFormatter = () => {
  assert.equal(typeof complaints.formatComplaintDescription, 'function');
  return complaints.formatComplaintDescription;
};

test('separates a Markdown Título line from the complaint body', () => {
  const format = requireFormatter();
  const result = format('**Título: Meu passaporte voltou**\n\nPrimeiro parágrafo.\n\nSegundo parágrafo.');

  assert.equal(result.title, 'Meu passaporte voltou');
  assert.deepEqual(result.paragraphs, ['Primeiro parágrafo.', 'Segundo parágrafo.']);
});

test('renders only **bold** markers as strong emphasis', () => {
  const format = requireFormatter();
  const result = format('Texto normal com **trecho importante** no meio.');

  assert.deepEqual(result.paragraphs, ['Texto normal com <strong>trecho importante</strong> no meio.']);
});

test('escapes user HTML before applying safe emphasis markup', () => {
  const format = requireFormatter();
  const result = format('<img src=x onerror=alert(1)> **seguro**');

  assert.equal(result.paragraphs[0].includes('<img'), false);
  assert.equal(result.paragraphs[0].includes('&lt;img'), true);
  assert.equal(result.paragraphs[0].includes('<strong>seguro</strong>'), true);
});
