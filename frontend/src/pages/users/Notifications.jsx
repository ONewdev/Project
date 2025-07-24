import React, { useEffect, useState } from 'react';

function Notifications() {
  const host = import.meta.env.VITE_HOST;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตัวอย่าง: ดึงการแจ้งเตือนจาก backend (แก้ endpoint ตามจริง)
    fetch(`${host}/api/customers/notifications`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [host]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">การแจ้งเตือน</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-8">กำลังโหลด...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-8">ยังไม่มีการแจ้งเตือน</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li key={n.id} className={`rounded-lg p-4 shadow flex items-center gap-3 ${
              n.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
              n.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
              n.type === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
              'bg-gray-50 border-l-4 border-gray-300'
            }`}>
              <span className="font-bold text-lg">
                {n.type === 'success' && '✔️'}
                {n.type === 'warning' && '⚠️'}
                {n.type === 'error' && '❌'}
                {(!n.type || n.type === 'info') && 'ℹ️'}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{n.title || 'แจ้งเตือน'}</div>
                <div className="text-gray-600 text-sm">{n.message}</div>
                {n.created_at && (
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString('th-TH')}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
