import express, { Router } from 'express'
import { StudentController } from '../controllers/studentController'
import {isStudentAuth} from '../middlewares/currentUser'
import {upload} from '../middlewares/multer'


const studentRouter: Router = express.Router()

const studentController = new StudentController()


studentRouter.post('/signup', studentController.signup);
studentRouter.post("/resendOtp", studentController.resendOtp);
studentRouter.post("/verifyOtp", studentController.verifyOtp);
studentRouter.post("/login", studentController.login);
studentRouter.post('/google-login',studentController.googleLogin);

studentRouter.put('/updateUser',isStudentAuth, studentController.updateUser)
studentRouter.put("/updateImage",isStudentAuth,upload.single("image"),studentController.updateImage);

export default studentRouter;