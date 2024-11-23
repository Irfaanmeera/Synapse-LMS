import { useEffect, useState, useRef } from "react";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Socket } from "socket.io-client";
import { EnrolledCourse } from "../../interfaces/enrolledCourse";
import { Message } from "../../interfaces/Chat";

interface SocketProps {
  course: EnrolledCourse;
  socket: Socket;
}

const ChatPage: React.FC<SocketProps> = ({ socket, course }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const courseId = course?.courseId?.id;

    // Join Room
    if (courseId) {
      socket.emit("join-room", { courseId });
      console.log(`Joined room: ${courseId}`);
    }

    // Fetch Messages
    socket.emit("get-all-messages", { courseId });

    // Listen for incoming messages
    socket.on("get-course-response", (data) => {
      console.log("Messages received:", data);
      if (data?.courseId === courseId) {
        setMessages(data.messages || []);
      }
    });

    socket.on("messageResponse", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      // Cleanup listeners
      socket.off("get-course-response");
      socket.off("messageResponse");
    };
  }, [socket, course?.courseId?.id]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col rounded-sm">
      <div className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
        <ChatBody
          lastMessageRef={lastMessageRef}
          messages={messages}
          user={user}
        />
        <ChatFooter socket={socket} user={user} course={course} />
      </div>
    </div>
  );
};

export default ChatPage;




// import { useState, useEffect, useRef } from "react";
// import ChatBody from "./ChatBody";
// import ChatFooter from "./ChatFooter";
// import { Message, Chat } from "../../interfaces/chat";
// import { RootState } from "../../redux/store";
// import { Socket } from "socket.io-client";
// import { EnrolledCourse } from "../../interfaces/enrolledCourse";
// import { useSelector } from "react-redux";

// interface SocketProps {
//   course: EnrolledCourse;
//   socket: Socket;
// }

// const ChatPage: React.FC<SocketProps> = ({ socket, course }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const user = useSelector((state: RootState) => state.user.user);
//   const lastMessageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Fetch all messages and set up listeners
//     socket.emit("get-all-messages", { courseId: course?.courseId?.id });

//     socket.on("get-course-response", (data: Chat) => {
//       console.log("Messages received:", data);
//       if (data?.courseId === course?.courseId?.id) {
//         setMessages(data.messages || []);
//       }
//     });

//     socket.on("messageResponse", (data) => {
//       setMessages((prevMessages) => [...prevMessages, data.message]);
//     });

//     return () => {
//       socket.off("get-course-response");
//       socket.off("messageResponse");
//     };
//   }, [socket, course?.courseId?.id]);

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     console.log("Updated messages:", messages);
//   }, [messages]);

//   return (
//     <div className="w-full h-full flex flex-col rounded-sm">
//       <div className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
//         <ChatBody
//           lastMessageRef={lastMessageRef}
//           messages={messages}
//           user={user}
//         />
//         <ChatFooter socket={socket} user={user} course={course} />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
