import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Slidebar from "../../components/Slidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductDetailModal from "./ProductDetail";
import { FaHeart, FaRegHeart, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import {
  likeProduct,
  unlikeProduct,
  addFavorite,
  removeFavorite,
} from "../../services/likeFavoriteService";

function Products() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  const host = import.meta.env.VITE_HOST;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comparison, setComparison] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const [favoritedProducts, setFavoritedProducts] = useState({});
  // โหลดสถานะ like/favorite ของแต่ละสินค้า


  const fetchStatuses = async () => {
    if (!user) return;
    const likes = {};
    const favs = {};
    for (const p of products) {
      try {
        const likeRes = await fetch(
          `${host}/api/interactions/like/status?customer_id=${user.id}&product_id=${p.id}`);
        const likeData = await likeRes.json();
        likes[p.id] = likeData.liked;

        const favRes = await fetch(
          `${host}/api/interactions/favorite/status?customer_id=${user.id}&product_id=${p.id}`
        );
        const favData = await favRes.json();
        favs[p.id] = favData.favorited;
      } catch (e) {
        likes[p.id] = false;
        favs[p.id] = false;
      }
    }
    setLikedProducts(likes);
    setFavoritedProducts(favs);
  };

  useEffect(() => {
    if (products.length > 0) fetchStatuses();
  }, [products, user, host]);

  const handleLike = async (productId) => {
    if (!user) return alert("กรุณาเข้าสู่ระบบ");
    if (likedProducts[productId]) {
      await unlikeProduct(user.id, productId);
    } else {
      await likeProduct(user.id, productId);
    }
    await fetchStatuses(); // รีเฟรชสถานะจาก backend จริง
  };

  const handleFavorite = async (productId) => {
    if (!user) return alert("กรุณาเข้าสู่ระบบ");
    if (favoritedProducts[productId]) {
      await removeFavorite(user.id, productId);
    } else {
      await addFavorite(user.id, productId);
    }
    await fetchStatuses(); // รีเฟรชสถานะจาก backend จริง
  };
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        // ตรวจสอบว่าเป็น array หรืออยู่ใน .data
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
          console.warn("หมวดหมู่ไม่ใช่ array:", data);
        }
      })
      .catch((err) => {
        console.error("หมวดหมู่ error:", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${host}/api/products`;

        if (selectedCategory) {
          url += `?category_id=${selectedCategory}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        let productList = [];

        if (Array.isArray(data)) {
          productList = data;
        } else if (Array.isArray(data.data)) {
          productList = data.data;
        } else {
          console.warn("สินค้าไม่ใช่ array:", data);
          productList = [];
        }

        // 🔥 เอา filter searchTerm ออกจากที่นี่ เพราะจะทำใน useEffect อื่น
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        console.error("โหลดสินค้า error:", err);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [host, selectedCategory]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category_name
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [products, searchTerm]);

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice)
      ? "-"
      : `฿${numPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
  };

  const handleCompareToggle = (product) => {
    setComparison((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      } else if (prev.length < 4) {
        return [...prev, product];
      } else {
        alert("เปรียบเทียบได้สูงสุด 4 รายการ");
        return prev;
      }
    });
  };

  const handleRemoveCompare = (id) => {
    setComparison((prev) => prev.filter((p) => p.id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}
    >
      <Navbar />
      <div className="w-full bg-gray/80 py-6 shadow text-left pl-10">
        <h1
          className="text-3xl md:text-4xl font-bold text-green-700 tracking-wide"
          style={{ fontFamily: "'Kanit', 'Prompt', sans-serif" }}
        >
          สินค้า
        </h1>
      </div>
      <Slidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 ">
            สินค้ายอดนิยม
          </h1>
        </div>
        {/* Search bar + ปุ่มสร้างสั่งทำสินค้า */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <select
              className="w-full sm:w-64 py-3 px-4 border-2 border-blue-400 rounded-2xl shadow-lg text-blue-700 font-semibold bg-white focus:ring-4 focus:ring-blue-300"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSearchTerm("");
              }}
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {user && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition mb-2 sm:mb-0"
              onClick={() => navigate("/custom-order")}
            >
              + สร้างสั่งทำสินค้า
            </button>
          )}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="ค้นหาสินค้า ชื่อ/หมวดหมู่/รายละเอียด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-400 bg-white rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-lg font-semibold text-blue-700 placeholder-blue-300 transition"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-2xl pointer-events-none">
              🔍
            </span>
          </div>
        </div>
        {/* Compare Bar */}
        {comparison.length >= 2 && (
          <div className="mb-6 flex items-center gap-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <span className="font-semibold text-yellow-800">
              เลือก {comparison.length} รายการสำหรับเปรียบเทียบ
            </span>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={() => setShowCompare(true)}
            >
              ดูเปรียบเทียบ
            </button>
            <button
              className="ml-auto text-sm text-gray-500 hover:text-red-500"
              onClick={() => setComparison([])}
            >
              ล้างรายการ
            </button>
          </div>
        )}
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-xl text-gray-600">
            กำลังโหลดสินค้า...
          </div>
        ) : products.length > 0 ? (
          filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={
                          `${host}${product.image_url}` ||
                          "/images/no-image.png"
                        }
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/watermark.png";
                        }}
                      />
                      {product.originalPrice > product.price && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                          ลด{" "}
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                            100
                          )}
                          %
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="text-sm text-green-600 font-medium">
                          {product.category_name || product.category || "-"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="w-full py-3 px-4 rounded-lg font-semibold transition duration-300 bg-green-600 text-white hover:bg-green-700 active:transform active:scale-95 mb-2">
                        เพิ่มลงตะกร้า
                      </button>
                      <div className="flex gap-2 justify-between mb-2">
                        <button
                          onClick={() => handleLike(product.id)}
                          className="text-blue-500 hover:text-blue-700 text-2xl transition"
                          title="ถูกใจ"
                        >
                          {likedProducts[product.id] ? <FaThumbsUp /> : <FaRegThumbsUp />}
                        </button>
                        <button
                          onClick={() => handleFavorite(product.id)}
                          className="text-pink-500 hover:text-pink-700 text-2xl transition"
                          title="รายการโปรด"
                        >
                          {favoritedProducts[product.id] ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                      <button
                        className={`w-full py-2 px-4 rounded-lg font-semibold border-2 transition duration-300 ${comparison.find((p) => p.id === product.id)
                          ? "border-yellow-500 bg-yellow-100 text-yellow-800"
                          : "border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50"
                          }`}
                        onClick={() => handleCompareToggle(product)}
                      >
                        {comparison.find((p) => p.id === product.id)
                          ? "นำออกจากเปรียบเทียบ"
                          : "เปรียบเทียบ"}
                      </button>
                      <button
                        className="text-green-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductId(product.id);
                        }}
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ก่อนหน้า
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-2 rounded-lg font-semibold ${currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                        }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ถัดไป
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                ไม่พบสินค้า{searchTerm && `สำหรับคำค้นหา "${searchTerm}"`}
                {selectedCategory && " ในหมวดหมู่นี้"}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">ไม่มีสินค้าในระบบ</p>
          </div>
        )}
        {/* Compare Modal */}
        {showCompare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-2xl max-w-5xl w-full p-8 relative border-2 border-yellow-200 animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold"
                onClick={() => setShowCompare(false)}
                aria-label="ปิด"
              >
                ×
              </button>
              <h2 className="text-3xl font-extrabold mb-8 text-yellow-700 text-center tracking-wide drop-shadow">
                เปรียบเทียบสินค้า
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gradient-to-r from-yellow-200 to-yellow-100">
                      <th className="p-4 font-bold text-lg text-gray-700 border-b-2 border-yellow-300 text-center">
                        สินค้า
                      </th>
                      {comparison.map((p) => (
                        <th
                          key={p.id}
                          className="p-4 font-bold text-gray-800 border-b-2 border-yellow-300 relative text-center"
                        >
                          <button
                            className="absolute top-2 right-2 text-xs text-red-500 hover:underline bg-white rounded-full px-2 py-1 shadow"
                            onClick={() => handleRemoveCompare(p.id)}
                          >
                            ลบ
                          </button>
                          <div className="flex flex-col items-center">
                            <img
                              src={
                                p.image_url
                                  ? `${host}${p.image_url}`
                                  : "/images/watermark.png"
                              }
                              alt={p.name}
                              className="h-24 w-24 object-cover rounded-xl border mb-2 shadow"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/watermark.png";
                              }}
                            />
                            <span className="font-bold text-base text-gray-800 text-center line-clamp-2 max-w-[120px]">
                              {p.name}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="p-4 font-semibold bg-yellow-50 border-b border-yellow-100 text-gray-700 text-center">
                        ราคา
                      </td>
                      {comparison.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 text-blue-600 font-bold border-b border-yellow-100 text-center text-xl"
                        >
                          {formatPrice(p.price)}
                          {p.originalPrice > p.price && (
                            <span className="ml-2 text-red-500 text-sm line-through">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 font-semibold bg-yellow-50 border-b border-yellow-100 text-gray-700 text-center">
                        หมวดหมู่
                      </td>
                      {comparison.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 text-green-700 border-b border-yellow-100 text-center"
                        >
                          {p.category_name || p.category || "-"}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 font-semibold bg-yellow-50 border-b border-yellow-100 text-gray-700 text-center">
                        รายละเอียด
                      </td>
                      {comparison.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 text-gray-700 border-b border-yellow-100 text-center max-w-xs"
                        >
                          <span
                            className="block line-clamp-3"
                            title={p.description}
                          >
                            {p.description || "-"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-8">
                <button
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition"
                  onClick={() => setShowCompare(false)}
                >
                  ปิดหน้าต่างเปรียบเทียบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* ปุ่มแชท */}
        <button
          onClick={() => setShowChatModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition duration-300"
          aria-label="ติดต่อแชท"
        >
          💬
        </button>

        {/* ปุ่มเลื่อนขึ้นบน */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition duration-300"
            aria-label="กลับขึ้นด้านบน"
          >
            ↑
          </button>
        )}
      </div>
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowChatModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              💬 ติดต่อแชท
            </h2>
            <p>นี่คือตัวอย่างกล่องแชท...</p>
            {/* คุณสามารถฝัง chat UI หรือ form ได้ตรงนี่ */}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Products;
