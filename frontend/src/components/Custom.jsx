import React, { useState } from 'react';
import { Upload, Calculator, ShoppingCart, Eye, Ruler, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomMirrorOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    width: '',
    height: '',
    thickness: '4',
    shape: 'rectangle',
    frameType: 'aluminum',
    frameColor: 'silver',
    frameWidth: '20',
    mirrorType: 'standard',
    edgeType: 'polished',
    mounting: 'wall',
    quantity: 1,
    specialRequests: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: ''
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const shapes = [
    { value: 'rectangle', label: 'สี่เหลี่ยม', icon: '▭' },
    { value: 'square', label: 'สี่เหลี่ยมจัตุรัส', icon: '□' },
    { value: 'circle', label: 'วงกลม', icon: '○' },
    { value: 'oval', label: 'รูปไข่', icon: '⬭' },
    { value: 'custom', label: 'รูปทรงพิเศษ', icon: '✦' }
  ];

  const frameTypes = [
    { value: 'aluminum', label: 'อลูมิเนียม', price: 150 },
    { value: 'wood', label: 'ไม้', price: 200 },
    { value: 'plastic', label: 'พลาสติก', price: 80 },
    { value: 'none', label: 'ไม่ต้องกรอบ', price: 0 }
  ];

  const frameColors = [
    { value: 'silver', label: 'เงิน', color: '#C0C0C0' },
    { value: 'black', label: 'ดำ', color: '#000000' },
    { value: 'white', label: 'ขาว', color: '#FFFFFF' },
    { value: 'gold', label: 'ทอง', color: '#FFD700' },
    { value: 'bronze', label: 'บรอนซ์', color: '#CD7F32' }
  ];

  const mirrorTypes = [
    { value: 'standard', label: 'กระจกธรรมดา', price: 100 },
    { value: 'antique', label: 'กระจกแอนทีค', price: 180 },
    { value: 'tinted', label: 'กระจกสี', price: 150 },
    { value: 'safety', label: 'กระจกนิรภัย', price: 250 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    calculatePrice({ ...formData, [field]: value });
  };

  const calculatePrice = (data) => {
    const area = (parseFloat(data.width) || 0) * (parseFloat(data.height) || 0) / 10000; // ตร.ม.
    const frameType = frameTypes.find(f => f.value === data.frameType);
    const mirrorType = mirrorTypes.find(m => m.value === data.mirrorType);
    
    let basePrice = area * 500; // ราคาพื้นฐาน ตร.ม. ละ 500 บาท
    basePrice += (frameType?.price || 0) * (parseFloat(data.frameWidth) || 0) / 10;
    basePrice += (mirrorType?.price || 0) * area;
    
    if (data.shape === 'custom') basePrice *= 1.5;
    if (data.edgeType === 'beveled') basePrice *= 1.2;
    
    setEstimatedPrice(Math.round(basePrice * data.quantity));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.width || !formData.height || !formData.address) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }
    alert('คำสั่งซื้อของคุณได้รับการบันทึกแล้ว! เราจะติดต่อกลับไปภายใน 24 ชั่วโมง');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Back Button */}
          <div className="flex items-center p-4 bg-gradient-to-r from-green-600 to-emerald-600">
            <button
              onClick={() => navigate(-1)}
              className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-4 py-2 font-semibold flex items-center mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              กลับ
            </button>
            <h1 className="text-3xl font-bold text-white">สั่งทำกระจกอลูมิเนียมออกแบบเอง</h1>
          </div>
          {/* Header */}
          {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">สั่งทำกระจกอลูมิเนียมออกแบบเอง</h1>
            <p className="text-blue-100">ออกแบบและสั่งทำกระจกตามความต้องการของคุณ</p>
          </div> */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* ขนาดกระจก */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Ruler className="mr-2 text-green-600" />
                    ขนาดกระจก
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ความกว้าง (ซม.)</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="เช่น 60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ความสูง (ซม.)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="เช่น 80"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">ความหนา (มม.)</label>
                    <select
                      value={formData.thickness}
                      onChange={(e) => handleInputChange('thickness', e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="3">3 มม.</option>
                      <option value="4">4 มม.</option>
                      <option value="5">5 มม.</option>
                      <option value="6">6 มม.</option>
                    </select>
                  </div>
                </div>

                {/* รูปทรง */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">รูปทรงกระจก</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {shapes.map((shape) => (
                      <button
                        key={shape.value}
                        type="button"
                        onClick={() => handleInputChange('shape', shape.value)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          formData.shape === shape.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-green-200 hover:border-green-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{shape.icon}</div>
                        <div className="text-sm font-medium">{shape.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ประเภทกระจก */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="mr-2 text-green-600" />
                    ประเภทกระจก
                  </h3>
                  <div className="space-y-3">
                    {mirrorTypes.map((type) => (
                      <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50">
                        <input
                          type="radio"
                          name="mirrorType"
                          value={type.value}
                          checked={formData.mirrorType === type.value}
                          onChange={(e) => handleInputChange('mirrorType', e.target.value)}
                          className="mr-3 text-green-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">+{type.price} บาท/ตร.ม.</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* อัพโหลดรูป */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Upload className="mr-2 text-green-600" />
                    อัพโหลดแบบออกแบบ
                  </h3>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      {uploadedImage ? (
                        <img src={uploadedImage} alt="Preview" className="max-w-full h-32 mx-auto rounded" />
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">คลิกเพื่อเลือกรูปภาพ</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* กรอบ */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">ประเภทกรอบ</h3>
                  <div className="space-y-3">
                    {frameTypes.map((frame) => (
                      <label key={frame.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50">
                        <input
                          type="radio"
                          name="frameType"
                          value={frame.value}
                          checked={formData.frameType === frame.value}
                          onChange={(e) => handleInputChange('frameType', e.target.value)}
                          className="mr-3 text-green-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{frame.label}</div>
                          <div className="text-sm text-gray-500">
                            {frame.price > 0 ? `+${frame.price} บาท/ซม.` : 'ฟรี'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.frameType !== 'none' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">ความกว้างกรอบ (มม.)</label>
                      <input
                        type="number"
                        value={formData.frameWidth}
                        onChange={(e) => handleInputChange('frameWidth', e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="20"
                      />
                    </div>
                  )}
                </div>

                {/* สีกรอบ */}
                {formData.frameType !== 'none' && (
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Palette className="mr-2 text-green-600" />
                      สีกรอบ
                    </h3>
                    <div className="grid grid-cols-5 gap-3">
                      {frameColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleInputChange('frameColor', color.value)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.frameColor === color.value
                              ? 'border-green-500 ring-2 ring-green-200'
                              : 'border-green-200 hover:border-green-300'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto mb-1 border"
                            style={{ backgroundColor: color.color }}
                          ></div>
                          <div className="text-xs font-medium">{color.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* รายละเอียดเพิ่มเติม */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">รายละเอียดเพิ่มเติม</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ขอบกระจก</label>
                      <select
                        value={formData.edgeType}
                        onChange={(e) => handleInputChange('edgeType', e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="polished">ขัดเรียบ</option>
                        <option value="beveled">เจียระไน (+20%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">วิธีการติดตั้ง</label>
                      <select
                        value={formData.mounting}
                        onChange={(e) => handleInputChange('mounting', e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="wall">ติดผนัง</option>
                        <option value="stand">ตั้งโต๊ะ</option>
                        <option value="hang">แขวน</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">จำนวน</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ข้อมูลลูกค้า */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">ข้อมูลลูกค้า</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="ชื่อ-นามสกุล"
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="เบอร์โทรศัพท์"
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="อีเมล"
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="ที่อยู่สำหรับจัดส่ง"
                      rows="3"
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* คำขอพิเศษ */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">คำขอพิเศษ</h3>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="รายละเอียดเพิ่มเติม เช่น การออกแบบพิเศษ หรือข้อกำหนดเฉพาะ"
                    rows="4"
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* สรุปราคา */}
            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Calculator className="mr-2 text-emerald-600" />
                  ราคาประเมิน
                </h3>
                <div className="text-3xl font-bold text-emerald-600">
                  ฿{estimatedPrice.toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                *ราคานี้เป็นเพียงการประเมินเบื้องต้น ราคาจริงอาจแตกต่างขึ้นอยู่กับรายละเอียดการผลิต
              </p>
              
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center"
              >
                <ShoppingCart className="mr-2" />
                ส่งคำสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}