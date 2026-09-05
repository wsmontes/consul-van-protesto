const STORAGE_KEY = 'consulixo:complaints:v1';

export function validateComplaint(input = {}) {
  const errors = [];
  if (!String(input.service ?? '').trim()) errors.push('service');
  if (!String(input.description ?? '').trim()) errors.push('description');
  const email = String(input.email ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  return { valid: errors.length === 0, errors };
}

export function normalizeComplaint(input = {}, protocol) {
  const consent = input.consent === true || input.consent === 'true' || input.consent === 'on';
  const name = String(input.name ?? '').trim();
  const firstName = name ? name.split(/\s+/)[0] : 'Anônimo';

  return {
    protocol,
    name,
    displayName: consent && firstName ? firstName : 'Anônimo',
    email: String(input.email ?? '').trim(),
    service: String(input.service ?? '').trim(),
    date: String(input.date ?? '').trim(),
    description: String(input.description ?? '').trim(),
    waitTime: String(input.waitTime ?? '').trim(),
    resolved: String(input.resolved ?? '').trim(),
    rating: Number(input.rating || 0),
    consent,
    createdAt: new Date().toISOString(),
    source: 'local-preview',
  };
}

export function filterComplaints(items = [], service = 'todos') {
  if (!service || service === 'todos') return [...items];
  return items.filter((item) => item.service === service);
}

export function loadComplaints(storage = globalThis.localStorage) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveComplaint(complaint, storage = globalThis.localStorage) {
  if (!storage) return complaint;
  const items = loadComplaints(storage);
  storage.setItem(STORAGE_KEY, JSON.stringify([complaint, ...items]));
  return complaint;
}

export function createProtocol(now = new Date()) {
  const stamp = now.toISOString().slice(0, 10).replaceAll('-', '');
  const serial = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CLX-${stamp}-${serial}`;
}
