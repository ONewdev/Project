const host = import.meta.env.VITE_HOST || '';

function toQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, v);
  });
  return usp.toString();
}

export async function fetchSalesReport({ from, to, group = 'day' } = {}) {
  const qs = toQuery({ from, to, group });
  const res = await fetch(`${host}/api/reports/sales?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch sales report');
  return res.json();
}

export async function fetchMaterialsReport({ from, to } = {}) {
  const qs = toQuery({ from, to });
  const res = await fetch(`${host}/api/reports/materials?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch materials report');
  return res.json();
}

export async function fetchOrdersReport({ from, to, group = 'day' } = {}) {
  const qs = toQuery({ from, to, group });
  const res = await fetch(`${host}/api/reports/orders?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch orders report');
  return res.json();
}

export async function fetchProfitReport({ from, to, group = 'day' } = {}) {
  const qs = toQuery({ from, to, group });
  const res = await fetch(`${host}/api/reports/profit?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch profit report');
  return res.json();
}

