import express, { Router } from 'express';
import { InstructorController } from '../controllers/instructorController';
import { isInstructorAuth } from '../middlewares/currentUser';
import { upload } from '../middlewares/multer';
import { InstructorRepository, CourseRepository, CategoryRepository, ModuleRepository, EnrolledCourseRepository } from '../repositories';
import { InstructorService } from '../services/instructorService';

const instructorRouter: Router = express.Router();

const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const moduleRepository = new ModuleRepository();
const enrolledCourseRepository = new EnrolledCourseRepository();

const instructorService = new InstructorService(
  instructorRepository,
  courseRepository,
  categoryRepository,
  moduleRepository,
  enrolledCourseRepository
);

const instructorController = new InstructorController(instructorService);

/* Authentication Routes */
instructorRouter.post('/signup', (req, res, next) => instructorController.signup(req, res, next));
instructorRouter.post('/resendOtp', (req, res) => instructorController.resendOtp(req, res));
instructorRouter.post('/verifyOtp', (req, res) => instructorController.verifyOtp(req, res));
instructorRouter.post('/login', (req, res, next) => instructorController.login(req, res, next));
instructorRouter.post('/verify-forgot-password-otp', (req, res, next) => instructorController.forgotPasswordOtpVerification(req, res, next));
instructorRouter.post('/forgot-password', (req, res, next) => instructorController.resetForgottedPassword(req, res, next));

/* User Profile Routes */
instructorRouter.put('/updateInstructor', isInstructorAuth, (req, res, next) => instructorController.updateInstructor(req, res, next));
instructorRouter.put('/updateImage', isInstructorAuth, upload.single('image'), (req, res, next) => instructorController.updateImage(req, res, next));

/* Courses and Categories Routes */
instructorRouter.get('/myCourses', isInstructorAuth, (req, res, next) => instructorController.getMycourses(req, res, next));
instructorRouter.get('/course/:courseId', isInstructorAuth, (req, res, next) => instructorController.getSingleCourse(req, res, next));
instructorRouter.post('/addCourse', upload.single('image'), isInstructorAuth, (req, res) => instructorController.createCourse(req, res));
instructorRouter.put('/updateCourse/:courseId', upload.single('image'), isInstructorAuth, (req, res, next) => instructorController.updateCourse(req, res, next));
instructorRouter.patch('/deleteCourse/:courseId', isInstructorAuth, (req, res, next) => instructorController.deleteCourse(req, res, next));
instructorRouter.patch('/listCourse/:courseId', isInstructorAuth, (req, res, next) => instructorController.listCourse(req, res, next));
instructorRouter.get('/categories', isInstructorAuth, (req, res, next) => instructorController.getCategories(req, res, next));
instructorRouter.post('/createModule', isInstructorAuth, (req, res, next) => instructorController.createModule(req, res, next));
instructorRouter.put('/modules/:moduleId', isInstructorAuth, (req, res, next) => instructorController.updateModule(req, res, next));
instructorRouter.delete('/modules/:moduleId', isInstructorAuth, (req, res, next) => instructorController.deleteModule(req, res, next));
instructorRouter.post('/modules/:moduleId/addChapter', upload.single('video'), isInstructorAuth, (req, res, next) => instructorController.addChapter(req, res, next));

instructorRouter.get('/getEnrolledStudents', isInstructorAuth, (req, res, next) => instructorController.getEnrolledCoursesByInstructor(req, res, next));

export default instructorRouter;
