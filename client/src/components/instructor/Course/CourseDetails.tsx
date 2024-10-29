/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Module } from "../../../interfaces/module";
import { Course } from "../../../interfaces/course";
import {
  addChapter,
  createModule,
} from "../../../api/instructorApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { authorizedAxios } from "../../../api/config";
import { EditIcon, SidebarCloseIcon } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";


// CourseDetails component
const CourseDetails = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [newModuleName, setNewModuleName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterVideoFile, setNewChapterVideoFile] = useState<File | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const navigate = useNavigate()

  const goToUpdateCoursePage = () => {
    // Replace `courseId` with the actual ID of the course
    navigate(`/instructor/updateCourse/${courseId}`);
  };
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await authorizedAxios.get(
          `/instructor/course/${courseId}`
        );
        console.log("fetch course detials", data.modules);
        const extractedModules = data.modules.map((item) => ({
          id: item._id,
          moduleId: item.module.id, // Module ID
          name: item.module.name, // Module Name
          order: item.order, // Order
          status: item.module.status, // Status
          createdAt: item.module.createdAt, // Created At
          chapters: item.module.chapters || [], // Chapters (default to empty array if none)
        }));

        console.log(extractedModules, "emo");
        setCourse(data);
        setModules(extractedModules);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!newModuleName) return;

    const moduleData = {
      name: newModuleName,
      courseId: courseId,
    };

    try {
      const createdModule = await createModule(moduleData);
      setModules((prevModules) => [...prevModules, createdModule]);
      setNewModuleName("");
      setIsAddModuleModalOpen(false);
    } catch (error) {
      console.error("Failed to add module:", error);
    }
  };
  //
  const handleAddChapter = async () => {
    if (!newChapterName || !newChapterVideoFile || !selectedModuleId) return;

    const chapterData = { title: newChapterName };

    try {
      // Call the addChapter function and upload progress tracking
      const newChapter = await addChapter(
        selectedModuleId,
        chapterData,
        newChapterVideoFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );

      // Use functional update and create a deep copy to ensure React re-renders
      setModules((prevModules) => {
        const updatedModules = prevModules.map((module) =>
          module.moduleId === selectedModuleId
            ? { ...module, chapters: [...(module.chapters || []), newChapter] }
            : module
        );
        return [...updatedModules]; // Return a new array reference
      });

      // Reset form and close modal for the current module
      setNewChapterName("");
      setNewChapterVideoFile(null);
      setUploadProgress(0); // Reset upload progress
      setIsAddChapterModalOpen((prev) => ({
        ...prev,
        [selectedModuleId]: false,
      }));
      setSelectedModuleId(null); // Clear selected module ID
    } catch (error) {
      console.error("Failed to add chapter:", error);
    }
  };

  const openAddChapterModal = (moduleId) => {
    setIsAddChapterModalOpen((prev) => ({ ...prev, [moduleId]: true }));
    setSelectedModuleId(moduleId); // Set selected module when opening the modal
  };

  useEffect(() => {
    const moduleId = modules.map((module) => module.moduleId);
    console.log("Modules state:", moduleId);
  }, [modules]);

  //

  //

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

        <div className="flex justify-end -mt-14 mb-4 mr-4">
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#1E3A8A",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#1E40AF" },
            }}
            onClick={goToUpdateCoursePage} 
          >
            Edit Course
          </Button>
        </div>
       
      </Card>

      <div className="mt-8 ml-4">
        <Typography variant="h6" className="font-bold mb-4 pl-4">
          Modules
        </Typography>
        <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModuleModalOpen(true)}
              >
                Add Module
              </Button>
        {modules?.map((moduleData) => (
          <Accordion key={moduleData.moduleId} className="mb-4">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`module-${moduleData.moduleId}-content`}
              id={`module-${moduleData.moduleId}-header`}
            >
              <Typography variant="inherit" className="text-graydark">
                {moduleData?.name || "Module Name Not Available"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => openAddChapterModal(moduleData.moduleId)}
              >
                Add Chapter
              </Button>
              <div className="mt-2">
                {moduleData.chapters && moduleData.chapters.length > 0 ? (
                  moduleData.chapters.map((chapter) => (
                    <Accordion key={chapter.title} className="mt-2 ml-10">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className="text-midnightblue">{chapter.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails  className="text-body">
                        {/* Chapter Content */}
                        <Typography>
                        {chapter.videoUrl ? (
                  <div>
                    <Typography>
                      Video:
                    </Typography>
                    <ReactPlayer url={chapter.videoUrl} controls width="100%" />
                  </div>
                ) : (
                  <Typography>
                    Video: N/A
                  </Typography>
                )}
                        </Typography>
                        <Typography>
                          Section: {chapter.videoSection || "N/A"}
                        </Typography>
                        <Typography>
                          Description: {chapter.description || "No description"}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography className="text-gray-500">
                    No chapters available
                  </Typography>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <Modal
        open={isAddModuleModalOpen}
        onClose={() => setIsAddModuleModalOpen(false)}
      >
        <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-sm mt-24">
          <Typography variant="h6" className="font-semibold">
            Add New Module
          </Typography>
          <TextField
            fullWidth
            label="Module Name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            className="mt-4"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsAddModuleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddModule}
            >
              Add Module
            </Button>
          </div>
        </div>
      </Modal>

      {modules.map((module) => (
        <div key={module.moduleId}>
          <Typography variant="h6"></Typography>
          <Button
            variant="contained"
            color="transparent"
            onClick={() => openAddChapterModal(module.moduleId)}
          ></Button>

          <Modal
            open={isAddChapterModalOpen[module.moduleId] || false}
            onClose={() =>
              setIsAddChapterModalOpen((prev) => ({
                ...prev,
                [module.moduleId]: false,
              }))
            }
          >
            <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-sm mt-24">
              <IconButton
                style={{ position: "absolute", top: 10, right: 10 }}
                onClick={() =>
                  setIsAddChapterModalOpen((prev) => ({
                    ...prev,
                    [module.moduleId]: false,
                  }))
                }
              >
                <SidebarCloseIcon />
              </IconButton>
              <Typography variant="h6">Add Chapter</Typography>
              <TextField
                label="Chapter Name"
                variant="outlined"
                fullWidth
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                style={{ marginBottom: "15px" ,marginLeft:"10px", color:"blueviolet"}}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setNewChapterVideoFile(e.target.files?.[0] || null)
                }
                style={{ marginBottom: "15px" }}
              />
              {uploadProgress > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Upload Progress: {uploadProgress}%
                </Typography>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setIsAddChapterModalOpen((prev) => ({
                      ...prev,
                      [module.moduleId]: false,
                    }));
                    setSelectedModuleId(null); // Clear selected module on close
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddChapter()}
                >
                  Add Chapter
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;
