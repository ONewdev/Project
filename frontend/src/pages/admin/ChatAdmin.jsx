import React, { useState, useEffect } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

export default function ChatAdmin() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    // สมมุติ admin login เก็บ user ใน localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setAdminId(u.id);
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
      {/* ฝั่งซ้าย: รายการลูกค้าที่ทักเข้ามา */}
      <div style={{ width: '320px', borderRight: '1px solid #ddd' }}>
        <h2 style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
          ข้อความลูกค้า
        </h2>
        <ChatList onSelectChat={setSelectedChatId} userId={adminId} />
      </div>

      {/* ฝั่งขวา: หน้าต่างแชทแสดงข้อความ */}
      <div style={{ flexGrow: 1 }}>
        {selectedChatId && adminId ? (
          <ChatWindow senderId={adminId} receiverId={selectedChatId} />
        ) : (
          <div style={{ padding: '20px', color: '#888' }}>
            กรุณาเลือกการสนทนาจากฝั่งซ้าย
          </div>
        )}
      </div>
    </div>
  );
}
