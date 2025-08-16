

import React, { useEffect, useState, useRef } from 'react';
import { fetchContacts, fetchMessages, sendMessage } from '../../services/chatService';
import { io } from 'socket.io-client';

function ChatAdmin() {
  const adminId = 1; // สมมติ admin id = 1
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ดึงรายชื่อผู้ติดต่อ
  useEffect(() => {
    fetchContacts(adminId).then(setContacts);
  }, []);

  // เชื่อมต่อ socket.io
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');
    socketRef.current.on('chat message', (msg) => {
      // ถ้ามี selectedContact และข้อความมาจาก user คนนั้น
      if (selectedContact && msg.userId === selectedContact.id) {
        // ดึงข้อความใหม่จาก API
        fetchMessages(adminId, selectedContact.id).then(setMessages);
      }
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedContact]);

  // ดึงข้อความเมื่อเลือกผู้ติดต่อ (ครั้งแรก)
  useEffect(() => {
    if (selectedContact) {
      setLoading(true);
      fetchMessages(adminId, selectedContact.id)
        .then((msgs) => {
          setMessages(msgs);
          setLoading(false);
        });
    }
  }, [selectedContact]);

  // scroll ลงล่างสุดเมื่อข้อความเปลี่ยน
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    await sendMessage({ sender_id: adminId, receiver_id: selectedContact.id, message: newMessage });
    setNewMessage('');
    // ดึงข้อความใหม่ทันที
    fetchMessages(adminId, selectedContact.id).then(setMessages);
  };

  return (
    <div className="flex h-[80vh] bg-white rounded shadow overflow-hidden">
      {/* รายชื่อผู้ติดต่อ */}
      <div className="w-1/4 border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">รายชื่อผู้ติดต่อ</h2>
        {contacts.length === 0 ? (
          <div className="text-gray-400">ไม่มีผู้ติดต่อ</div>
        ) : (
          <ul>
            {contacts.map((c) => (
              <li
                key={c.id}
                className={`p-2 mb-2 rounded cursor-pointer hover:bg-blue-100 transition-colors ${selectedContact?.id === c.id ? 'bg-blue-200 font-bold' : ''}`}
                onClick={() => setSelectedContact(c)}
              >
                <div className="flex items-center gap-2">
                  {c.profile_picture ? (
                    <img src={`http://localhost:3001${c.profile_picture}`} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">?
                    </div>
                  )}
                  <span>{c.name || c.email}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* กล่องแชท */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 bg-gray-100">
          <h2 className="font-bold text-lg">{selectedContact ? (selectedContact.name || selectedContact.email) : 'เลือกผู้ติดต่อ'}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {loading ? (
            <div className="text-gray-400">กำลังโหลด...</div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === adminId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg shadow ${msg.sender_id === adminId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.message}
                    <div className="text-xs text-right mt-1 opacity-70">{new Date(msg.created_at).toLocaleString('th-TH')}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* ส่งข้อความ */}
        <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="พิมพ์ข้อความ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!selectedContact}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={!selectedContact || !newMessage.trim()}
          >ส่ง</button>
        </form>
      </div>
    </div>
  );
}

export default ChatAdmin;