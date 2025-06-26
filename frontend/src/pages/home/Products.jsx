import React, { useState } from 'react';

import Navbar from '../../components/Navbar';  // Adjust the import path as necessary
import Footer from '../../components/Footer';  // Adjust the import path as necessary
import Slidebar from '../../components/Slidebar';


const sampleProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 35900,
    originalPrice: 39900,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    category: "สมาร์ทโฟน",
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: 65900,
    originalPrice: 69900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=400&fit=crop",
    category: "โน้ตบุ๊ค",
    rating: 4.9,
    reviews: 87,
    inStock: true
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 8900,
    originalPrice: 9900,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
    category: "หูฟัง",
    rating: 4.7,
    reviews: 203,
    inStock: true
  },
  {
    id: 4,
    name: "iPad Air",
    price: 19900,
    originalPrice: 22900,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "แท็บเล็ต",
    rating: 4.6,
    reviews: 156,
    inStock: false
  },
  {
    id: 5,
    name: "Apple Watch Series 9",
    price: 12900,
    originalPrice: 14900,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "สมาร์ทวอทช์",
    rating: 4.8,
    reviews: 89,
    inStock: true
  },
  {
    id: 6,
    name: "Canon EOS R5",
    price: 89900,
    originalPrice: 95900,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    category: "กล้อง",
    rating: 4.9,
    reviews: 45,
    inStock: true
  }
];

const categories = ["ทั้งหมด", "สมาร์ทโฟน", "โน้ตบุ๊ค", "หูฟัง", "แท็บเล็ต", "สมาร์ทวอทช์", "กล้อง"];

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = sampleProducts.filter(product => 
    selectedCategory === "ทั้งหมด" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
         <Slidebar />
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 ">สินค้ายอดนิยม</h1>
        </div>
     
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
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
                    {product.rating} ({product.reviews} รีวิว)
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

        {/* No Products Message */}
        {sortedProducts.length === 0 && (
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