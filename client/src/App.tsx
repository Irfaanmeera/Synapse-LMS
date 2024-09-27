
import './App.css'
import Banner from './components/User/Home/Banner'
import Navbarin from './components/User/Common/Navbar'
import Courses from './components/User/Home/Courses'
import Companies from './components/User/Home/Companies/Companies'
import Mentor from './components/User/Home/Mentor'
import Testimonials from './components/User/Home/Testimonials/index'
import Footer from './components/User/Common/Footer/Footer'

function App() {
  

  return (
    <>
    <Navbarin/>
      <Banner/>
      <Companies/>
      <Courses/>
      <Mentor/>
      <Testimonials/>
      <Footer/>
    </>
  )
}

export default App
