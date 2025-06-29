import React, { useState } from 'react';
import { FaPlus, FaSearch, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';

const mockSummary = {
  income: 120000,
  expense: 45000,
  profit: 75000,
};

const mockTransactions = [
  { id: 1, date: '2025-06-28', type: 'income', amount: 20000, description: 'ขายสินค้า A' },
  { id: 2, date: '2025-06-27', type: 'expense', amount: 5000, description: 'ซื้อวัตถุดิบ' },
  { id: 3, date: '2025-06-26', type: 'income', amount: 30000, description: 'ขายสินค้า B' },
  { id: 4, date: '2025-06-25', type: 'expense', amount: 8000, description: 'ค่าเช่าโกดัง' },
  { id: 5, date: '2025-06-24', type: 'income', amount: 70000, description: 'ขายสินค้า C' },
];

function Finance() {
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState(mockTransactions);

  const filtered = transactions.filter(t =>
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.date.includes(search)
  );

  return (
    <div className="container mx-auto mt-8 pl-24 pr-4">
      <h2 className="text-2xl font-bold mb-6">ฐานการเงิน</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <FaMoneyBillWave className="text-green-500 text-3xl" />
          <div>
            <div className="text-gray-500">รายรับรวม</div>
            <div className="text-2xl font-bold text-green-700">฿{mockSummary.income.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <FaArrowDown className="text-red-500 text-3xl" />
          <div>
            <div className="text-gray-500">รายจ่ายรวม</div>
            <div className="text-2xl font-bold text-red-600">฿{mockSummary.expense.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <FaChartLine className="text-blue-500 text-3xl" />
          <div>
            <div className="text-gray-500">กำไรสุทธิ</div>
            <div className="text-2xl font-bold text-blue-700">฿{mockSummary.profit.toLocaleString()}</div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow">
          <FaPlus /> เพิ่มรายการ
        </button>
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาวันที่/รายละเอียด..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="py-2 px-4">วันที่</th>
              <th className="py-2 px-4">ประเภท</th>
              <th className="py-2 px-4">จำนวนเงิน</th>
              <th className="py-2 px-4">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6 text-gray-400">ไม่พบข้อมูล</td></tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id} className="border-b">
                  <td className="py-2 px-4 whitespace-nowrap">{t.date}</td>
                  <td className="py-2 px-4">
                    {t.type === 'income' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <FaArrowUp className="text-green-500" /> รายรับ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <FaArrowDown className="text-red-500" /> รายจ่าย
                      </span>
                    )}
                  </td>
                  <td className={`py-2 px-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>฿{t.amount.toLocaleString()}</td>
                  <td className="py-2 px-4">{t.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Finance;