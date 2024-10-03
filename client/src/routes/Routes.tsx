import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
const StudentHomeLazy = React.lazy(() => import('../pages/student/StudentHome'))
const VerifyOtpLazy = React.lazy(()=>import ('../pages/student/VerifyOtp'))

const RoutePage = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Suspense fallback={<div className="spinner-container">
                    <ClipLoader color="#00008b" size={40} />
                </div>}>
                    <StudentHomeLazy />
                </Suspense>} >
                </Route>
                <Route path='/verifyOtp' element={<Suspense fallback={<div className="spinner-container">
                    <ClipLoader color="#00008b" size={40} />
                </div>}>
                    <VerifyOtpLazy  isInstructor={false}/>
                </Suspense>} >
                </Route>

            </Routes>
        </>
    )
}

export default RoutePage;




