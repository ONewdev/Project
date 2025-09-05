import React, { useEffect, useMemo, useState } from 'react';
import { calculatePrice } from '../utils/pricing';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
const host = import.meta.env.VITE_HOST || '';


function toMeters(value, unit) {
  const n = parseFloat(String(value || ''));
  if (isNaN(n) || n <= 0) return 0;
  return unit === 'cm' ? n / 100 : n;
}

function Custom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: '',
    width: '',
    height: '',
    unit: 'cm',
    color: '',
    quantity: 1,
    details: '',
    hasScreen: false,
    roundFrame: false,
    swingType: 'บานเดี่ยว',
    mode: 'มาตรฐาน',
    fixedLeftM2: '',
    fixedRightM2: '',
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        else if (Array.isArray(data.categories)) setCategories(data.categories);
        else if (data && typeof data === 'object') {
          const arr = Object.values(data).find(v => Array.isArray(v));
          setCategories(arr || []);
        } else setCategories([]);
      })
      .catch(err => { console.error('API /api/categories error:', err); setCategories([]); });
  }, []);

  const productType =
    categories.find(c => String(c.category_id) === String(form.category))?.category_name || '';

  // parsed สำหรับ pricing.js
  const parsed = useMemo(() => {
    const widthM = toMeters(form.width, form.unit);
    const heightM = toMeters(form.height, form.unit);
    if (!widthM || !heightM) return null;
    const widthCm = widthM * 100;
    const heightCm = heightM * 100;
    const areaM2 = widthM * heightM;
    return { widthCm, heightCm, widthM, heightM, areaM2 };
  }, [form.width, form.height, form.unit]);

  const sizeString = useMemo(() => {
    if (!form.width || !form.height) return '';
    return `${form.width}x${form.height} ${form.unit}`;
  }, [form.width, form.height, form.unit]);

  const autoEstimated = useMemo(() => {
    if (!productType) return 0;
    const input = {
      type: productType,
      quantity: Number(form.quantity) || 1,
      color: form.color,
      size: sizeString,
      parsed,
      hasScreen: form.hasScreen,
      roundFrame: form.roundFrame,
      swingType: form.swingType,
      mode: form.mode,
      fixedLeftM2: parseFloat(form.fixedLeftM2 || '0') || 0,
      fixedRightM2: parseFloat(form.fixedRightM2 || '0') || 0,
    };
    return calculatePrice(input);
  }, [productType, form, parsed, sizeString]);

  useEffect(() => setEstimatedPrice(autoEstimated), [autoEstimated]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const clampQty = (q) => Math.max(1, Number.isFinite(q) ? Math.floor(q) : 1);
  const handleQty = (delta) => {
    setForm(prev => ({ ...prev, quantity: clampQty((Number(prev.quantity) || 1) + delta) }));
  };

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/custom/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productType, size: sizeString, parsed }),
      });
      if (res.ok) {
        const data = await res.json();
        setEstimatedPrice(data.estimatedPrice ?? autoEstimated);
      } else {
        setEstimatedPrice(autoEstimated);
      }
    } catch {
      setEstimatedPrice(autoEstimated);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนสั่งทำสินค้า',
        confirmButtonText: 'เข้าสู่ระบบ',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#dc2626'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        productType,
        size: sizeString,
        parsed,
        priceClient: estimatedPrice,
        user_id: user.id,
        fixedLeftM2: form.fixedLeftM2 === '' ? null : parseFloat(form.fixedLeftM2),
        fixedRightM2: form.fixedRightM2 === '' ? null : parseFloat(form.fixedRightM2)
      };
      const res = await fetch(`${host}/api/custom/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await res.json();
      setSuccess(true);
      setForm({
        category: '',
        width: '',
        height: '',
        unit: 'cm',
        color: '',
        quantity: 1,
        details: '',
        hasScreen: false,
        roundFrame: false,
        swingType: 'บานเดี่ยว',
        mode: 'มาตรฐาน',
        fixedLeftM2: '',
        fixedRightM2: '',
      });
      setEstimatedPrice(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // เงื่อนไขแสดง option ตามประเภท
  const showHasScreen = productType === 'หน้าต่างบานเลื่อน2' || productType === 'หน้าต่างบานเลื่อน4';
  const showRoundFrame = productType === 'ประตูมุ้ง';
  const showSwingType = productType === 'ประตูสวิง';
  const showHangingOptions = productType === 'ประตูรางแขวน';
  const showFixedAreas = showHangingOptions && form.mode === 'แบ่ง4';

  return (
    <div style={{ maxWidth: 560, margin: '32px auto', padding: 0 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)',
            color: '#fff', fontWeight: 700, fontSize: 16,
            border: 'none', borderRadius: 24, padding: '10px 24px',
            boxShadow: '0 2px 8px rgba(67,233,123,0.15)',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>←</span>
          กลับหน้าก่อนหน้า
        </button>
       
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px 24px',
        border: '1px solid #eee',
      }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>
          สั่งทำสินค้า
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* ประเภทสินค้า */}
          <div>
            <label style={{ fontWeight: 500 }}>ประเภทสินค้า</label>
            <select name="category" value={form.category} onChange={handleChange} required style={selectStyle}>
              <option value="">เลือกประเภท</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>

          {/* ขนาด */}
          <div>
            <label style={{ fontWeight: 500 }}>ขนาด</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 8, marginTop: 4 }}>
              <div>
                <label style={{ fontSize: 14, color: '#555' }}>ความกว้าง</label>
                <input name="width" value={form.width} onChange={handleChange} required inputMode="decimal" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 14, color: '#555' }}>ความสูง</label>
                <input name="height" value={form.height} onChange={handleChange} required inputMode="decimal" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 14, color: '#555' }}>หน่วย</label>
                <select name="unit" value={form.unit} onChange={handleChange} style={selectStyle}>
                  <option value="cm">เซนติเมตร</option>
                  <option value="m">เมตร</option>
                </select>
              </div>
            </div>
          </div>

          {/* สี */}
          <div>
            <label style={{ fontWeight: 500 }}>สี</label>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
              {['ขาว','ชา','เงิน','ดำ'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="radio"
                    name="color"
                    value={c}
                    checked={form.color === c}
                    onChange={handleChange}
                  />
                  {c}{c==='ดำ' && ' (+300)'}
                </label>
              ))}
            </div>
          </div>

          {/* จำนวน */}
          <div>
            <label style={{ fontWeight: 500 }}>จำนวน</label>
            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 56px', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <button type="button" onClick={() => handleQty(-1)} style={iconBtnStyle}>−</button>
              <input type="number" name="quantity" value={form.quantity}
                onChange={(e) => setForm(prev => ({ ...prev, quantity: clampQty(parseInt(e.target.value, 10)) }))}
                min={1} required style={{ ...inputStyle, textAlign: 'center' }} />
              <button type="button" onClick={() => handleQty(1)} style={iconBtnStyle}>+</button>
            </div>
          </div>

          {/* เงื่อนไขอื่น ๆ (ตามประเภท) */}
          {showHasScreen && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" name="hasScreen" checked={form.hasScreen} onChange={handleChange} />
              <label>เพิ่มมุ้งลวด (+500)</label>
            </div>
          )}

          {showRoundFrame && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" name="roundFrame" checked={form.roundFrame} onChange={handleChange} />
              <label>กรอบวงกลม (ติ๊ก = 1200/ชุด, ไม่ติ๊ก = 800/ชุด)</label>
            </div>
          )}

          {showSwingType && (
            <div>
              <label style={{ fontWeight: 500 }}>ประเภทประตูสวิง</label>
              <select name="swingType" value={form.swingType} onChange={handleChange} style={selectStyle}>
                <option value="บานเดี่ยว">บานเดี่ยว (≤1.2×2 = 7000)</option>
                <option value="บานคู่">บานคู่ (14000)</option>
              </select>
            </div>
          )}

          {/* รายละเอียด */}
          <div>
            <label style={{ fontWeight: 500 }}>รายละเอียดเพิ่มเติม</label>
            <textarea name="details" value={form.details} onChange={handleChange} style={{ ...inputStyle, minHeight: 60 }} placeholder="รายละเอียดอื่น ๆ" />
          </div>


          <div style={{ margin: '8px 0', textAlign: 'center' }}>
            {estimatedPrice > 0 ? (
              <span style={{ color: '#388e3c', fontWeight: 700, fontSize: 18 }}>
                ราคาประเมิน: {Number(estimatedPrice).toLocaleString()} บาท
              </span>
            ) : (
              <span style={{ color: '#e53935', fontWeight: 600, fontSize: 16 }}>
                ขนาดเล็กกว่าขั้นต่ำ ไม่สามารถคำนวณราคา กรุณาติดต่อร้าน
              </span>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ ...buttonStyle, background: '#1976d2', color: '#fff' }}>
            ส่งคำสั่งทำ
          </button>
          {success && <div style={{ color: '#1976d2', marginTop: 8, textAlign: 'center', fontWeight: 600 }}>ส่งคำสั่งทำสำเร็จ!</div>}
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 16,
  marginTop: 4,
  boxSizing: 'border-box',
};
const selectStyle = { ...inputStyle, background: '#fafafa' };
const buttonStyle = {
  padding: '12px 0',
  borderRadius: 8,
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  marginTop: 8,
  transition: 'background 0.2s',
};
const iconBtnStyle = {
  ...buttonStyle,
  padding: 0,
  height: 44,
  background: '#f5f5f5',
  color: '#333',
  border: '1px solid #ddd',
};

export default Custom;
