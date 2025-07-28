import { useEffect, useState } from 'react';
import axios from 'axios';

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-4">คุณเข้าสู่ระบบเรียบร้อยแล้ว</p>

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
    </div>
  );
}
