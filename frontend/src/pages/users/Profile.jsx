import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        profile_picture: user.profile_picture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files.length > 0) {
      setForm((prev) => ({ ...prev, profile_picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      
      if (form.profile_picture && form.profile_picture instanceof File) {
        formData.append('profile_picture', form.profile_picture);
      }

      const res = await fetch(`${host}/api/customers/${user.user_id || user.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg('อัปเดตโปรไฟล์สำเร็จ');
        
        // อัปเดต user state และ localStorage
        if (data.user) {
          const updatedUser = { ...user, ...data.user };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('userChanged'));
        }
        
        // รีเซ็ตฟอร์ม
        setForm({
          name: data.user?.name || form.name,
          email: data.user?.email || form.email,
          profile_picture: data.user?.profile_picture || form.profile_picture
        });
        
        Swal.fire({
          icon: 'success',
          title: 'อัปเดตโปรไฟล์สำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        setErrorMsg(data.message || 'เกิดข้อผิดพลาด');
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้'
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบบัญชี
  const handleDeleteProfile = async () => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'การลบบัญชีจะลบข้อมูลของคุณทั้งหมดและไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${host}/api/customers/${user.user_id || user.id}/delete`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'ลบบัญชีสำเร็จ',
            text: 'บัญชีของคุณถูกลบเรียบร้อย',
            timer: 2000,
            showConfirmButton: false
          });
          // ลบข้อมูล user ใน localStorage และ redirect
          localStorage.removeItem('user');
          setUser(null);
          window.location.href = '/';
        } else {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: data.message || 'ไม่สามารถลบบัญชีได้'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
        });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700">โปรไฟล์ของฉัน</h2>
      {/* แสดงรูปโปรไฟล์ปัจจุบัน */}
      {user?.profile_picture && (
        <div className="mb-6 text-center">
          <img
            src={`http://localhost:3001${user.profile_picture}`}
            alt="Current Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-200"
          />
          <p className="text-sm text-gray-600 mt-2">รูปโปรไฟล์ปัจจุบัน</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">ชื่อ</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">อีเมล</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">รูปโปรไฟล์</label>
          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
          </p>
        </div>
        {successMsg && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </form>
      {/* ปุ่มลบบัญชี */}
      <button
        type="button"
        onClick={handleDeleteProfile}
        className="w-full mt-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 shadow"
      >
        ลบบัญชี
      </button>
    </div>
  );
}

export default Profile;