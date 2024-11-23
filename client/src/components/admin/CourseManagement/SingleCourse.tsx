import { useState, useEffect } from "react";
import { Course } from "../../../interfaces/course";
import { deleteCourse, listCourse } from "../../../api/instructorApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

import toast from "react-hot-toast";
import Breadcrumb from "../../instructor/Breadcrumbs/Breadcrumb";

import { getSingleCourse } from "../../../api/adminApi";

const SingleCourseViewAdmin = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);


  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await getSingleCourse(courseId!)
        console.log("Sinle course Admin Response: ", response)
        setCourse(response);
        
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="p-4">
      <Breadcrumb pageName={`Courses / ${course?.name}`} />

      <Card className="max-w-5xl ml-4 shadow-md">
        <CardContent className="flex items-center justify-between">
          <div>
            <Typography variant="h6" className="font-bold">
              {course?.name || "Course Name Not Available"}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mt-2">
              {course?.description || "Course description not available."}
            </Typography>
            <div className="mt-4 space-y-1">
              <Typography variant="subtitle1" color="textSecondary">
                Level: {course?.level || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: ${course?.price || "0"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Category: {course?.category?.category || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Approval:{" "}
                <span
                  style={{
                    color:
                      course?.approval === "Approved"
                        ? "green"
                        : course?.approval === "Pending"
                        ? "red"
                        : "inherit",
                  }}
                >
                  {course?.approval || "N/A"}
                </span>
              </Typography>
            </div>
          </div>

          <CardMedia
            component="img"
            image={course?.image || "default-course-image.jpg"}
            alt={course?.name || "Course Image"}
            className="-mt-17"
            sx={{
              height: 120,
              width: 200,
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </CardContent>

        <div className="flex justify-end -mt-14 mb-4 mr-4 space-x-2">
       

          
        </div>
      </Card>

      
    </div>
  );
};

export default SingleCourseViewAdmin;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Assumes you're using React Router
// import ReactPlayer from 'react-player';
// import { CircularProgress, Typography, Card, CardContent } from '@mui/material';
// import { getSingleCourse } from '../../../api/adminApi';


// interface Chapter {
//   title: string;
//   videoUrl: string; // Add this property to match your backend schema
// }

// interface Module {
//   title: string;
//   chapters: Array<Chapter>;
// }

// interface Course {
//   name: string;
//   description: string;
//   price: number;
//   level: string;
//   category: string;
//   image: string;
//   modules: Array<Module>;
// }

// const SingleCourseViewAdmin: React.FC = () => {
//   const { courseId } = useParams<{ courseId: string }>(); 
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         if (courseId) {
//           const courseData = await getSingleCourse(courseId);
//           setCourse(courseData);
//         }
//       } catch {
//         setError('Failed to load course details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography variant="h6">Course not found.</Typography>
//       </div>
//     );
//   }

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4">{course.name}</Typography>
//         <Typography variant="body1" color="textSecondary">
//           {course.description}
//         </Typography>
//         <Typography variant="h6">Price: ${course.price}</Typography>
//         <Typography variant="h6">Level: {course.level}</Typography>
//         <Typography variant="h6">Category: {course.category}</Typography>
//         <img src={course.image} alt={course.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
//         <Typography variant="h5" style={{ marginTop: '20px' }}>
//           Modules:
//         </Typography>
//         {course.modules.length > 0 ? (
//           course.modules.map((module, index) => (
//             <div key={index} style={{ marginBottom: '20px' }}>
//               <Typography variant="h6">Module: {module.title}</Typography>
//               {module.chapters.map((chapter, idx) => (
//                 <div key={idx} style={{ marginLeft: '20px', marginBottom: '10px' }}>
//                   <Typography variant="body2">Chapter: {chapter.title}</Typography>
//                   {chapter.videoUrl && (
//                     <ReactPlayer
//                       url={chapter.videoUrl}
//                       controls
//                       width="100%"
//                       height="200px"
//                       style={{ marginTop: '10px' }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))
//         ) : (
//           <Typography variant="body2">No modules available.</Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SingleCourseViewAdmin;




// <div className="mt-8 ml-4">
//   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom:"25px" }}>
//     <Typography variant="h6" className="font-bold mb-4 pl-4">
//       Modules
//     </Typography>
    
//   </div>
//   {modules?.map((moduleData) => (
//     <Accordion key={moduleData.moduleId} className="mb-4" elevation={0} sx={{ boxShadow: 'none' }}>
//       <AccordionSummary
//         expandIcon={<ExpandMoreIcon />}
//         aria-controls={`module-${moduleData.moduleId}-content`}
//         id={`module-${moduleData.moduleId}-header`}
//         sx={{
//           backgroundColor: "#F7F9FA",
//           border: '1px solid #D3D3D3',  // Light gray border
//           borderRadius: '4px',         // Optional: rounded corners
//           boxShadow: 'none',
//         }}
//       >
//         <Typography variant="inherit" className="text-graydark">
//           {moduleData?.name || "Module Name Not Available"}
//         </Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//       <Box display="flex" justifyContent="flex-end" mb={2}>
//     <Button
//       variant="outlined"
//       color="primary"
//       startIcon={<AddIcon />}
//       onClick={() => openAddChapterModal(moduleData.moduleId)}
//       sx={{color:"#6575E7"}}
//     >
//       Add Chapter
//     </Button>
//   </Box>
//         <div className="mt-2">
//           {moduleData.chapters && moduleData.chapters.length > 0 ? (
//             moduleData.chapters.map((chapter) => (
//               <Accordion key={chapter.title} className="mt-2 ml-5" elevation={0} sx={{ boxShadow: 'none' }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}  sx={{
          
//             border: '1px solid #D3D3D3',  // Light gray border
//             borderRadius: '4px',         // Optional: rounded corners
//             boxShadow: 'none',
//           }} >
//                   <Typography className="text-midnightblue">{chapter.title}</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails className="text-body">
//                   {/* Chapter Content */}
//                   <Typography>
//                     {chapter.videoUrl ? (
//                       <div>
//                         <Typography>
//                           Video:
//                         </Typography>
                        
//                         <ReactPlayer
//   url={chapter.videoUrl} 
//   controls
//   width="100%"
//   height="100%"
//   config={{
//     file: {
//       attributes: {
//         controlsList: 'nodownload' // Optional: disables download button
//       },
//       forceVideo: true // Forces ReactPlayer to use HTML5 video
//     }
//   }}
// />
//                       </div>
//                     ) : (
//                       <Typography>
//                         Video: N/A
//                       </Typography>
//                     )}
//                   </Typography>
//                   <Typography>
//                     Content: {chapter.content || "N/A"}
//                   </Typography>
//                   <Typography>
//                     Description: {chapter.description || "No description"}
//                   </Typography>
//                 </AccordionDetails>
//               </Accordion>
//             ))
//           ) : (
//             <Typography className="text-gray-500">
//               No chapters available
//             </Typography>
//           )}
//         </div>
//       </AccordionDetails>
//     </Accordion>
//   ))}
// </div>