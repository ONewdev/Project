import React, { useState } from 'react';

export default function Serach({ onSearch, products = [] }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!query.trim()) {
      setError('กรุณากรอกคำค้นหา');
      return;
    }
    // ถ้ามี products ให้เช็คว่ามีสินค้าตรงกับคำค้นหาหรือไม่
    if (products.length > 0) {
      const found = products.some(p =>
        (p.name && p.name.toLowerCase().includes(query.trim().toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(query.trim().toLowerCase()))
      );
      if (!found) {
        setError('ไม่พบสินค้าที่ค้นหา');
        return;
      }
    }
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}>
        ค้นหาสินค้า
      </h2>
      <div className="flex items-center w-full bg-gray-50 rounded-full shadow-inner px-4 py-3 border border-gray-200">
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 font-medium"
          placeholder="ค้นหาสินค้า เช่น เสื้อ, รองเท้า, กระเป๋า..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}
        />
        <button
          type="submit"
          className="ml-3 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
          style={{ fontFamily: "'Prompt', sans-serif" }}
        >
          ค้นหา
        </button>
      </div>
      {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
    </form>
  );
}
