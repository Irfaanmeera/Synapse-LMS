import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import AuthProtected from "../components/Common/protectedRoutes/AuthProtectedRoles";
import {Roles} from '../interfaces/Roles'
import AdminLogin from '../components/auth/adminLogin'
import Profile from "../pages/student/Profile";
import Dashboard from '../pages/instructor/Dashboard'
import InstructorLayout from '../pages/instructor/InstructorLayout'
import InstructorProfile from '../pages/instructor/InstructorProfile'
import Settings from "../pages/instructor/Settings";
import Course from  '../pages/student/Course'
import CreateCourse from "../components/instructor/Course/CreateCourse";
import CourseDisplay from "../components/instructor/Course/CourseCard";
import CourseDetails from "../components/instructor/Course/CourseDetails";
// import StudentCourseDetails from "../pages/student/StudentCourseDetails";
import Error404 from "../components/Common/errorPages/Error404";
import UpdateCourse from "../components/instructor/Course/UpdateCourse";
import StudentForgotPassword from "../pages/student/StudentForgotPassword";
import EnterMailForgotPasswordForm from "../components/auth/EnterEmailPassword";
import VerifyOtp from "../pages/student/VerifyOtp";
import InstructorEnterMailForgotPassword from "../pages/instructor/InstructorEnterEmailForgotpassword";
import InstructorForgotPassword from "../pages/instructor/InstructorForgotPassword";
// import StudentViewCourseDetailsPage from "../pages/student/StudentViewCourseDetails";
// import StudentCourseDetails from "../pages/student/StudentCourseDetails";
// import StudentViewCourseDetail from "../pages/student/StudentViewCourseDetails";
// import CourseDetailsPage from "../pages/student/courseDetails/CourseDetailsPage";
// import CourseDetailsStudent from "../components/student/Courses/CourseDetailsStudent";
// import CourseDetailsPage from "../pages/student/courseDetails/CourseDetailsPage";
// import CourseView from "../components/student/Courses/CourseView";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";
// import CourseDetails1 from "../components/student/Courses/CourseDetails1";
// import StudentViewCourseDetail from "../pages/student/StudentViewCourseDetails";
import StripeStatus from "../pages/student/StripeStatus";
import MyLearning from "../pages/student/MyLearning";
import SingleEnrolledCoursePage from "../pages/student/SingleEnrolledCourse";


// import CourseCard from "../components/student/Courses/CourseCard";


const StudentHomeLazy = React.lazy(
  () => import("../pages/student/StudentHome")
);

const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));

const AdminHomeLazy = React.lazy(
  () => import("../pages/admin/AdminHome")
);




const RoutePage = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div className="spinner-container">
                  <ClipLoader color="#00008b" size={40} />
                </div>
              }
            >
              <StudentHomeLazy />
            </Suspense>
          }
        ></Route>
        <Route
          path="/verifyOtp"
          element={
            <Suspense
              fallback={
                <div className="spinner-container">
                  <ClipLoader color="#00008b" size={40} />
                </div>
              }
            >
              <VerifyOtpLazy isForgotPassword={true} isInstructor={false} />
            </Suspense>
          }
        ></Route>
        
        <Route
          path="/update-forgot-password"
          element={<AuthProtected element={<StudentForgotPassword/>} />}
          />
<Route
          path="/forgot-password"
          element={<AuthProtected element={<EnterMailForgotPasswordForm isInstructor={false} />} />}
        />

        <Route
          path="/forgot-password-otp-verfication"
          element={
            <AuthProtected
              element={
                <VerifyOtp isForgotPassword={true} isInstructor={false} />
              }
            />
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.student]}
              element={<StripeStatus />}
            />
          }
        />
        <Route
          path="/myLearning"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.student]}
              element={<MyLearning />}
            />
          }
        />
        <Route
          path="/singleEnrolledCourse/:courseId"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.student]}
              element={<SingleEnrolledCoursePage/>}
            />
          }
        />

       
        <Route
        path="/courses"
        element={<Course/>} 
        />
        <Route
        path="/courseDetails/:courseId"
        element ={<StudentCourseDetails/>}
        />
          
          <Route
          path="/instructor/forgot-password"
          element={
            <AuthProtected element={<InstructorEnterMailForgotPassword />} />
          }
        />
        <Route
          path="/instructor/forgot-password-otp-verfication"
          element={
            <AuthProtected
              element={
                <VerifyOtp isForgotPassword={true} isInstructor={true} />
              }
            />
          }
        />
        <Route
          path="/instructor/update-forgot-password"
          element={<AuthProtected element={<InstructorForgotPassword />} />}
        />
     
        <Route
          path="instructor/verifyOtp"
         
          element={
            <Suspense
              fallback={
                <div className="spinner-container">
                  <ClipLoader color="#00008b" size={40} />
                </div>
              }
            >
              <VerifyOtpLazy isForgotPassword={true} isInstructor={true} />
            </Suspense>
          }
        ></Route>

        <Route
          path="/admin"
          
         element={
          <ProtectedRoute
              allowedRoles={[Roles.admin]}
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <ClipLoader color="#00008b" size={40} />
                    </div>
                  }

                >
                  <AdminHomeLazy />
                </Suspense>
              }
              />
            }
              >
          </Route>
          <Route
          path="/admin/login"
          element={<AdminLogin/>} 
        />
        <Route path="/profile"
         element={
          <ProtectedRoute
            allowedRoles={[Roles.student]}
            element={<Profile/>}
          />
        }
        />
       
      </Routes>


      
      <Routes>

      {/* Define the layout route */}
      <Route path="/instructor" element={<InstructorLayout />}>
        {/* Nested routes inside InstructorLayout */}

        {/* Dashboard as default route */}
        <Route index element={<Dashboard />} />
        

        {/* Instructor Profile route */}
        <Route
          path="instructorProfile"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.instructor]}
              element={<InstructorProfile/>}
            />
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.instructor]}
              element={<CourseDisplay/>}
            />
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.instructor]}
              element={<Settings/>}
            />
          }
        />
        <Route
          path="createCourse"
          element={
            <ProtectedRoute
              allowedRoles={[Roles.instructor]}
              element={<CreateCourse/>}
            />
          }
        />
      
        <Route
  path="courseDetails/:courseId"
  element={
    <ProtectedRoute
      allowedRoles={[Roles.instructor]}
      element={<CourseDetails/>}
    />
  }
/>
        <Route
  path="updateCourse/:courseId"
  element={
    <ProtectedRoute
      allowedRoles={[Roles.instructor]}
      element={<UpdateCourse/>}
    />
  }
/>
      </Route>
     
      <Route path="error404/" element={<Error404 />} />
      <Route path="*" element={<Error404 />} />
      
    </Routes>
    </>
  );
};

export default RoutePage;