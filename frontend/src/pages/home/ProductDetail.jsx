import React, { useEffect, useState } from 'react';

export default function ProductDetailModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    if (!productId) return;

    fetch(`${host}/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {loading ? (
          <p className="text-center text-lg">กำลังโหลด...</p>
        ) : !product ? (
          <p className="text-center text-red-500">ไม่พบสินค้า</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-700 mb-4">{product.name}</h1>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={`${host}${product.image_url}` || '/images/no-image.png'}
                alt={product.name}
                className="w-full md:w-64 h-64 object-cover rounded-lg shadow border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/no-image.png';
                }}
              />
              <div>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-green-600 text-xl font-bold mb-2">{parseFloat(product.price).toLocaleString()} บาท</p>
                <p className="text-sm text-gray-500">หมวดหมู่: {product.category_name || '-'}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={onClose}
              >
                ปิด
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
