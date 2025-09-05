import { useEffect, useMemo, useState } from "react";
import { listMaterials } from "../../services/materialsService";

export default function WithdrawPage() {
  const host = import.meta.env.VITE_HOST || '';
  const [requisition, setRequisition] = useState({
    requisition_by: "",
    remarks: "",
  });

  const [items, setItems] = useState([
    { id: Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" },
  ]);

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await listMaterials({ limit: 500 });
        if (alive) setMaterials(rows || []);
      } catch (e) {
        console.error('Load materials error', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const matMap = useMemo(() => {
    const m = new Map();
    for (const row of materials) m.set(String(row.id), row);
    return m;
  }, [materials]);

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const next = { ...item };

      if (field === "qty_req") {
        const v = Math.max(0, parseFloat(value ?? 0) || 0);
        next.qty_req = v;
        // จำกัดจำนวนจ่ายไม่ให้มากกว่าที่ขอ
        if ((parseFloat(next.qty_issued) || 0) > v) next.qty_issued = v;
      } else if (field === "qty_issued") {
        const v = Math.max(0, parseFloat(value ?? 0) || 0);
        next.qty_issued = Math.min(v, parseFloat(next.qty_req) || 0);
      } else {
        next[field] = value;
      }
      return next;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" }]);
  };

  const handleSubmit = async () => {
    if (!requisition.requisition_by.trim()) {
      alert("กรุณากรอกชื่อผู้เบิก");
      return;
    }
    if (items.length === 0) {
      alert("ต้องมีรายการอย่างน้อย 1 รายการ");
      return;
    }
    const bad = items.find(it =>
      (!String(it.material_id).trim() && !String(it.name).trim()) ||
      (parseFloat(it.qty_req) || 0) <= 0 ||
      (parseFloat(it.qty_issued) || 0) > (parseFloat(it.qty_req) || 0)
    );
    if (bad) {
      alert("กรุณาตรวจสอบข้อมูลรายการ: (รหัส/ชื่อวัสดุ, จำนวนที่ขอ, จำนวนที่จ่ายต้องไม่เกินที่ขอ)");
      return;
    }

    const data = {
      requisition: {
        requisition_by: requisition.requisition_by.trim(),
        remarks: requisition.remarks.trim()
      },
      items: items.map(({ id, ...row }) => ({
        ...row,
        qty_req: parseFloat(row.qty_req) || 0,
        qty_issued: parseFloat(row.qty_issued) || 0
      }))
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${host}/api/requisition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        alert("สร้างใบเบิกสำเร็จ! เลขที่: " + result.requisitionId);
        setRequisition({ requisition_by: "", remarks: "" });
        setItems([{ id: crypto?.randomUUID?.() || Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" }]);
      } else {
        alert("ไม่สำเร็จ: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">เบิกวัสดุ</h1>
          {loading && <span className="text-sm text-gray-500">กำลังโหลดรายการวัสดุ...</span>}
        </div>

        {/* Requisition Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">ข้อมูลการเบิก</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm text-gray-600 mb-1">ชื่อผู้เบิก</label>
              <input
                className="border rounded-md p-2 w-full"
                placeholder="เช่น นายสมชาย ใจดี"
                value={requisition.requisition_by}
                onChange={e => setRequisition({ ...requisition, requisition_by: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">หมายเหตุ</label>
              <input
                className="border rounded-md p-2 w-full"
                placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                value={requisition.remarks}
                onChange={e => setRequisition({ ...requisition, remarks: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">รายการวัสดุ</h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={addItem}
          >+ เพิ่มแถว</button>
        </div>
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-2 py-2 w-48 text-left">รหัส/ชื่อวัสดุ</th>
                <th className="border px-2 py-2 w-36 text-left">หน่วย</th>
                <th className="border px-2 py-2 w-36 text-right">คงเหลือ</th>
                <th className="border px-2 py-2 w-32 text-right">จำนวนที่ขอ</th>
                <th className="border px-2 py-2 w-32 text-right">จำนวนที่จ่าย</th>
                <th className="border px-2 py-2 text-left">หมายเหตุ</th>
                <th className="border px-2 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const mat = matMap.get(String(item.material_id));
                return (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">
                      <input
                        list={`materials-list`}
                        className="border rounded p-1 w-full"
                        placeholder="ค้นหา/เลือกวัสดุ"
                        value={mat ? `${mat.code} - ${mat.name}` : item.name}
                        onChange={e => {
                          const val = e.target.value;
                          const found = materials.find(m => `${m.code} - ${m.name}` === val);
                          if (found) {
                            handleItemChange(item.id, 'material_id', String(found.id));
                            handleItemChange(item.id, 'name', found.name);
                          } else {
                            handleItemChange(item.id, 'material_id', '');
                            handleItemChange(item.id, 'name', val);
                          }
                        }}
                      />
                      <datalist id="materials-list">
                        {materials.map(m => (
                          <option key={m.id} value={`${m.code} - ${m.name}`}>{m.name}</option>
                        ))}
                      </datalist>
                    </td>
                    <td className="border px-2 py-1">{mat?.unit || '-'}</td>
                    <td className="border px-2 py-1 text-right">{mat?.quantity ?? '-'}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        className="w-full border rounded p-1 text-right"
                        min={0}
                        step="0.01"
                        value={item.qty_req}
                        onChange={e => handleItemChange(item.id, "qty_req", parseFloat(e.target.value))}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        className="w-full border rounded p-1 text-right"
                        min={0}
                        step="0.01"
                        value={item.qty_issued}
                        onChange={e => handleItemChange(item.id, "qty_issued", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-full border rounded p-1"
                        placeholder="หมายเหตุ"
                        value={item.remarks}
                        onChange={e => handleItemChange(item.id, "remarks", e.target.value)}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}
                        title="ลบแถว"
                      >×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            className="border px-5 py-2 rounded-md"
            onClick={() => {
              setRequisition({ requisition_by: "", remarks: "" });
              setItems([{ id: crypto?.randomUUID?.() || Date.now(), material_id: "", name: "", qty_req: 1, qty_issued: 0, remarks: "" }]);
            }}
          >ล้างค่า</button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-60"
            onClick={handleSubmit}
            disabled={submitting}
          >{submitting ? 'กำลังบันทึก...' : 'บันทึกใบเบิก'}</button>
        </div>
      </div>
    </div>
  );
}

