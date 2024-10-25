import express, { Router } from 'express'
import { InstructorController } from '../controllers/instructorController'
import {isInstructorAuth} from '../middlewares/currentUser'
import {upload} from '../middlewares/multer'

const instructorRouter: Router = express.Router()

const instructorController = new InstructorController()


instructorRouter.post('/signup', instructorController.signup);
instructorRouter.post("/resendOtp", instructorController.resendOtp);
instructorRouter.post("/verifyOtp", instructorController.verifyOtp);
instructorRouter.post("/login", instructorController.login);

instructorRouter.put('/updateInstructor',isInstructorAuth, instructorController.updateInstructor)
instructorRouter.put("/updateImage",isInstructorAuth,upload.single("image"),instructorController.updateImage);

instructorRouter.get("/myCourses", isInstructorAuth, instructorController.getMycourses);
instructorRouter.get("/course/:courseId",isInstructorAuth,instructorController.getSingleCourse);
instructorRouter.post("/addCourse",upload.single("image"),isInstructorAuth,instructorController.createCourse);
instructorRouter.put("/updateCourse", isInstructorAuth, instructorController.updateCourse);
instructorRouter.patch("/deleteCourse",isInstructorAuth,instructorController.deleteCourse);
// instructorRouter.put("/addCourseImage",upload.single("image"),instructorController.updateCourseImage);
instructorRouter.get('/categories',isInstructorAuth, instructorController.getCategories)

export default instructorRouter;