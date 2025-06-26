import React, { useState ,useEffect } from 'react';
import { Star, Shield, Truck, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Link } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';  // Adjust the import path as necessary
import Footer from '../../components/Footer';  // Adjust the import path as necessary
import Slidebar from '../../components/Slidebar';  // Adjust the import path as necessary

// Temporary Navbar component for demo (replace with your import)


export default function Home() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const host = import.meta.env.VITE_HOST;  // Assuming you have a .env file with VITE_HOST defined

useEffect(() => {
  fetch(`${host}/api/products`)  // หรือ URL จริงของคุณ
    .then((res) => {
      if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      setProducts(data);  // สมมุติว่า API ส่ง array มาเลย
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });
}, []);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}>
      {/* Use Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Kanit', sans-serif" }}>
              ยินดีต้อนรับสู่ร้านอลูมิเนียม-กระจก
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Prompt', sans-serif", fontWeight: '400' }}>
              เราเชี่ยวชาญด้านงานสั่งทำประตู หน้าต่าง อลูมิเนียม กระจก และเฟอร์นิเจอร์ 
              คุณภาพสูง ราคาเป็นธรรม
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300" style={{ fontFamily: "'Prompt', sans-serif", fontWeight: '500' }}>
                ดูสินค้าทั้งหมด
              </button>
              <button onClick={() => navigate('/contact')} className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" style={{ fontFamily: "'Prompt', sans-serif", fontWeight: '500' }}>
                ติดต่อปรึกษา
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Slidebar/>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Kanit', sans-serif" }}>สินค้าแนะนำ</h2>
            <p className="text-gray-600" style={{ fontFamily: "'Prompt', sans-serif" }}>สินค้าคุณภาพสูงที่ได้รับความนิยมจากลูกค้า</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <img 
                  src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${host}${product.image_url}`) : '/images/no-image.png'}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-gray-100"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/no-image.png'; }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Prompt', sans-serif", fontWeight: '600' }}>{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Kanit', sans-serif" }}>฿{product.price}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" style={{ fontFamily: "'Prompt', sans-serif", fontWeight: '500' }}>
                      สั่งซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <button onClick={() => navigate('/products')} className="px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition duration-300">
              ดูสินค้าทั้งหมด
            </button>
           
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Kanit', sans-serif" }}>พร้อมเริ่มโปรเจคของคุณแล้วหรือยัง?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Prompt', sans-serif" }}>
            ปรึกษาฟรี ประเมินราคาฟรี พร้อมให้คำแนะนำจากทีมผู้เชี่ยวชาญ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
              <Phone className="inline w-5 h-5 mr-2" />
              โทรปรึกษา 02-xxx-xxxx
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
              <Mail className="inline w-5 h-5 mr-2" />
              ส่งข้อความหาเรา
            </button>
          </div>
        </div>
      </section>

      <Footer/>
      
    </div>
  );
}