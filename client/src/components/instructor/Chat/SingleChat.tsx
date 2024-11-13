import React, { useState } from "react";
import { Message } from "react-chat-ui";
import { TextField, IconButton, Box, Avatar, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { LucideArrowLeft } from "lucide-react";

const SingleChat = () => {
  const [messages, setMessages] = useState([
    new Message({ id: 1, message: "Hello! Feel free to ask any questions regarding the course." }), // Recipient message
    new Message({ id: 0, message: "Just wanted to tell you that I started your course and it's going great!" }) // User message
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, new Message({ id: 0, message: newMessage })]);
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        maxWidth: "800px",
        width: "100%",
        margin: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      {/* Header with avatar and name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor:"#f5f5f5",
          borderBottom: "1px solid #ddd"
        }}
      >
          <IconButton
    sx={{ marginRight: "8px" }}
    onClick={() => {
      // Add your back navigation logic here, such as navigating to the previous page
    }}
  >
    <LucideArrowLeft />
  </IconButton>
        <Avatar alt="Ronald Richards" src="/path/to/avatar.jpg" sx={{ marginRight: "12px" }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Ronald Richards
        </Typography>
      </Box>

      {/* Chat messages */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          backgroundColor: "#fafafa"
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.id === 0 ? "flex-end" : "flex-start",
              marginBottom: "8px"
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: "8px",
                color: msg.id === 0 ? "#fff" : "#000",
                backgroundColor: msg.id === 0 ? "#5A627B" : "#e0e0e0" // Green for user, gray for recipient
              }}
            >
              {msg.message}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input field for typing messages */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #ddd",
          padding: "8px",
          backgroundColor: "#f9f9f9"
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SingleChat;
