import React, { useState, useEffect, useRef } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';
import { useState as useStateReact } from 'react';
import { fetchMessages } from '../../services/chatService';
import AdminChatWidget from '../../components/AdminChatWidget';

export default function ChatAdmin() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // trigger refresh
  const intervalRef = useRef();


  useEffect(() => {
    // สมมุติ admin login เก็บ user ใน localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setAdminId(u.id);
    }
  }, []);

  // ตั้ง interval เพื่อ refresh รายชื่อและข้อความทุก 2 วินาที
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRefreshKey(k => k + 1);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ฟังก์ชันดึงข้อความทั้งหมด (admin เห็นทุกข้อความ)
  const handleFetchAll = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/api/messages/all`);
      const data = await res.json();
      setAllMessages(data);
      setShowAll(true);
    } catch (err) {
      alert('ดึงข้อความทั้งหมดไม่สำเร็จ');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
        {/* ฝั่งซ้าย: รายการลูกค้าที่ทักเข้ามา */}
        <div style={{ width: '320px', borderRight: '1px solid #ddd' }}>
          <h2 style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
            ข้อความลูกค้า
          </h2>
          <button onClick={handleFetchAll} style={{ margin: '10px 0', width: '100%' }}>ดูข้อความทั้งหมด (admin)</button>
          <ChatList onSelectChat={setSelectedChatId} userId={adminId} showLastMessage refreshKey={refreshKey} />
        </div>

        {/* ฝั่งขวา: หน้าต่างแชทแสดงข้อความ */}
        <div style={{ flexGrow: 1 }}>
          {showAll ? (
            <div style={{ height: '100%', overflowY: 'auto', background: '#fff', borderRadius: 8, padding: 16 }}>
              <h3>ข้อความทั้งหมดในระบบ</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {allMessages.map(msg => (
                  <li key={msg.id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                    <div><b>จาก:</b> {msg.sender_id === 0 ? 'Guest' : `User ${msg.sender_id}`}</div>
                    <div><b>ถึง:</b> {msg.receiver_id}</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.message}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{new Date(msg.created_at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowAll(false)} style={{ marginTop: 10 }}>กลับ</button>
            </div>
          ) : selectedChatId && adminId ? (
            <ChatWindow
              senderId={adminId}
              receiverId={selectedChatId === 0 ? 1 : selectedChatId}
              refreshKey={refreshKey}
            />
          ) : (
            <div style={{ padding: '20px', color: '#888' }}>
              กรุณาเลือกการสนทนาจากฝั่งซ้าย
            </div>
          )}
        </div>
      </div>
      <AdminChatWidget />
    </>
  );
}
