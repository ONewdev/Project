import React, { useEffect, useState } from 'react';
import { fetchMaterialsReport } from '../../services/reportService';

export default function ReportMaterial() {
  const host = import.meta.env.VITE_HOST || '';
  const [from, setFrom] = useState(() => new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetchMaterialsReport({ from, to });
      setData(res);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Materials Report</h2>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-sm">From</label>
          <input type="date" className="border p-2" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">To</label>
          <input type="date" className="border p-2" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        <div className="ml-auto flex gap-2">
          <button
            className="bg-emerald-600 text-white px-4 py-2 rounded"
            onClick={() => {
              const qs = new URLSearchParams({ from, to }).toString();
              window.open(`${host}/api/reports/materials/csv?${qs}`, '_blank');
            }}
          >Export Excel (CSV)</button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => {
              const qs = new URLSearchParams({ from, to }).toString();
              window.open(`${host}/api/reports/materials/pdf?${qs}`, '_blank');
            }}
          >Export PDF</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {data && (
        <>
          <div className="mb-4 space-y-1">
            <div>Total Qty Issued: <span className="font-semibold">{Number(data.totalQty).toFixed(2)}</span></div>
            <div>Estimated Cost: <span className="font-semibold">{Number(data.totalCost).toFixed(2)}</span></div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-[600px] border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Code</th>
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-right">Qty Issued</th>
                  <th className="border px-3 py-2 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-1">{row.material_code}</td>
                    <td className="border px-3 py-1">{row.material_name}</td>
                    <td className="border px-3 py-1 text-right">{Number(row.qty_issued).toFixed(2)}</td>
                    <td className="border px-3 py-1 text-right">{Number(row.est_cost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
