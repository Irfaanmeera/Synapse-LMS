import express, { Router } from 'express'
import { StudentController } from '../controllers/studentController'


const studentRouter: Router = express.Router()

const studentController = new StudentController()


studentRouter.post('/signup', studentController.signup);
studentRouter.post("/resendOtp", studentController.resendOtp);
studentRouter.post("/verifyOtp", studentController.verifyOtp);
studentRouter.post("/login", studentController.login);
studentRouter.post('/google-login',studentController.googleLogin);

export default studentRouter;