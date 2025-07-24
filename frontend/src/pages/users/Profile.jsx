import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user } = useAuth();
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
        method: 'PATCH',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('อัปเดตโปรไฟล์สำเร็จ');
      } else {
        setErrorMsg(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700">โปรไฟล์ของฉัน</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">ชื่อ</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
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
            className="w-full"
          />
          {user?.profile_picture && typeof user.profile_picture === 'string' && (
            <img
              src={`${host}${user.profile_picture}`}
              alt="profile"
              className="w-24 h-24 rounded-full mt-3 object-cover border"
            />
          )}
        </div>
        {successMsg && <div className="text-green-600">{successMsg}</div>}
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </form>
    </div>
  );
}

export default Profile;