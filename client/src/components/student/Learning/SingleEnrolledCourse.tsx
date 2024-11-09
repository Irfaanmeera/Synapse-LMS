import React, { useEffect, useState } from 'react';
import { PlayCircle, X, Globe } from 'lucide-react';
import { addProgression, getEnrolledCourse, getTotalChapterCountByCourseId } from '../../../api/studentApi';
import { useParams } from 'react-router-dom';
import { EnrolledCourse } from '../../../interfaces/enrolledCourse';
import ModuleContent from './Module';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import { enrolledCourseActions } from '../../../redux/enrolledCourseSlice';

const SingleEnrolledCourse = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null); // State for video URL
  const [currentChapterName, setCurrentChapterName] = useState<string | null>(null);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // Load completed chapters from localStorage on mount
  useEffect(() => {
    const storedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
    setCompletedChapters(storedChapters);
  }, []);

  const fetchCourse = async () => {
    if (!courseId) {
      console.error("Course ID is undefined.");
      return;
    }
    try {

      console.log("course id in seingle course:", courseId)
      const enrolledCourse = await getEnrolledCourse(courseId);

      console.log("Enrolled Course in single enrolled course:" , enrolledCourse)
      setCourse(enrolledCourse);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    
  }, [courseId]);
  
  

  const handleVideoSelect = (videoUrl: string,currentChapterName:string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentChapterName(currentChapterName)

  };
  // const handleCompleti = async (moduleId: string) => {
  //   // Dispatch action to add module to progression
  //   dispatch(enrolledCourseActions.addModule(moduleId));

  //   // Find the index of the current module to get the next one in sequence
  //   // const completedIndex = course?.courseId?.modules.findIndex((mod) => mod.id === moduleId);
  //   // if (completedIndex !== undefined && completedIndex !== -1) {
  //   //   const nextModule = course?.courseId?.modules[completedIndex + 1];
  //   //   if (nextModule) {
  //   //     setCurrentVideoUrl(nextModule.videoUrl);
  //   //   }
  //   // }
  // };
  const handleVideoComplete = async (chapterTitle: string) => {
    // Call the API to add progression
    const enrolledCourseId = course!.id;
    try {
      console.log("Request Payload:", { enrolledCourseId, chapterTitle });
      await addProgression(enrolledCourseId!, chapterTitle); // Assuming `addProgression` API requires courseId and chapterTitle
      dispatch(enrolledCourseActions.addChapterToProgression(chapterTitle)); 

    // Sync with localStorage for persistence across page reloads
    const updatedCompletedChapters = [...completedChapters, chapterTitle];
    console.log("Updated chapter:", updatedCompletedChapters);
    localStorage.setItem('completedChapters', JSON.stringify(updatedCompletedChapters));

    } catch (err) {
      console.error('Error marking chapter as completed:', err);
    }
  };

  useEffect(() => {
    // Check localStorage for completed chapters and sync with Redux
    const savedCompletedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
    dispatch(enrolledCourseActions.setCompletedChapters(savedCompletedChapters));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1">
      <div
  className="relative bg-gray-blue border-2 border-gray w-11/12 aspect-video"
  style={{
    backgroundImage: currentVideoUrl ? "none" : `url(${course?.courseId?.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

  {currentVideoUrl ? (
    <ReactPlayer
      url={currentVideoUrl}
      controls
      width="100%"
      onEnded={() => handleVideoComplete(currentChapterName!)}
      config={{
        file: { attributes: { controlsList: "nodownload" } }, // For direct video sources
      }}
      
    />
  ) : (
    <button className="absolute inset-0 m-auto w-20 h-20 text-black opacity-20 hover:opacity-100">
      <PlayCircle className="w-full h-full" />
    </button>
  )}
  {currentChapterName && (
    <div className="absolute mt-2 left-2 text-darkgray font-bold font-serif text-lg px-4 py-1 rounded-md">
      {currentChapterName}
    </div>
  )}
</div>


        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-blue">
          <div className="max-w-5xl mx-auto">
            <div className="flex space-x-8 px-4">
              {['Overview', 'Notes', 'Announcements', 'Reviews', 'Learning tools'].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-2 border-b-2 ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue text-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-2xl font-medium mb-6">{course?.courseId?.name}</h1>
          <div className="text-gray-600">{course?.courseId?.enrolled} Students</div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div>Last updated April 2020</div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                English
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-100 bg-white border-l border-gray-blue">
        <div className="flexitems-center p-4 border-b">
          <h2 className="font-bold">Course content</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] ">
          {course?.courseId?.modules?.map((module) => (
            <ModuleContent key={module.id} module={module} onVideoSelect={handleVideoSelect}  onVideoComplete={handleVideoComplete}  />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleEnrolledCourse;
