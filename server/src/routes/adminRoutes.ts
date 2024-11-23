import express, {Router} from'express'
import { AdminController } from '../controllers/adminController'
import { isAdminAuth } from '../middlewares/currentUser'


const adminRouter:Router = express.Router()

const adminController = new AdminController()

adminRouter.post('/login', adminController.login)
adminRouter.get("/categories", isAdminAuth, adminController.getAllCategories);
adminRouter.post('/addCategory', adminController.addCategory)
adminRouter.put("/category", isAdminAuth, adminController.editCategory);
adminRouter.patch("/listCategory", isAdminAuth, adminController.listCategory);
adminRouter.patch("/unlistCategory", isAdminAuth, adminController.unlistCategory);
adminRouter.get("/getStudents", isAdminAuth, adminController.getAllStudents);
adminRouter.get("/getInstructors", isAdminAuth, adminController.getAllInstructors);
adminRouter.patch("/blockStudent", isAdminAuth, adminController.blockStudent);
adminRouter.patch("/unblockStudent", isAdminAuth, adminController.unblockStudent);
adminRouter.patch("/blockInstructor", isAdminAuth, adminController.blockInstructor);
adminRouter.patch("/unblockInstructor",isAdminAuth,adminController.unblockInstructor);
adminRouter.get('/courses', isAdminAuth, adminController.getCoursesByAdmin)
adminRouter.patch("/courseApproval", isAdminAuth, adminController.approveCourse);
adminRouter.get("/course/:courseId", isAdminAuth, adminController.getSingleCourse);
adminRouter.get('/dashboard',isAdminAuth, adminController.adminDashBoard)
adminRouter.get('/salesData',isAdminAuth, adminController.getRevenueChartData)
adminRouter.get('/enrolledCourses',isAdminAuth,adminController.getEnrolledCoursesByAdmin)


export default adminRouter;
