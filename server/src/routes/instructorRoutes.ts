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
export default instructorRouter;