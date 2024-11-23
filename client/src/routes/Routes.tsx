import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import AuthProtected from "../components/Common/protectedRoutes/AuthProtectedRoles";
import { Roles } from "../interfaces/Roles";
import AdminLogin from "../components/auth/adminLogin";
import Profile from "../pages/student/Profile";
import Dashboard from "../pages/instructor/Dashboard";
import InstructorLayout from "../pages/instructor/InstructorLayout";
import InstructorProfile from "../pages/instructor/InstructorProfile";
import Settings from "../pages/instructor/Settings";
import Course from "../pages/student/Course";
import CreateCourse from "../components/instructor/Course/CreateCourse";
import CourseDisplay from "../components/instructor/Course/CourseCard";
import CourseDetails from "../components/instructor/Course/CourseDetails";
import Error404 from "../components/Common/errorPages/Error404";
import UpdateCourse from "../components/instructor/Course/UpdateCourse";
import StudentForgotPassword from "../pages/student/StudentForgotPassword";
import EnterMailForgotPasswordForm from "../components/auth/EnterEmailPassword";
import VerifyOtp from "../pages/student/VerifyOtp";
import InstructorEnterMailForgotPassword from "../pages/instructor/InstructorEnterEmailForgotpassword";
import InstructorForgotPassword from "../pages/instructor/InstructorForgotPassword";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";
import StripeStatus from "../pages/student/StripeStatus";
import MyLearning from "../pages/student/MyLearning";
import SingleEnrolledCoursePage from "../pages/student/SingleEnrolledCourse";
import StudentManagement from "../pages/instructor/StudentManagement";
import SingleChat from "../components/instructor/Chat/SingleChat";
import AdminLayout from "../pages/admin/AdminLayout.tsx";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";
import StudentList from "../components/admin/StudentManagement/StudentList.tsx";
import InstructorList from "../components/admin/InstructorManagement/InstructorList.tsx";
import AdminCourses from "../components/admin/CourseManagement/CourseList.tsx";
import SingleCourseViewAdmin from "../components/admin/CourseManagement/SingleCourse.tsx";
import WalletTransactions from "../components/instructor/Wallet/Transactions.tsx";
import Enrollments from "../components/admin/EnrolledCourses/Enrollments.tsx";
import AdminCategories from "../components/admin/CategoryManagement/category.tsx";

const StudentHomeLazy = React.lazy(() => import("../pages/student/StudentHome"));
const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));


const RoutePage = () => {
  return (
    <Suspense
      fallback={
        <div className="spinner-container">
          <ClipLoader color="#00008b" size={40} />
        </div>
      }
    >
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentHomeLazy />} />
        <Route path="/verifyOtp" element={<VerifyOtpLazy isForgotPassword={true} isInstructor={false} />} />
        <Route path="/update-forgot-password" element={<AuthProtected element={<StudentForgotPassword />} />} />
        <Route path="/forgot-password" element={<AuthProtected element={<EnterMailForgotPasswordForm isInstructor={false} />} />} />
        <Route path="/forgot-password-otp-verfication" element={<AuthProtected element={<VerifyOtp isForgotPassword={true} isInstructor={false} />} />} />
        <Route path="/status" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<StripeStatus />} />} />
        <Route path="/myLearning" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<MyLearning />} />} />
        <Route path="/singleEnrolledCourse/:courseId" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<SingleEnrolledCoursePage />} />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/courseDetails/:courseId" element={<StudentCourseDetails />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<Profile />} />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<ProtectedRoute element={<InstructorLayout />}/>}>
          <Route index element={<ProtectedRoute element={<Dashboard />} />}  />
          <Route path="forgot-password" element={<AuthProtected element={<InstructorEnterMailForgotPassword />} />} />
          <Route path="forgot-password-otp-verfication" element={<AuthProtected element={<VerifyOtp isForgotPassword={true} isInstructor={true} />} />} />
          <Route path="update-forgot-password" element={<AuthProtected element={<InstructorForgotPassword />} />} />
          <Route path="instructorProfile" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<InstructorProfile />} />} />
          <Route path="courses" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDisplay />} />} />
          <Route path="settings" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<Settings />} />} />
          <Route path="createCourse" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CreateCourse />} />} />
          <Route path="courseDetails/:courseId" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDetails />} />} />
          <Route path="updateCourse/:courseId" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<UpdateCourse />} />} />
          <Route path="chat" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<StudentManagement />} />} />
          <Route path="singleChat" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<SingleChat />} />} />
          <Route path="studentDetails" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<StudentManagement />} />} />
          <Route path="transactions" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={< WalletTransactions/>} />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="studentDetails" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<StudentList />} />} />
          <Route path="instructors" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<InstructorList />} />} />
          <Route path="categories" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCategories />} />} />
          <Route path="courses" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCourses />} />} />
          <Route path="course/:courseId" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<SingleCourseViewAdmin />} />} />
          <Route path="enrollments" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<Enrollments />} />} />
        </Route>

        {/* Error Routes */}
        <Route path="error404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default RoutePage;
