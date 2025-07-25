import React, { useEffect, useState } from 'react';
import { fetchContacts } from '../services/chatService';

export default function ChatList({ onSelectChat, userId }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchContacts(userId)
      .then(data => {
        setContacts(data.contacts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>กำลังโหลดรายการแชท...</div>;
  if (!contacts.length) return <div>ยังไม่มีข้อความใหม่</div>;

  return (
    <div>
      <h3>ข้อความที่ติดต่อ</h3>
      <ul>
        {contacts.map(cid => (
          <li
            key={cid}
            style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
            onClick={() => onSelectChat(cid)}
          >
            <strong>ผู้ใช้ {cid}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
