import express, { Router } from 'express'
import { InstructorController } from '../controllers/instructorController'


const instructorRouter: Router = express.Router()

const instructorController = new InstructorController()


instructorRouter.post('/signup', instructorController.signup);
instructorRouter.post("/resendOtp", instructorController.resendOtp);
instructorRouter.post("/verifyOtp", instructorController.verifyOtp);
instructorRouter.post("/login", instructorController.login);

export default instructorRouter;