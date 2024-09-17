
import './App.css'
import Banner from './components/Banner'
import Navbarin from './components/Navbar'
import Courses from './components/Courses'
import Companies from './components/Companies/Companies'
import Mentor from './components/Mentor'
import Testimonials from './components/Testimonials/index'
import Footer from './components/Footer/Footer'

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
