import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch(`${host}/api/products/popular`);
        const data = await res.json();
        if (res.ok) setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, [host]);

  if (loading) return <div className="text-center py-8">กำลังโหลด...</div>;
  if (!products.length) return <div className="text-center py-8">ไม่มีสินค้ายอดนิยม</div>;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-green-700">สินค้ายอดนิยม ⭐</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col items-center">
              <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-lg mb-1 text-green-800">{product.name}</h3>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium text-gray-700">{product.avg_rating?.toFixed(1) || 0}</span>
                <span className="text-xs text-gray-500 ml-2">({product.rating_count} รีวิว)</span>
              </div>
              <p className="text-green-700 font-bold text-xl mb-2">฿{product.price}</p>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => navigate(`/product/${product.id}`)}
              >ดูรายละเอียด</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
