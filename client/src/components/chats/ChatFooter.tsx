import React, { useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { User } from "../../interfaces/User";
import { Course } from "../../interfaces/course";
import { EnrolledCourse } from "../../interfaces/enrolledCourse";

const ChatFooter: React.FC<{ socket: Socket; user: User | null ,course:EnrolledCourse|null}> = ({
  socket,
  user,
  course,
}) => {
  const inputRef = useRef(null);
  // const selectedCourse = useSelector(
  //   (state: RootState) => state.enrolledCourse
  // );
 console.log("course in chat footer page", course)
  const courseId = course?.courseId.id
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    // e.preventDefault();
    if (message.trim() && user?.name) {
      // const courseId =
      //   typeof selectedCourse === "string"
      //     ? selectedCourse
      //     : selectedCourse?.id;
      socket.emit("message", {
        courseId: courseId,
        message: {
          name: user.name,
          message: message,
          sender: user?._id,
        },
      });
    }
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray p-4 flex justify-between items-center">
      <input
        className="flex items-center h-10 rounded px-3 text-sm w-full "
        type="text"
        value={message}
        placeholder="Type your message…"
        ref={inputRef}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <i
        className="fa-solid fa-paper-plane text-2xl mx-4"
        onClick={handleSendMessage}
      ></i>
    </div>
  );
};

export default ChatFooter;