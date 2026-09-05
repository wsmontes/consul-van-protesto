import test from 'node:test';
import assert from 'node:assert/strict';
import { createComplaintApi, toDatabaseComplaint, fromDatabaseComplaint } from '../js/supabase.js';

test('toDatabaseComplaint maps browser complaint fields to database columns', () => {
  assert.deepEqual(toDatabaseComplaint({
    protocol: 'CLX-1', name: 'Maria', email: 'maria@example.com', displayName: 'Maria',
    service: 'passaporte', date: '2026-09-01', description: 'Teste', waitTime: '2-semanas',
    resolved: 'nao', rating: 2, consent: true,
  }), {
    protocol: 'CLX-1', name: 'Maria', email: 'maria@example.com', display_name: 'Maria',
    service: 'passaporte', incident_date: '2026-09-01', description: 'Teste', wait_time: '2-semanas',
    resolved: 'nao', rating: 2, consent: true,
  });
});

test('fromDatabaseComplaint maps public database rows to display model', () => {
  assert.deepEqual(fromDatabaseComplaint({
    protocol: 'CLX-2', display_name: 'Anônimo', service: 'visto', incident_date: null,
    description: 'Relato', wait_time: null, resolved: 'aguardando', rating: 1, created_at: '2026-09-05T00:00:00Z',
  }), {
    protocol: 'CLX-2', displayName: 'Anônimo', service: 'visto', date: '', description: 'Relato',
    waitTime: '', resolved: 'aguardando', rating: 1, createdAt: '2026-09-05T00:00:00Z',
  });
});

test('complaint API submits without requesting private row representation', async () => {
  const calls = [];
  const api = createComplaintApi({ url: 'https://example.supabase.co', key: 'sb_publishable_test', fetchImpl: async (...args) => {
    calls.push(args); return new Response(null, { status: 201 });
  }});
  await api.submit({ protocol: 'CLX-3', service: 'passaporte', description: 'Teste', displayName: 'Anônimo', rating: 0, consent: false });
  assert.equal(calls[0][0], 'https://example.supabase.co/rest/v1/complaints');
  assert.equal(calls[0][1].headers.Prefer, 'return=minimal');
  assert.equal(calls[0][1].headers.apikey, 'sb_publishable_test');
});

test('complaint API requests only approved public columns', async () => {
  const calls = [];
  const api = createComplaintApi({ url: 'https://example.supabase.co', key: 'sb_publishable_test', fetchImpl: async (...args) => {
    calls.push(args); return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
  }});
  await api.listApproved();
  assert.match(calls[0][0], /status=eq\.approved/);
  assert.doesNotMatch(calls[0][0], /email|name,/);
});
