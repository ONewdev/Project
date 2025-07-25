import React, { useState, useEffect } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

export default function ChatUser() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setUserId(u.id);
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ddd' }}>
        <ChatList onSelectChat={setSelectedChatId} userId={userId} />
      </div>
      <div style={{ flexGrow: 1 }}>
        {selectedChatId && userId ? (
          <ChatWindow senderId={userId} receiverId={selectedChatId} />
        ) : (
          <div style={{ padding: '20px', color: '#888' }}>กรุณาเลือกการสนทนา</div>
        )}
      </div>
    </div>
  );
}
