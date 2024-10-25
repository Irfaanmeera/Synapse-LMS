import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import {Roles} from '../interfaces/Roles'
import AdminLogin from '../components/auth/adminLogin'
import Profile from "../pages/student/Profile";
import Dashboard from '../pages/instructor/Dashboard'
import InstructorLayout from '../pages/instructor/InstructorLayout'
import InstructorProfile from '../pages/instructor/InstructorProfile'
import Settings from "../pages/instructor/Settings";
import Course from  '../pages/student/Course'
import CreateCourse from "../components/instructor/CreateCourse";
import CourseDisplay from "../components/instructor/CourseCard";

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
              <VerifyOtpLazy isInstructor={false} />
            </Suspense>
          }
        ></Route>
        {/* <Route
        path="/courses"
        element={<Course/>} 
        />
           */}

     
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
              <VerifyOtpLazy isInstructor={true} />
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
          path="myCourses"
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
        <Route path="createCourse" element={<CreateCourse />} />
      </Route>
      <Route path="/courses" element={<Course />}/>
      
    </Routes>
    </>
  );
};

export default RoutePage;