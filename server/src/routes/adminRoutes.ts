import express, {Router} from'express'
import { AdminController } from '../controllers/adminController'
import { isAdminAuth } from '../middlewares/currentUser'


const adminRouter:Router = express.Router()

const adminController = new AdminController()

adminRouter.post('/login', adminController.login)
adminRouter.post('/addCategory', adminController.addCategory)
adminRouter.get("/getStudents", isAdminAuth, adminController.getAllStudents);
adminRouter.get("/getInstructors", isAdminAuth, adminController.getAllInstructors);
adminRouter.patch("/blockStudent", isAdminAuth, adminController.blockStudent);
adminRouter.patch("/unblockStudent", isAdminAuth, adminController.unblockStudent);
adminRouter.patch("/blockInstructor", isAdminAuth, adminController.blockInstructor);
adminRouter.patch("/unblockInstructor",isAdminAuth,adminController.unblockInstructor);

export default adminRouter;
