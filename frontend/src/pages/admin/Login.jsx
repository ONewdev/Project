import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const host = import.meta.env.VITE_HOST;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${host}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include', // ไม่ใช้ cookie อีกต่อไป
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log('LOGIN DEBUG', res.status, data);
      setVariant(res.ok ? 'success' : 'danger');
      setMessage(data.message);

      if (res.ok) {
          // เก็บ token และ user ลง localStorage
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          window.dispatchEvent(new Event('userChanged'));
          navigate('/admin/dashboard');
        });
      }
    } catch (err) {
      setVariant('danger');
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-green-700">Admin</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow"
          >
            Login
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 px-4 py-2 rounded-lg text-center text-sm font-medium ${
              variant === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}