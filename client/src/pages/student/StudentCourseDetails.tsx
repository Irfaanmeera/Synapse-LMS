import React from 'react'
import Navbarin from '../../components/student/Common/Navbar'
import Footer from '../../components/student/Common/Footer/Footer'
import CourseDetails1 from '../../components/student/Courses/CourseDetails1'


const StudentCourseDetails: React.FC= () => {

  return (
    <>
      <Navbarin/>
      {/* <ResponsiveAppBar/> */}
      <CourseDetails1/>
      <Footer/>
    </>
  )
}

export default StudentCourseDetails;