// import React from 'react';
// import { Avatar } from '@mui/material';
// import { Input } from '@mui/material';
// import { Button } from '@mui/material';
// import { ArrowLeft, MoreHorizontal, Send } from 'lucide-react';

// interface Message {
//   id: number;
//   text: string;
//   timestamp: string;
//   sender: 'user' | 'other';
//   senderName?: string;
//   senderAvatar?: string;
// }

// const SingleChat = () => {
//   const [messages] = React.useState<Message[]>([
//     {
//       id: 1,
//       text: 'Hello',
//       timestamp: '10:35 am',
//       sender: 'user'
//     },
//     {
//       id: 2,
//       text: 'Just wanted to tell you that i started your course and its going great!!',
//       timestamp: '10:30 am',
//       sender: 'user'
//     },
//     {
//       id: 3,
//       text: 'Hello! Thank you for reaching out to me. Feel free to ask any questions regarding the course, I will try to reply ASAP',
//       timestamp: '12:23 pm',
//       sender: 'other',
//       senderName: 'Ronald Richards',
//       senderAvatar: '/api/placeholder/32/32'
//     },
//     {
//       id: 4,
//       text: 'Yes Sure',
//       timestamp: '10:25 pm',
//       sender: 'user'
//     }
//   ]);

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b">
//         <Button className="mr-2">
//           <ArrowLeft className="h-6 w-6" />
//         </Button>
//         <Avatar className="h-10 w-10">
//           <img src="/api/placeholder/40/40" alt="Ronald Richards" />
//         </Avatar>
//         <div className="ml-3 flex-1">
//           <h2 className="font-semibold">Ronald Richards</h2>
//         </div>
//         <Button >
//           <MoreHorizontal className="h-6 w-6" />
//         </Button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         <div className="text-center text-sm text-gray-500">Today</div>
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sender === 'user' ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             {message.sender === 'other' && (
//               <Avatar className="h-8 w-8 mr-2">
//                 <img src={message.senderAvatar} alt={message.senderName} />
//               </Avatar>
//             )}
//             <div
//               className={`max-w-[70%] rounded-lg p-3 ${
//                 message.sender === 'user'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-100'
//               }`}
//             >
//               <p className="text-sm">{message.text}</p>
//               <p
//                 className={`text-xs mt-1 ${
//                   message.sender === 'user'
//                     ? 'text-blue-100'
//                     : 'text-gray-500'
//                 }`}
//               >
//                 {message.timestamp}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t flex items-center">
//         <Input
//           type="text"
//           placeholder="Type Your Message"
//           className="flex-1 mr-2"
//         />
//         <Button className="bg-blue-500 hover:bg-blue-600">
//           <Send className="h-5 w-5" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SingleChat;