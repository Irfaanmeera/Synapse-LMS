import express, { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { isAdminAuth } from "../middlewares/currentUser";
import { AdminRepository, CategoryRepository, StudentRepository, InstructorRepository, CourseRepository, EnrolledCourseRepository } from "../repositories";
import { AdminService } from "../services/adminService";

const adminRouter: Router = express.Router();

const adminRepository = new AdminRepository();
const categoryRepository = new CategoryRepository();
const studentRepository = new StudentRepository();
const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const enrolledCourseRepository = new EnrolledCourseRepository();

const adminService = new AdminService(
  adminRepository,
  categoryRepository,
  studentRepository,
  instructorRepository,
  courseRepository,
  enrolledCourseRepository
);

const adminController = new AdminController(adminService);

adminRouter.post('/login', (req, res, next) => adminController.login(req, res, next));
adminRouter.get("/categories", isAdminAuth, (req, res, next) => adminController.getAllCategories(req, res, next));
adminRouter.post('/addCategory', (req, res, next) => adminController.addCategory(req, res, next));
adminRouter.put("/category", isAdminAuth, (req, res, next) => adminController.editCategory(req, res, next));
adminRouter.patch("/listCategory", isAdminAuth, (req, res, next) => adminController.listCategory(req, res, next));
adminRouter.patch("/unlistCategory", isAdminAuth, (req, res, next) => adminController.unlistCategory(req, res, next));
adminRouter.get("/getStudents", isAdminAuth, (req, res, next) => adminController.getAllStudents(req, res, next));
adminRouter.get("/getInstructors", isAdminAuth, (req, res, next) => adminController.getAllInstructors(req, res, next));
adminRouter.patch("/blockStudent", isAdminAuth, (req, res, next) => adminController.blockStudent(req, res, next));
adminRouter.patch("/unblockStudent", isAdminAuth, (req, res, next) => adminController.unblockStudent(req, res, next));
adminRouter.patch("/blockInstructor", isAdminAuth, (req, res, next) => adminController.blockInstructor(req, res, next));
adminRouter.patch("/unblockInstructor", isAdminAuth, (req, res, next) => adminController.unblockInstructor(req, res, next));
adminRouter.get('/courses', isAdminAuth, (req, res, next) => adminController.getCoursesByAdmin(req, res, next));
adminRouter.patch("/courseApproval", isAdminAuth, (req, res, next) => adminController.approveCourse(req, res, next));
adminRouter.get("/course/:courseId", isAdminAuth, (req, res, next) => adminController.getSingleCourse(req, res, next));
adminRouter.get('/dashboard', isAdminAuth, (req, res, next) => adminController.adminDashBoard(req, res, next));
adminRouter.get('/salesData', isAdminAuth, (req, res, next) => adminController.getRevenueChartData(req, res, next));
adminRouter.get('/enrolledCourses', isAdminAuth, (req, res, next) => adminController.getEnrolledCoursesByAdmin(req, res, next));

export default adminRouter;
