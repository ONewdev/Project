import React, { useEffect, useState } from 'react';
import { fetchContacts, fetchMessages } from '../../services/chatService';

export default function ChatList({ onSelectChat, userId, showLastMessage }) {
  const [contacts, setContacts] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let interval;
  const fetchData = () => {
    if (!userId) return;
    fetchContacts(userId)
      .then(async data => {
        const contactIds = data.contacts || [];
        setContacts(contactIds);
        if (showLastMessage && contactIds.length > 0) {
          const lastMsgObj = {};
          await Promise.all(contactIds.map(async (cid) => {
            const msgs = await fetchMessages(userId, cid);
            if (msgs && msgs.length > 0) {
              lastMsgObj[cid] = msgs[msgs.length - 1];
            }
          }));
          setLastMessages(lastMsgObj);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };
  fetchData();
  if (showLastMessage) {
    interval = setInterval(fetchData, 5000);
  }
  return () => clearInterval(interval);
}, [userId, showLastMessage]);

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
          <strong>{cid === 0 ? 'Guest' : `ผู้ใช้ ${cid}`}</strong>
          {showLastMessage && lastMessages[cid] && (
            <div style={{ color: '#666', fontSize: '0.95em', marginTop: 2 }}>
              <span style={{ fontWeight: 400 }}>{lastMessages[cid].message}</span>
              <br />
              <small>{new Date(lastMessages[cid].created_at).toLocaleString()}</small>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);
}
