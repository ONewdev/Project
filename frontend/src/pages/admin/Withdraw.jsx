import { useState } from "react";

export default function WithdrawPage() {
  const [requisition, setRequisition] = useState({
    requisition_by: "",
    remarks: "",
  });

  const [items, setItems] = useState([
    { id: Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" },
  ]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" }]);
  };

  const handleSubmit = async () => {
    const data = { requisition, items };

    try {
      const res = await fetch("http://localhost:5000/api/requisition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ บันทึกใบเบิกสำเร็จ! เลขที่: " + result.requisitionId);
        // reset form
        setRequisition({ requisition_by: "", remarks: "" });
        setItems([{ id: Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" }]);
      } else {
        alert("❌ บันทึกไม่สำเร็จ: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        
        {/* Requisition Info */}
        <h2 className="text-xl font-bold mb-2">ใบเบิกวัสดุ</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="ผู้เบิก"
          value={requisition.requisition_by}
          onChange={e => setRequisition({ ...requisition, requisition_by: e.target.value })}
        />
        <textarea
          className="border p-2 mb-4 w-full"
          placeholder="หมายเหตุ"
          value={requisition.remarks}
          onChange={e => setRequisition({ ...requisition, remarks: e.target.value })}
        />

        {/* Items */}
        <h2 className="text-xl font-bold mb-2">รายการวัสดุ</h2>
        <table className="w-full border-collapse border text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">รหัสวัสดุ</th>
              <th className="border px-2 py-1">ชื่อวัสดุ</th>
              <th className="border px-2 py-1">จำนวนที่ขอ</th>
              <th className="border px-2 py-1">จำนวนที่จ่าย</th>
              <th className="border px-2 py-1">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">
                  <input
                    className="w-20 border px-1"
                    value={item.material_id}
                    onChange={e => handleItemChange(item.id, "material_id", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full border px-1"
                    value={item.name}
                    onChange={e => handleItemChange(item.id, "name", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-20 border px-1 text-center"
                    value={item.qty_req}
                    onChange={e => handleItemChange(item.id, "qty_req", parseInt(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-20 border px-1 text-center"
                    value={item.qty_issued}
                    onChange={e => handleItemChange(item.id, "qty_issued", parseInt(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full border px-1"
                    value={item.remarks}
                    onChange={e => handleItemChange(item.id, "remarks", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addItem}
        >
          + เพิ่มรายการ
        </button>

        {/* Submit */}
        <div className="text-right mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            บันทึกใบเบิก
          </button>
        </div>
      </div>
    </div>
  );
}
