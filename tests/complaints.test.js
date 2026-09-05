import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateComplaint,
  normalizeComplaint,
  filterComplaints,
  saveComplaint,
  loadComplaints,
} from '../js/complaints.js';

test('validateComplaint rejects submissions without service or description', () => {
  const result = validateComplaint({ service: '', description: '   ' });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors.sort(), ['description', 'service']);
});

test('validateComplaint accepts optional name and email when core fields are present', () => {
  const result = validateComplaint({
    service: 'passaporte',
    description: 'Esperei semanas por uma resposta objetiva.',
    waitTime: '3-semanas',
    resolved: 'nao',
    rating: '2',
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('normalizeComplaint removes personal display data without publication consent', () => {
  const normalized = normalizeComplaint({
    name: 'Maria da Silva',
    email: 'maria@example.com',
    service: 'passaporte',
    date: '2026-09-01',
    description: '  Favor aguardar.  ',
    waitTime: '3-semanas',
    resolved: 'nao',
    rating: '2',
    consent: false,
  }, 'PROTO-001');

  assert.equal(normalized.displayName, 'Anônimo');
  assert.equal(normalized.email, 'maria@example.com');
  assert.equal(normalized.description, 'Favor aguardar.');
  assert.equal(normalized.protocol, 'PROTO-001');
});

test('normalizeComplaint may display first name when consent is explicit', () => {
  const normalized = normalizeComplaint({
    name: 'João Pereira',
    email: '',
    service: 'registro-civil',
    description: 'Resposta vaga.',
    rating: '4',
    consent: true,
  }, 'PROTO-002');

  assert.equal(normalized.displayName, 'João');
});

test('filterComplaints filters by service and keeps all for "todos"', () => {
  const items = [
    { service: 'passaporte', protocol: '1' },
    { service: 'registro-civil', protocol: '2' },
  ];
  assert.equal(filterComplaints(items, 'todos').length, 2);
  assert.deepEqual(filterComplaints(items, 'passaporte'), [items[0]]);
});

test('saveComplaint and loadComplaints use the provided storage adapter', () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };

  saveComplaint({ protocol: 'PROTO-003', service: 'passaporte' }, storage);
  saveComplaint({ protocol: 'PROTO-004', service: 'visto' }, storage);

  assert.deepEqual(loadComplaints(storage).map((item) => item.protocol), ['PROTO-004', 'PROTO-003']);
});
