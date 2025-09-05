const host = import.meta.env.VITE_HOST || '';

export async function listMaterials({ q = '', limit = 200 } = {}) {
  const qs = new URLSearchParams();
  if (q) qs.append('q', q);
  if (limit) qs.append('limit', String(limit));
  const res = await fetch(`${host}/api/materials?${qs.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load materials');
  return res.json();
}

