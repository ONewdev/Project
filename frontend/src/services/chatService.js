// src/services/chatService.js
const host = import.meta.env.VITE_HOST;

// ดึงรายชื่อคนที่เคยแชทด้วย
export const fetchContacts = async (userId) => {
  const res = await fetch(`${host}/api/messages/contacts?userId=${userId}`);
  return res.json();
};

// ดึงข้อความระหว่าง 2 คน
export const fetchMessages = async (senderId, receiverId) => {
  const res = await fetch(`${host}/api/messages?senderId=${senderId}&receiverId=${receiverId}`);
  return res.json();
};

// ส่งข้อความ
export const sendMessage = async ({ sender_id, receiver_id, message }) => {
  const res = await fetch(`${host}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id, receiver_id, message }),
  });
  return res.json();
};
