import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    products: 0,
    totalSales: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  // เตรียมข้อมูลสำหรับกราฟ
  const chartData = [
    { name: 'สมาชิก', value: stats.customers },
    { name: 'คำสั่งซื้อ', value: stats.orders },
    { name: 'สินค้า', value: stats.products },
    { name: 'ยอดขายรวม', value: stats.totalSales },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">สถิติ</h2>
      

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold">สมาชิก</h3>
          <p className="text-2xl">{stats.customers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold">คำสั่งซื้อ</h3>
          <p className="text-2xl">{stats.orders}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold">สินค้า</h3>
          <p className="text-2xl">{stats.products}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold">ยอดขายรวม</h3>
          <p className="text-2xl text-green-600">{(stats.totalSales || 0).toLocaleString()} ฿</p>
        </div>
      </div>

      {/* กราฟสรุปข้อมูล */}
      <div className="bg-white rounded-lg shadow p-4 mt-8">
        <h3 className="text-lg font-semibold mb-4">สรุปข้อมูลภาพรวม</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name) => name === 'ยอดขายรวม' ? `${value.toLocaleString()} ฿` : value.toLocaleString()} />
            <Legend />
            <Bar dataKey="value" fill="#4ade80" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
