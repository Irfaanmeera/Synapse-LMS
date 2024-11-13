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

instructorRouter.post("/verify-forgot-password-otp",instructorController.forgotPasswordOtpVerification);
instructorRouter.post("/forgot-password", instructorController.resetForgottedPassword);

instructorRouter.get("/myCourses", isInstructorAuth, instructorController.getMycourses);
instructorRouter.get("/course/:courseId",isInstructorAuth,instructorController.getSingleCourse);
instructorRouter.post("/addCourse",upload.single("image"),isInstructorAuth,instructorController.createCourse);
instructorRouter.put("/updateCourse/:courseId",upload.single("image"),isInstructorAuth,instructorController.updateCourse);
instructorRouter.patch("/deleteCourse/:courseId",isInstructorAuth,instructorController.deleteCourse);
instructorRouter.patch("/listCourse/:courseId",isInstructorAuth,instructorController.listCourse);
instructorRouter.get('/categories',isInstructorAuth, instructorController.getCategories)

instructorRouter.post( "/createModule", isInstructorAuth,instructorController.createModule);
instructorRouter.put('/modules/:moduleId', isInstructorAuth,instructorController.updateModule);
instructorRouter.delete('/modules/:moduleId', isInstructorAuth, instructorController.deleteModule);
instructorRouter.post('/modules/:moduleId/addChapter', upload.single('video'), isInstructorAuth, instructorController.addChapter);
instructorRouter.get('/getEnrolledStudents', isInstructorAuth, instructorController.getEnrolledCoursesByInstructor)

export default instructorRouter;