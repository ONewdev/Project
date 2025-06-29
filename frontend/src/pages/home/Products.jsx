import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Slidebar from '../../components/Slidebar';
import Serach from '../../components/Serach';



function Products() {
  const host = import.meta.env.VITE_HOST;
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${host}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [host]);

  const filteredProducts = products.filter(product =>
    selectedCategory === "ทั้งหมด" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price) => new Intl.NumberFormat('th-TH').format(price);

  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.floor(rating || 0) ? "text-yellow-400" : "text-gray-300"}>★</span>
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Slidebar />
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 ">สินค้ายอดนิยม</h1>
        </div>
        <Serach setSelectedCategory={setSelectedCategory} setSortBy={setSortBy} />
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">เรียงตามชื่อ</option>
            <option value="price-low">ราคาต่ำ - สูง</option>
            <option value="price-high">ราคาสูง - ต่ำ</option>
            <option value="rating">คะแนนสูงสุด</option>
          </select>
        </div>
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-xl text-gray-600">กำลังโหลดสินค้า...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={product.image_url || '/images/no-image.png'}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = '/images/no-image.png'; }}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">สินค้าหมด</span>
                    </div>
                  )}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      ลด {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-blue-600 font-medium">{product.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating || 0} ({product.reviews || 0} รีวิว)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ฿{formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ฿{formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={!product.inStock}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                      product.inStock
                        ? "bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.inStock ? "เพิ่มลงตะกร้า" : "สินค้าหมด"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* No Products Message */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">ไม่พบสินค้าในหมวดหมู่นี้</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Products;