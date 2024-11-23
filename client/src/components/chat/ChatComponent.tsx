import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Chat } from '../../interfaces/Chat';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import ChatBody from '../chats/ChatBody'; // Assuming you have these components
import ChatFooter from '../chats/ChatFooter'; // Assuming you have these components

interface ChatComponentProps {
  courseId: string;
  userName: string;
  userId: string;
  socket: Socket; // Receive the socket prop
}

const ChatComponent: React.FC<ChatComponentProps> = ({ courseId, userName, userId, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const getAllMessages = async () => {
    socket.emit('get-all-messages', { courseId });
    socket.on('get-course-response', (data: Chat) => {
      if (data?.courseId === courseId) {
        setMessages(data.messages || []);
      }
    });
  };

  useEffect(() => {
    getAllMessages();
  }, [courseId]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('messageResponse', (data: { message: Message }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
  }, [socket]);

  return (
    <div className="w-full h-full flex flex-col rounded-sm">
      <div className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
        <ChatBody messages={messages} lastMessageRef={lastMessageRef} user={userName} />
        <ChatFooter socket={socket} user={userName} courseId={courseId} />
      </div>
    </div>
  );
};

export default ChatComponent;




// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { Chat, Message } from '../../interfaces/chat'; // Import your interfaces

// // The socket instance is now created inside the component itself
// const socket = io('http://localhost:4000'); // Adjust the URL as needed

// interface ChatComponentProps {
//   courseId: string;
//   userName: string;
//   userId: string;
// }

// const ChatComponent: React.FC<ChatComponentProps> = ({ courseId, userName, userId }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [messageInput, setMessageInput] = useState<string>('');

//   useEffect(() => {
//     // Join the chat room for the specific course
//     socket.emit('join-room', { courseId });

//     // Fetch all previous messages for this course
//     socket.emit('get-all-messages', { courseId });

//     // Listen for new messages sent to the chat
//     socket.on('messageResponse', (data: { message: Message }) => {
//       setMessages((prevMessages) => [...prevMessages, data.message]);
//     });

//     // Listen for the initial load of all messages for the course
//     socket.on('get-course-response', (data: Chat) => {
//       setMessages(data.messages || []);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.off('messageResponse');
//       socket.off('get-course-response');
//       socket.disconnect(); // Disconnect the socket when the component is unmounted
//     };
//   }, [courseId]); // Re-run the effect when courseId changes

//   const sendMessage = () => {
//     if (messageInput.trim()) {
//       const message: Message = {
//         name: userName, // Sender's name
//         sender: userId, // Sender's ID
//         message: messageInput, // The message content
//         createdAt: new Date(), // Timestamp of when the message was sent
//       };

//       // Emit the message to the server
//       socket.emit('message', { courseId, message });
//       setMessageInput(''); // Clear input after sending message
//     }
//   };

//   return (
//     <div>
//       <h2>Chat for Course {courseId}</h2>
//       <div className="chat-messages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             style={{
//               margin: '5px 0',
//               padding: '10px',
//               borderRadius: '5px',
//               backgroundColor: '#f1f8e9', // You can adjust the background color as needed
//               alignSelf: msg.sender === userId ? 'flex-end' : 'flex-start', // Align message based on sender
//             }}
//           >
//             <strong>{msg.name}:</strong> {msg.message}
//           </div>
//         ))}
//       </div>
//       <div style={{ display: 'flex', marginTop: '10px' }}>
//         <input
//           type="text"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           placeholder="Type a message"
//           style={{
//             flex: 1,
//             padding: '10px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           style={{
//             marginLeft: '5px',
//             padding: '10px',
//             backgroundColor: '#6200ea',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;
