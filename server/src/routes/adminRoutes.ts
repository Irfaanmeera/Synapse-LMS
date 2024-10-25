import express, {Router} from'express'
import { AdminController } from '../controllers/adminController'


const adminRouter:Router = express.Router()

const adminController = new AdminController()

adminRouter.post('/login', adminController.login)
adminRouter.post('/addCategory', adminController.addCategory)

export default adminRouter;
