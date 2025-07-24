import React from 'react';
import { Star, Shield, Truck, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';



function Footer() {
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-gray-100 mb-4" style={{ fontFamily: "'Kanit', sans-serif" }}>🏠 AlumGlass</div>
            <p className="text-gray-400 mb-4" style={{ fontFamily: "'Prompt', sans-serif" }}>
              ผู้เชี่ยวชาญด้านอลูมิเนียมและกระจก มากกว่า 15 ปี
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">เมนูหลัก</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">หน้าแรก</a></li>
              <li><a href="#" className="hover:text-white">สินค้า</a></li>
              <li><a href="#" className="hover:text-white">บริการ</a></li>
            
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">หมวดสินค้า</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">ประตูอลูมิเนียม</a></li>
              <li><a href="#" className="hover:text-white">หน้าต่างกระจก</a></li>
              <li><a href="#" className="hover:text-white">มุ้งลวด</a></li>
              <li><a href="#" className="hover:text-white">รั้วอลูมิเนียม</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">ติดต่อเรา</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                123 ถ.รามคำแหง เขตสะพานสูง กรุงเทพฯ
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                02-xxx-xxxx
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                info@alumglass.com
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AlumGlass. สงวนลิขสิทธิ์ทุกประการ</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
