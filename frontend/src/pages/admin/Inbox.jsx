import React, { useEffect, useState } from 'react';

export default function Inbox() {
	const host = import.meta.env.VITE_HOST;
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await fetch(`${host}/api/inbox`);
				const data = await res.json();
				setMessages(data);
			} catch (err) {
				setMessages([]);
			} finally {
				setLoading(false);
			}
		};
		fetchMessages();
	}, [host]);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">กล่องข้อความลูกค้า (Inbox)</h1>
			{loading ? (
				<div className="text-gray-500">กำลังโหลดข้อมูล...</div>
			) : messages.length === 0 ? (
				<div className="text-gray-400">ไม่มีข้อความ</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border rounded-lg shadow">
						<thead className="bg-green-600 text-white">
							<tr>
								<th className="px-4 py-2">ชื่อ</th>
								<th className="px-4 py-2">อีเมล</th>
								<th className="px-4 py-2">เบอร์โทร</th>
								<th className="px-4 py-2">หัวข้อ</th>
								<th className="px-4 py-2">ข้อความ</th>
								<th className="px-4 py-2">วันที่ส่ง</th>
							</tr>
						</thead>
						<tbody>
							{messages.map(msg => (
								<tr key={msg.id} className="border-b">
									<td className="px-4 py-2 whitespace-nowrap">{msg.name}</td>
									<td className="px-4 py-2 whitespace-nowrap">{msg.email}</td>
									<td className="px-4 py-2 whitespace-nowrap">{msg.phone}</td>
									<td className="px-4 py-2 whitespace-nowrap">{msg.subject}</td>
									<td className="px-4 py-2 max-w-xs break-words">{msg.message}</td>
									<td className="px-4 py-2 whitespace-nowrap">{new Date(msg.created_at).toLocaleString('th-TH')}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
