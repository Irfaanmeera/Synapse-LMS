import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LearningCard from './LearningCard';
import { getAllEnrolledCourse } from '../../../api/studentApi'; // Assuming this is your API method
import { EnrolledCourse } from '../../../interfaces/enrolledCourse';
import toast from 'react-hot-toast';


const LearningPlatform = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate()

  const fetchCourses = async () => {
    try {
      const enrolledCourses = await getAllEnrolledCourse();
      console.log(enrolledCourses)
      setEnrolledCourses(enrolledCourses); // Update state with fetched courses
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when data is fetched or error occurs
    }
  };
  // const fetchCourses = async () => {
  //   try {
  //     const enrolledCourses = await getAllEnrolledCourse();
  //     console.log(enrolledCourses);
  //     setEnrolledCourses(enrolledCourses); // Update state with fetched courses
  //   } catch (err) {
  //     console.error('Error fetching enrolled courses:', err);
  
  //     // Check if the error response contains a message from the backend
  //     if (err.response && err.response.data && err.response.data.message) {
  //       if (err.response.data.message === "Invalid refresh token") {
  //         // Handle refresh token error (maybe redirect to login page)
  //         toast.error("Your session has expired. Please log in again.");
  //         // Optionally, redirect to the login page:
  //       navigate('/')
  //       } else {
  //         toast.error(err.response.data.message); // Show other errors
  //       }
  //     } else {
  //       toast.error('Failed to load courses. Please try again later.');
  //     }
  //   } finally {
  //     setLoading(false); // Set loading to false when data is fetched or error occurs
  //   }
  // };
  

  useEffect(() => {
    fetchCourses(); // Fetch the courses when the component mounts
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mt-5 mb-6" style={{ padding: '16px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="" color="inherit">
              Home
            </Link>
            <Link to="" color="primary">
              My Learnings
            </Link>
          </Breadcrumbs>
        </div>

        {/* Show loading state */}
        {loading && <div>Loading courses...</div>}

        {/* Show error message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Display courses if data is available */}
        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 mt-10">
          {enrolledCourses.map((enrolledCourse) => (
            <div key={enrolledCourse.id}>
              <LearningCard enrolledCourse={enrolledCourse} /> {/* Pass course data to LearningCard */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform;
