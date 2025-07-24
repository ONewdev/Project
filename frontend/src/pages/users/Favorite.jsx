import React, { useEffect, useState } from 'react';

function Favorite() {
  const host = import.meta.env.VITE_HOST;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตัวอย่าง: ดึงสินค้าที่ถูกใจจาก API (แก้ endpoint ตาม backend จริง)
    fetch(`${host}/api/customers/favorites`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFavorites(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [host]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">สินค้าที่ถูกใจ</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-12">กำลังโหลด...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-400 py-12">ยังไม่มีสินค้าที่ถูกใจ</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={item.image_url ? `${host}${item.image_url}` : '/images/no-image.png'}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
                <div className="text-sm text-gray-500 mb-2">{item.category_name || '-'}</div>
                <div className="text-green-600 font-bold text-lg mb-2">
                  {item.price ? `฿${Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : '-'}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorite;