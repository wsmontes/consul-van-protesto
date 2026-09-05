const PUBLIC_COLUMNS = [
  'protocol',
  'display_name',
  'service',
  'incident_date',
  'description',
  'wait_time',
  'resolved',
  'rating',
  'created_at',
].join(',');

export function toDatabaseComplaint(complaint = {}) {
  return {
    protocol: complaint.protocol,
    name: complaint.name || null,
    email: complaint.email || null,
    display_name: complaint.displayName || 'Anônimo',
    service: complaint.service,
    incident_date: complaint.date || null,
    description: complaint.description,
    wait_time: complaint.waitTime || null,
    resolved: complaint.resolved || null,
    rating: Number(complaint.rating) || null,
    consent: complaint.consent === true,
  };
}

export function fromDatabaseComplaint(row = {}) {
  return {
    protocol: row.protocol,
    displayName: row.display_name || 'Anônimo',
    service: row.service,
    date: row.incident_date || '',
    description: row.description || '',
    waitTime: row.wait_time || '',
    resolved: row.resolved || '',
    rating: Number(row.rating) || 0,
    createdAt: row.created_at,
  };
}

export function createComplaintApi({ url, key, fetchImpl = globalThis.fetch } = {}) {
  if (!url || !key || !fetchImpl) throw new Error('Supabase não configurado.');
  const endpoint = `${String(url).replace(/\/$/, '')}/rest/v1/complaints`;
  const baseHeaders = { apikey: key };

  return {
    async submit(complaint) {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(toDatabaseComplaint(complaint)),
      });
      if (!response.ok) throw new Error(`Falha ao registrar relato (${response.status}).`);
    },

    async listApproved() {
      const params = new URLSearchParams({
        select: PUBLIC_COLUMNS,
        status: 'eq.approved',
        order: 'created_at.desc',
      });
      const response = await fetchImpl(`${endpoint}?${params}`, { headers: baseHeaders });
      if (!response.ok) throw new Error(`Falha ao carregar relatos (${response.status}).`);
      const rows = await response.json();
      return Array.isArray(rows) ? rows.map(fromDatabaseComplaint) : [];
    },
  };
}
