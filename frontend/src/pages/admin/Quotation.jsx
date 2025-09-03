
import { useState } from "react";

export default function QuotationPage() {
  const [customer, setCustomer] = useState({
    name: "คุณสมชาย ใจดี",
    company: "บริษัท สมชายการช่าง จำกัด",
    address: "77/88 บางพลี สมุทรปราการ",
    phone: "081-234-5678",
    email: "somchai@contractor.com",
  });

  const [items, setItems] = useState([
    { id: 1, name: "อลูมิเนียมโปรไฟล์ 1x2 ม.", qty: 10, unit: "เส้น", price: 500 },
    { id: 2, name: "ค่าติดตั้ง", qty: 1, unit: "งาน", price: 2000 },
  ]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, unit: "", price: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 border border-blue-100">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-100 rounded-full p-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="#1976d2" strokeWidth="2" d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><rect width="16" height="12" x="4" y="7" rx="2" stroke="#1976d2" strokeWidth="2"/><path stroke="#1976d2" strokeWidth="2" d="M9 11h6"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">ใบเสนอราคา</h1>
        </div>

        {/* Customer Info Editable */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลลูกค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              placeholder="ชื่อลูกค้า"
            />
            <input
              className="border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={customer.company}
              onChange={e => setCustomer({ ...customer, company: e.target.value })}
              placeholder="บริษัท/องค์กร"
            />
            <input
              className="border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 col-span-2"
              value={customer.address}
              onChange={e => setCustomer({ ...customer, address: e.target.value })}
              placeholder="ที่อยู่"
            />
            <input
              className="border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={customer.phone}
              onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              placeholder="เบอร์โทร"
            />
            <input
              className="border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={customer.email}
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
              placeholder="อีเมล"
            />
          </div>
        </div>

        {/* Items Editable */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">รายการสินค้า/บริการ</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm shadow-sm rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="border-b px-3 py-2 font-medium">รายการ</th>
                  <th className="border-b px-3 py-2 font-medium">จำนวน</th>
                  <th className="border-b px-3 py-2 font-medium">หน่วย</th>
                  <th className="border-b px-3 py-2 font-medium">ราคาต่อหน่วย</th>
                  <th className="border-b px-3 py-2 font-medium">รวม</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="border-b px-2 py-2">
                      <input
                        className="w-full border border-blue-100 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        value={item.name}
                        onChange={e => handleItemChange(item.id, "name", e.target.value)}
                        placeholder="ชื่อสินค้า/บริการ"
                      />
                    </td>
                    <td className="border-b px-2 py-2">
                      <input
                        type="number"
                        className="w-16 border border-blue-100 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-blue-300"
                        value={item.qty}
                        onChange={e => handleItemChange(item.id, "qty", parseInt(e.target.value))}
                        min={1}
                      />
                    </td>
                    <td className="border-b px-2 py-2">
                      <input
                        className="w-20 border border-blue-100 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        value={item.unit}
                        onChange={e => handleItemChange(item.id, "unit", e.target.value)}
                        placeholder="หน่วย"
                      />
                    </td>
                    <td className="border-b px-2 py-2">
                      <input
                        type="number"
                        className="w-24 border border-blue-100 rounded-md px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-blue-300"
                        value={item.price}
                        onChange={e => handleItemChange(item.id, "price", parseFloat(e.target.value))}
                        min={0}
                      />
                    </td>
                    <td className="border-b px-2 py-2 text-right font-semibold text-blue-700">
                      {(item.qty * item.price).toLocaleString()} ฿
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow font-semibold transition"
            onClick={addItem}
            type="button"
          >
            + เพิ่มรายการ
          </button>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-xl p-6 text-right shadow-inner">
          <p className="text-base">ราคารวม: <span className="font-semibold text-blue-700">{total.toLocaleString()} ฿</span></p>
          <p className="text-xl font-bold text-blue-900 mt-2">รวมสุทธิ: {total.toLocaleString()} ฿</p>
        </div>
      </div>
    </div>
  );
}
