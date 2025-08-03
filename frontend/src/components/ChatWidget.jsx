import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';


const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // ตรวจสอบ user login (เช็ค localStorage)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      setUser(null);
    }
    // อัปเดตเมื่อ login/logout
    const onUserChanged = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('userChanged', onUserChanged);
    return () => window.removeEventListener('userChanged', onUserChanged);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL);
      socketRef.current.on('chat message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socketRef.current && user) {
      socketRef.current.emit('chat message', {
        text: input,
        userId: user.id,
        username: user.username || user.name || 'User',
      });
      setMessages((prev) => [...prev, { self: true, text: input }]);
      setInput('');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-4">
      {open && (
        <div className="bg-white w-80 max-w-full rounded-2xl shadow-2xl p-4 mb-2 flex flex-col border border-green-200 animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-green-700">💬 แชทกับเรา</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">×</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-64 mb-2 pr-1" style={{fontFamily: 'Prompt, Kanit, sans-serif'}}>
            {messages.length === 0 && <div className="text-gray-400 text-center py-8">เริ่มต้นสนทนาได้เลย!</div>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm ${msg.self ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{msg.text || msg}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              className="flex-1 border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              autoFocus
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold">ส่ง</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition duration-300"
        aria-label="ติดต่อแชท"
      >
        💬
      </button>
    </div>
  );
};

export default ChatWidget;
