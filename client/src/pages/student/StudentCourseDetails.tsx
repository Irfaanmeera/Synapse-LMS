import React from 'react'
import Navbarin from '../../components/student/Common/Navbar'
import Footer from '../../components/student/Common/Footer/Footer'
import CourseView from '../../components/student/Courses/CourseView'


const StudentCourseDetails: React.FC= () => {

  return (
    <>
      <Navbarin/>
      {/* <ResponsiveAppBar/> */}
      <CourseView/>
      <Footer/>
    </>
  )
}

export default StudentCourseDetails;