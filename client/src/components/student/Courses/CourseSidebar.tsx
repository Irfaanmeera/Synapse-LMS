import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent, Dialog, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Course } from "../../../interfaces/course";
import ReactPlayer from "react-player";
import { IoClose } from "react-icons/io5";
import { courseEnroll } from "../../../api/studentApi";
import { useNavigate } from "react-router-dom";
import { useSelector} from "react-redux";
import { RootState } from "../../../redux/store";


interface CourseSidebarProps {
    course: Course | undefined;
  }
export const CourseSidebar: React.FC <CourseSidebarProps> = ({ course }) => {
  const user = useSelector((store: RootState) => store.user.user);
    const [open, setOpen] = useState(false);
    console.log("Course sidebar course" , course)
    const previewVideo = course?.modules[0]?.module?.chapters[0]?.videoUrl
    const navigate = useNavigate()

    const handleEnroll = async () => {
      if (!user) {
        navigate("/login");
      } else {
        try {
          const response = await courseEnroll(course!.id!);
          if (response) {
            window.location.href = response;
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <Card variant="outlined" >
    <Box display="flex" sx={{ position: 'relative',mb: 3 }}>
      <ReactPlayer url={previewVideo} width="100%" height="100%" />
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          color: 'white', // Icon color
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
          borderRadius: '50%', // Optional: rounded background
          padding: '10px', // Optional: padding around the icon
        }}
      >
        <PlayCircleOutlineIcon fontSize="large" />
      </Box>
    </Box>
      <Button variant="outlined" fullWidth sx={{colour:"darkblue", mb: 2}} onClick={handleOpen}>
          Preview this course
        </Button>

      <CardContent>
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 , mb: 4}}>
          ₹ {course?.price}
        </Typography>
        
      
        <Button variant="contained" color="primary" fullWidth sx={{  mb: 2}} onClick={handleEnroll}>
        Enroll now 
      </Button>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1 }}>
          30-Day Money-Back Guarantee
        </Typography>
      </CardContent>
    </Card>

    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ position: 'relative', p: 2 }}>
        <ReactPlayer url={previewVideo} controls width="100%" />
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'grey' }}>
          <IoClose />
        </IconButton>
      </Box>
    </Dialog>
  </>

  );
};
