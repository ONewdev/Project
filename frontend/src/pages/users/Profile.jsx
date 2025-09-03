import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    profile_picture: '',
    phone: '',
    address: '',
    province_id: '',
    district_id: '',
    subdistrict_id: '',
    postal_code: ''
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const host = import.meta.env.VITE_HOST;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Helpers
  const userId = user?.user_id ?? user?.id;
  const getImageSrc = (p) => (p ? (String(p).startsWith('http') ? p : `${host}${p}`) : '');

  useEffect(() => {
    // Hydrate form from the most complete source: context user or localStorage
    const getHasId = (u) => !!(u && (u.id || u.user_id));
    let storedUser = null;
    try {
      const raw = localStorage.getItem('user');
      storedUser = raw ? JSON.parse(raw) : null;
    } catch {}

    const source = getHasId(user) ? user : storedUser;
    if (getHasId(source)) {
      setForm({
        name: source.name ?? '',
        email: source.email ?? '',
        profile_picture: source.profile_picture ?? '',
        phone: source.phone ?? '',
        address: source.address ?? '',
        province_id: source.province_id ?? '',
        district_id: source.district_id ?? '',
        subdistrict_id: source.subdistrict_id ?? '',
        postal_code: source.postal_code ?? ''
      });
      // If context is missing but localStorage has user, sync it back
      if (!getHasId(user) && getHasId(storedUser)) {
        setUser(storedUser);
      }
    }
  }, [user, setUser]);

  // โหลดจังหวัด
    useEffect(() => {
      fetch(`${host}/api/customers/provinces`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setProvinces(data);
          else setProvinces([]);
        })
        .catch(() => setProvinces([]));
    }, []);

  // โหลดอำเภอเมื่อ province_id เปลี่ยน
    useEffect(() => {
      if (form.province_id) {
        fetch(`${host}/api/customers/districts?province_id=${form.province_id}`).then(res => res.json()).then(setDistricts);
      } else {
        setDistricts([]);
        setForm(f => ({ ...f, district_id: '', subdistrict_id: '' }));
      }
    }, [form.province_id]);

  // โหลดตำบลเมื่อ district_id เปลี่ยน
    useEffect(() => {
      if (form.district_id) {
        fetch(`${host}/api/customers/subdistricts?district_id=${form.district_id}`).then(res => res.json()).then(setSubdistricts);
      } else {
        setSubdistricts([]);
        setForm(f => ({ ...f, subdistrict_id: '' }));
      }
    }, [form.district_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'postal_code') {
      const digits = value.replace(/\D/g, '').slice(0, 5);
      setForm((prev) => ({ ...prev, postal_code: digits }));
      return;
    }

    if (name === 'province_id') {
      setForm((prev) => ({ ...prev, province_id: value, district_id: '', subdistrict_id: '' }));
      return;
    }
    if (name === 'district_id') {
      setForm((prev) => ({ ...prev, district_id: value, subdistrict_id: '' }));
      return;
    }
    if (name === 'subdistrict_id') {
      setForm((prev) => ({ ...prev, subdistrict_id: value }));
      return;
    }

    if (name === 'profile_picture' && files?.length > 0) {
      const file = files[0];
      const allowed = ['image/jpeg', 'image/png', 'image/gif'];
      const maxMB = 5;
      if (!allowed.includes(file.type)) {
        Swal.fire({ icon: 'error', title: 'ชนิดไฟล์ไม่รองรับ', text: 'อัปโหลดได้เฉพาะ JPG, PNG, GIF' });
        return;
      }
      if (file.size > maxMB * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: `ขนาดไฟล์ต้องไม่เกิน ${maxMB}MB` });
        return;
      }
      setForm((prev) => ({ ...prev, profile_picture: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({ icon: 'error', title: 'ยังไม่พบผู้ใช้', text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const formData = new FormData();
      // ส่งเฉพาะฟิลด์ที่เปลี่ยนแปลงจริง
      if (form.name !== user.name) formData.append('name', form.name?.trim());
      if (form.email !== user.email) formData.append('email', form.email?.trim());
      if (form.phone !== user.phone) formData.append('phone', form.phone?.trim());
      if (form.address !== user.address) formData.append('address', form.address?.trim());
      const safeValue = v => v === '' ? null : v;
      if (form.province_id !== user.province_id) formData.append('province_id', safeValue(form.province_id));
      if (form.district_id !== user.district_id) formData.append('district_id', safeValue(form.district_id));
      if (form.subdistrict_id !== user.subdistrict_id) formData.append('subdistrict_id', safeValue(form.subdistrict_id));
      // Always send postal_code
      formData.append('postal_code', form.postal_code?.trim() ?? '');
      if (form.profile_picture && typeof File !== 'undefined' && form.profile_picture instanceof File) {
        formData.append('profile_picture', form.profile_picture);
      }

      const res = await fetch(`${host}/api/customers/${userId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMsg('อัปเดตโปรไฟล์สำเร็จ');

        if (data.user) {
          const updatedUser = { ...user, ...data.user };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('userChanged'));

          // อัปเดตฟอร์มด้วยข้อมูลล่าสุดจาก backend (ใช้ค่าตรง ๆ)
          setForm({
            name: data.user.name ?? '',
            email: data.user.email ?? '',
            profile_picture: data.user.profile_picture ?? '',
            phone: data.user.phone ?? '',
            address: data.user.address ?? '',
            province_id: data.user.province_id ?? '',
            district_id: data.user.district_id ?? '',
            subdistrict_id: data.user.subdistrict_id ?? '',
            postal_code: data.user.postal_code ?? ''
          });
        }

        Swal.fire({ icon: 'success', title: 'อัปเดตโปรไฟล์สำเร็จ', showConfirmButton: false, timer: 1500 });
      } else {
        const msg = data?.message || 'เกิดข้อผิดพลาด';
        setErrorMsg(msg);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: data?.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!userId) {
      Swal.fire({ icon: 'error', title: 'ยังไม่พบผู้ใช้', text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });
      return;
    }

    const result = await Swal.fire({
      title: 'ลบรูปโปรไฟล์?',
      text: 'คุณต้องการลบรูปโปรไฟล์นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบรูป',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${host}/api/customers/${userId}/profile-picture`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'ลบรูปโปรไฟล์สำเร็จ', timer: 1500, showConfirmButton: false });
          const updatedUser = { ...user, profile_picture: null };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setForm((prev) => ({ ...prev, profile_picture: '' }));
        } else {
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: data?.message || 'ไม่สามารถลบรูปโปรไฟล์ได้' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">โปรไฟล์ของฉัน</h2>

        {/* รูปโปรไฟล์ปัจจุบัน + ปุ่มลบ */}
        <div className="mb-12 text-center">
          {user?.profile_picture ? (
            <div className="relative inline-block group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200" />
              <div className="relative">
                <img
                  src={getImageSrc(user.profile_picture)}
                  alt="Current Profile"
                  className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-white cursor-pointer transform transition duration-200 hover:scale-105"
                  onClick={() => setIsImageModalOpen(true)}
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {user?.profile_picture && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">รูปโปรไฟล์ปัจจุบัน</span>
              <button
                type="button"
                onClick={handleDeleteProfilePicture}
                className="inline-flex items-center px-4 py-2 text-sm bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                ลบรูปโปรไฟล์
              </button>
            </div>
          )}
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">ชื่อ</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="peer w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg transition-all duration-200 placeholder-transparent focus:bg-white"
                required
                placeholder="ชื่อ"
              />
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-200 peer-focus:w-full" />
            </div>

            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">อีเมล</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="peer w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg transition-all duration-200 placeholder-transparent focus:bg-white"
                required
                placeholder="อีเมล"
              />
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-200 peer-focus:w-full" />
            </div>

            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="peer w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg transition-all duration-200 placeholder-transparent focus:bg-white"
                required
                placeholder="0xxxxxxxxx"
              />
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-200 peer-focus:w-full" />
            </div>

            <div className="group relative md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">ที่อยู่</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="peer w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg transition-all duration-200 placeholder-transparent focus:bg-white resize-none"
                placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง"
              />
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-200 peer-focus:w-full" />
            </div>

            {/* จังหวัด */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
              <select
                name="province_id"
                value={form.province_id}
                onChange={handleChange}
                className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg"
              >
                <option value="">เลือกจังหวัด</option>
                {Array.isArray(provinces) && provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name_th}</option>
                ))}
              </select>
            </div>

            {/* อำเภอ */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
              <select
                name="district_id"
                value={form.district_id}
                onChange={handleChange}
                className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg"
                disabled={!form.province_id}
              >
                <option value="">เลือกอำเภอ</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name_th}</option>
                ))}
              </select>
            </div>

            {/* ตำบล */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล</label>
              <select
                name="subdistrict_id"
                value={form.subdistrict_id}
                onChange={handleChange}
                className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg"
                disabled={!form.district_id}
              >
                <option value="">เลือกตำบล</option>
                {subdistricts.map(s => (
                  <option key={s.id} value={s.id}>{s.name_th}</option>
                ))}
              </select>
            </div>

            {/* รหัสไปรษณีย์ */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">รหัสไปรษณีย์</label>
              <input
                type="text"
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                maxLength={5}
                className="peer w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-green-500 focus:ring-0 py-2 px-3 rounded-t-lg transition-all duration-200 placeholder-transparent focus:bg-white"
                placeholder="xxxxx"
              />
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-200 peer-focus:w-full" />
            </div>
          </div>

          <div className="relative group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-200 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-green-600 transition-colors">รูปโปรไฟล์</label>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors file:duration-150 cursor-pointer"
            />
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
            </div>
          </div>

          {(successMsg || errorMsg) && (
            <div className={`p-4 rounded-lg ${successMsg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-center`}>
              <svg className={`w-5 h-5 mr-2 ${successMsg ? 'text-green-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                {successMsg ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <span className="font-medium">{successMsg || errorMsg}</span>
            </div>
          )}

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative flex items-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsImageModalOpen(false)} />
            <div className="relative z-10 max-w-lg w-[95%] transform transition-all duration-300 scale-100">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute right-4 top-4 z-10">
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(false)}
                    className="rounded-full p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
                    aria-label="ปิด"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">รูปโปรไฟล์</h3>
                  <div className="relative group">
                    <div className="overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={getImageSrc(user?.profile_picture ?? '')}
                        alt="Profile Preview"
                        className="max-h-[70vh] w-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
