import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { sendMessage } from '../../services/chatService';

// Mock components - replace with your actual components
import Navbar from '../../components/Navbar';
import Slidebar from '../../components/Slidebar';
import Footer from '../../components/Footer';

function Contact() {
  // โหลด Google Fonts (Kanit + Prompt)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  const host = import.meta.env.VITE_HOST;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState(null);
  

  useEffect(() => {
    fetch(`${host}/api/contact`)
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data);
      })
      .catch((err) => {
        console.error('Failed to fetch contact info:', err);
      });
  }, [host]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = localStorage.getItem('user');
      const sender_id = user ? JSON.parse(user).id : 0; // 0 หรือ null สำหรับ guest
      const receiver_id = 1; // สมมุติ admin id = 1
      // รวมข้อมูลลูกค้าในข้อความ
      const message = `ติดต่อจากฟอร์ม\nชื่อ: ${formData.name}\nอีเมล: ${formData.email}\nเบอร์โทร: ${formData.phone}\nหัวข้อ: ${formData.subject}\nข้อความ: ${formData.message}`;
      await sendMessage({ sender_id, receiver_id, message });
      alert('ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับในเร็วๆ นี้');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert('มีบางอย่างผิดพลาด กรุณาลองใหม่ภายหลัง');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}>
      <Navbar />
       <div className="w-full bg-gray/80 py-6 shadow text-left pl-10">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 tracking-wide" style={{ fontFamily: "'Kanit', 'Prompt', sans-serif" }}>ติดต่อเรา</h1>
      </div>
      <Slidebar />
      {/* Contact Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <form className="bg-white rounded-lg shadow-lg p-8" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-green-800 mb-6">ส่งข้อความถึงเรา</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-medium mb-2">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="block text-green-700 font-medium mb-2">อีเมล *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-medium mb-2">เบอร์โทร</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-green-700 font-medium mb-2">หัวข้อ *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="หัวข้อที่ต้องการสอบถาม"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-green-700 font-medium mb-2">ข้อความ *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="รายละเอียดที่ต้องการสอบถาม..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>ส่งข้อความ</span>
                </button>
              </div>
            </form>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">ข้อมูลติดต่อ</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-green-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-green-800">ที่อยู่</h3>
                      <p className="text-green-700">{contactInfo?.address || '123 ถนนธุรกิจ แขวงลุมพินี\nเขตปทุมวัน กรุงเทพมหานคร 10330'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="text-green-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-green-800">โทรศัพท์</h3>
                      <p className="text-green-700">{contactInfo?.phone || '+66 2 123 4567\n+66 8 1234 5678'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="text-green-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-green-800">อีเมล</h3>
                      <p className="text-green-700">{contactInfo?.email || 'info@yourcompany.com\ncontact@yourcompany.com'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="text-green-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-green-800">เวลาทำการ</h3>
                      <p className="text-green-700">{contactInfo?.open_hours || 'จันทร์ - ศุกร์: 9:00 - 18:00\nเสาร์: 9:00 - 16:00\nอาทิตย์: ปิด'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-green-800">แผนที่</h2>
                </div>
                <div className="h-80 bg-green-100 relative">
                  {/* Embedded Google Map */}
                  <iframe
                    src={contactInfo?.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15502.766155364!2d100.52631367775878!3d13.744677989738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecf0c07f717%3A0x79ed12f8532b73e!2z4Lil4Li44Lih4Lie4Li04LiZ4Li14LmMIOC4geC4o-C4uOC5iOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4hOC4oyAxMDMzMA!5e0!3m2!1sth!2sth!4v1647234567890!5m2!1sth!2sth"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                  {/* Fallback content */}
                  <div className="absolute inset-0 flex items-center justify-center text-green-500">
                    <div className="text-center">
                      <MapPin size={48} className="mx-auto mb-2" />
                      <p>แผนที่ Google Maps</p>
                      <p className="text-sm">{contactInfo?.address || '123 ถนนธุรกิจ แขวงลุมพินี เขตปทุมวัน'}</p>
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