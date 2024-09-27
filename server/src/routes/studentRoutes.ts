import express,{Router} from 'express'
import {StudentController} from '../controllers/studentController'



const studentRouter:Router = express.Router()



const studentController = new StudentController()


studentRouter.post('/signup', studentController.signup);

export default studentRouter;