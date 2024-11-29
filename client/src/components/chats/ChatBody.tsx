

import React from "react";
import { User } from "../../interfaces/User";
import { Message } from "../../interfaces/Chat";
import { Box, Typography, Avatar, Stack, Paper } from "@mui/material";

interface ChatBodyProps {
  messages: Message[]; // Array of message objects
  user: User | null; // Current user object
  lastMessageRef: React.RefObject<HTMLDivElement>; // Ref for scrolling
}

const ChatBody: React.FC<ChatBodyProps> = ({
  messages,
  user,
  lastMessageRef,
}) => {
  console.log("messages ", messages)
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      padding={2}
      overflow="auto"
      height="0"
    >
      {/* Display messages or fallback */}
      {messages && messages.length > 0 ? (
        messages.map((message, index) =>
          message.name !== user?.name ? (
            // Message from another user
            <Stack
              key={index}
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{ mt: 2, maxWidth: "75%" }}
            >
              <Avatar sx={{ bgcolor: "gray" }}   />
              <Box>
                <Paper
                  elevation={1}
                  sx={{
                    bgcolor: "grey.200",
                    padding: 2,
                    borderRadius: 2,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontStyle="italic"
                    pb={1}
                  >
                    {message.name}
                  </Typography>
                  <Typography variant="body2">{message.message}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 0.5 }}
                >
                  
                </Typography>
              </Box>
            </Stack>
          ) : (
            // Message from the current user
            <Stack
              key={index}
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              alignItems="flex-start"
              sx={{ mt: 2, maxWidth: "75%", ml: "auto" }}
            >
              <Box>
                <Paper
                  elevation={1}
                  sx={{
                    bgcolor: "#003366",
                    color: "white",
                    padding: 2,
                    borderRadius: 2,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontStyle="italic"
                    pb={1}
                  >
                    You
                  </Typography>
                  <Typography variant="body2">{message.message}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 0.5 }}
                >
                  
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "gray" }} src={user?.image}/>
            </Stack>
          )
        )
      ) : (
        // Fallback when no messages are present
        <Typography variant="body2" color="textSecondary" align="center">
          No messages yet. Start the conversation!
        </Typography>
      )}
      {/* Empty div to scroll into view */}
      <Box ref={lastMessageRef} />
    </Box>
  );
};

export default ChatBody;




// import React from "react";
// import { User } from "../../interfaces/User";
// import { Message } from "../../interfaces/chat";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Stack,
//   Paper,
// } from "@mui/material";

// interface ChatBodyProps {
//   messages: [] | Message[];
//   user: User | null;
//   lastMessageRef: React.RefObject<HTMLDivElement>;
// }

// const ChatBody: React.FC<ChatBodyProps> = ({
//   messages,
//   user,
//   lastMessageRef,
// }) => {
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       flexGrow={1}
//       padding={2}
//       overflow="auto"
//       height="0"
//     >
//       {messages &&
//         messages.map((message, index) =>
//           message.name !== user?.name ? (
//             <Stack
//               key={index}
//               direction="row"
//               spacing={2}
//               alignItems="flex-start"
//               sx={{ mt: 2, maxWidth: "75%" }}
//             >
//               <Avatar sx={{ bgcolor: "gray" }} />
//               <Box>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     bgcolor: "grey.200",
//                     padding: 2,
//                     borderRadius: 2,
//                     borderBottomLeftRadius: 0,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle2"
//                     fontWeight="bold"
//                     fontStyle="italic"
//                     pb={1}
//                   >
//                     {message.name}
//                   </Typography>
//                   <Typography variant="body2">{message.message}</Typography>
//                 </Paper>
//                 <Typography
//                   variant="caption"
//                   color="textSecondary"
//                   sx={{ mt: 0.5 }}
//                 >
//                   2 min ago
//                 </Typography>
//               </Box>
//             </Stack>
//           ) : (
//             <Stack
//               key={index}
//               direction="row"
//               spacing={2}
//               justifyContent="flex-end"
//               alignItems="flex-start"
//               sx={{ mt: 2, maxWidth: "75%", ml: "auto" }}
//             >
//               <Box>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     bgcolor: "primary.main",
//                     color: "white",
//                     padding: 2,
//                     borderRadius: 2,
//                     borderBottomRightRadius: 0,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle2"
//                     fontWeight="bold"
//                     fontStyle="italic"
//                     pb={1}
//                   >
//                     You
//                   </Typography>
//                   <Typography variant="body2">{message.message}</Typography>
//                 </Paper>
//                 <Typography
//                   variant="caption"
//                   color="textSecondary"
//                   sx={{ mt: 0.5 }}
//                 >
//                   2 min ago
//                 </Typography>
//               </Box>
//               <Avatar sx={{ bgcolor: "gray" }} />
//             </Stack>
//           )
//         )}
//       <Box ref={lastMessageRef} />
//     </Box>
//   );
// };

// export default ChatBody;





// import React from "react";
// import { User } from "../../interfaces/User";
// import { Message } from "../../interfaces/chat";

// interface ChatBodyProps {
//   messages: [] | Message[];
//   user: User | null;
//   lastMessageRef: React.RefObject<HTMLDivElement>;
// }
// const ChatBody: React.FC<ChatBodyProps> = ({
//   messages,
//   user,
//   lastMessageRef,
// }) => {
//   return (
//     <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
//       {/*  */}
//       {messages &&
//         messages.map((message, index) =>
     
//           message.name !== user?.name ? (
//             <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
//               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray"></div>
//               <div>
//                 <div className="bg-gray p-3 rounded-r-lg rounded-bl-lg">
//                   <h1 className="font-bold italic pb-2 text-sm">
//                     {message.name}
//                   </h1>
//                   <p className="text-sm">{message.message} </p>
//                 </div>
//                 <span className="text-xs text-gray leading-none">
//                   2 min ago
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div
//               key={index}
//               className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
//             >
//               <div>
//                 <div className="bg-Blueviolet text-white p-3 rounded-l-lg rounded-br-lg">
//                   <h1 className="font-bold italic pb-2 text-sm">You</h1>
//                   <p className="text-sm">{message.message}</p>
//                 </div>
//                 <span className="text-xs text-gray leading-none">
//                   2 min ago
//                 </span>
//               </div>
//               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray"></div>
//             </div>
//           )
//         )}
//       <div ref={lastMessageRef} />
//       {/*  */}
//     </div>
//   );
// };

// export default ChatBody;