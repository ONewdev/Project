import React, { useEffect, useState, useRef } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';

export default function ChatWindow({ senderId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!senderId || !receiverId) return;
    setLoading(true);
    fetchMessages(senderId, receiverId)
      .then(data => {
        setMessages(data);
        setLoading(false);
        scrollToBottom();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [senderId, receiverId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage({ sender_id: senderId, receiver_id: receiverId, message: input.trim() });
      // รีเฟรชข้อความใหม่
      fetchMessages(senderId, receiverId).then(setMessages);
      setInput('');
      scrollToBottom();
    } catch (err) {
      alert('ส่งข้อความไม่สำเร็จ');
    }
  };

  if (!senderId || !receiverId) return <div>กรุณาเลือกการสนทนา</div>;
  if (loading) return <div>กำลังโหลดข้อความ...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: '10px',
              textAlign: msg.sender_id === senderId ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: msg.sender_id === senderId ? '#dcf8c6' : '#fff',
                padding: '8px 12px',
                borderRadius: '15px',
                maxWidth: '70%',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
        <input
          type="text"
          value={input}
          placeholder="พิมพ์ข้อความ..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ width: '80%', padding: '8px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ marginLeft: '10px', padding: '8px 16px', borderRadius: '20px', backgroundColor: '#4caf50', color: 'white', border: 'none' }}>
          ส่ง
        </button>
      </div>
    </div>
  );
}
