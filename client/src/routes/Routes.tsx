import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import {Roles} from '../interfaces/Roles'

const StudentHomeLazy = React.lazy(
  () => import("../pages/student/StudentHome")
);
const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));
const InstructorHomeLazy = React.lazy(
  () => import("../pages/instructor/InstructorHome")
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
          path="/instructor"
          
         element={
          <ProtectedRoute
              allowedRoles={[Roles.instructor]}
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <ClipLoader color="#00008b" size={40} />
                    </div>
                  }

                >
                  <InstructorHomeLazy />
                </Suspense>
              }
              />
            }
              >
          </Route>
       
      </Routes>
    </>
  );
};

export default RoutePage;