import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

// Mock components - replace with your actual components
import Navbar from '../../components/Navbar';
import Slidebar from '../../components/Slidebar';
import Footer from '../../components/Footer';

function Contact() {
  const host = import.meta.env.VITE_HOST; 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${host}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับในเร็วๆ นี้');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } else {
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('มีบางอย่างผิดพลาด กรุณาลองใหม่ภายหลัง');
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Slidebar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-blue-100">เราพร้อมให้บริการและตอบคำถามของคุณ</p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ส่งข้อความถึงเรา</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">อีเมล *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">เบอร์โทร</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">หัวข้อ *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="หัวข้อที่ต้องการสอบถาม"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">ข้อความ *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="รายละเอียดที่ต้องการสอบถาม..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>ส่งข้อความ</span>
                </button>
              </div>
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">ข้อมูลติดต่อ</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800">ที่อยู่</h3>
                      <p className="text-gray-600">123 ถนนธุรกิจ แขวงลุมพินี<br />เขตปทุมวัน กรุงเทพมหานคร 10330</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800">โทรศัพท์</h3>
                      <p className="text-gray-600">+66 2 123 4567<br />+66 8 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800">อีเมล</h3>
                      <p className="text-gray-600">info@yourcompany.com<br />contact@yourcompany.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800">เวลาทำการ</h3>
                      <p className="text-gray-600">จันทร์ - ศุกร์: 9:00 - 18:00<br />เสาร์: 9:00 - 16:00<br />อาทิตย์: ปิด</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">แผนที่</h2>
                </div>
                <div className="h-80 bg-gray-200 relative">
                  {/* Embedded Google Map */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15502.766155364!2d100.52631367775878!3d13.744677989738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecf0c07f717%3A0x79ed12f8532b73e!2z4Lil4Li44Lih4Lie4Li04LiZ4Li14LmMIOC4geC4o-C4uOC5iOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4hOC4oyAxMDMzMA!5e0!3m2!1sth!2sth!4v1647234567890!5m2!1sth!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                  {/* Fallback content */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MapPin size={48} className="mx-auto mb-2" />
                      <p>แผนที่ Google Maps</p>
                      <p className="text-sm">123 ถนนธุรกิจ แขวงลุมพินี เขตปทุมวัน</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;