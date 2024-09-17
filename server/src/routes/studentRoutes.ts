import express,{Router, Request, Response} from 'express'
import StudentController from '../controllers/studentController'
import { StudentRepository } from '../repositories/implements/studentRepository'
import { StudentService } from '../services/implements/studentService'
import Encrypt from '../utils/comparePassword'
import { CreateJWT } from '../utils/generateToken'

const studentRouter:Router = express.Router()

const encrypt = new Encrypt()
const createJwt = new CreateJWT()
const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository,encrypt,createJwt)
const controller = new StudentController(studentService)


studentRouter.post('/signup', async (req: Request, res: Response) => await controller.signup(req, res));