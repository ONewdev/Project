import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const AdminChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);

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
        if (input.trim() && socketRef.current) {
            const msgObj = { username: 'แอดมิน', text: input };
            socketRef.current.emit('chat message', msgObj);
            setMessages((prev) => [...prev, { ...msgObj, self: true }]);
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-4">
            {open && (
                <div className="bg-white w-80 max-w-full rounded-2xl shadow-2xl p-4 mb-2 flex flex-col border border-blue-200 animate-fadeIn">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-blue-700">👨‍💼 แชทแอดมิน</span>
                        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">×</button>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-64 mb-2 pr-1" style={{ fontFamily: 'Prompt, Kanit, sans-serif' }}>
                        {messages.length === 0 && <div className="text-gray-400 text-center py-8">รอข้อความจากลูกค้า...</div>}
                        {messages.map((msg, idx) => {
                            let text = '';
                            let sender = '';
                            if (typeof msg === 'string') {
                                text = msg;
                            } else if (msg && typeof msg === 'object') {
                                if (typeof msg.text === 'string') {
                                    text = msg.text;
                                } else if (msg.text !== undefined) {
                                    text = JSON.stringify(msg.text);
                                }
                                sender = msg.username ? msg.username : '';
                            }
                            return (
                                <div key={idx} className={`mb-2 flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-3 py-2 rounded-lg text-sm ${msg.self ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                                        <span className="font-bold mr-1">{sender}</span>{text}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            className="flex-1 border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="ตอบกลับลูกค้า..."
                            autoFocus
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">ส่ง</button>
                    </form>
                </div>
            )}
            <button
                onClick={() => setOpen((v) => !v)}
                className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition duration-300"
                aria-label="admin-chat"
            >
                👨‍💼
            </button>
        </div>
    );
};

export default AdminChatWidget;
