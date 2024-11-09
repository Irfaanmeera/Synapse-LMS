/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/implements/studentService';
import { OtpService } from '../services/implements/otpService';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import bcrypt from 'bcryptjs'
import { IStudent } from '../interfaces/student';
import jwt from "jsonwebtoken";
import { StudentRepository } from '../repositories/implements/studentRepository';
import { BadRequestError } from '../constants/errors/badrequestError';
import { InstructorRepository } from '../repositories/implements/instructorRepository';
import { CourseRepository } from '../repositories/implements/courseRepository';
import { CategoryRepository } from '../repositories/implements/categoryRepository';
import { EnrolledCourseRepository } from '../repositories/implements/enrolledCourseRepository';
import { ModuleRepository } from '../repositories/implements/moduleRepository';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES

const studentRepository = new StudentRepository();
const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const enrolledCourseRepository = new EnrolledCourseRepository()
const moduleRepository = new ModuleRepository()
const studentService = new StudentService(studentRepository,instructorRepository,courseRepository,categoryRepository,moduleRepository, enrolledCourseRepository );
const otpService = new OtpService();

export class StudentController {


  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {name, email, password, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const studentDetails: IStudent = {
        name,
        email,
        password: hashedPassword,
        mobile,
      };
      await studentService.signup(studentDetails);
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpMail(email, otp);
      res.status(201).json({ message: "OTP sent for verification...", email });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(error);
      } else {
        console.log("An unknown error occured");
      }
    }
  }



  async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body
      const otp = otpService.generateOtp()
      await otpService.createOtp({ email, otp })
      otpService.sendOtpMail(email, otp)
      res.status(OK).json({ success: true, message: 'OTP Resent' });
    } catch (error) {
      console.log(error as Error)
    }
  }
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const existingOtp = await otpService.findOtp(email)
      if (otp === existingOtp?.otp) {
        const student: IStudent = await studentService.verifyStudent(email)
        const token = jwt.sign(
          {
            studentId: student.id,
            role: "student",
          },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" } // Access token expires in 15 minutes
        );

        const refreshToken = jwt.sign(
          {
            studentId: student.id,
            role: "student",
          },
          process.env.JWT_REFRESH_SECRET!, // Make sure you have a separate secret for refresh tokens
          { expiresIn: "7d" } // Refresh token expires in 7 days
        );
        const studentData = {
          _id: student.id,
          name: student.name,
          email: student.email,
          mobile: student.mobile,
          wallet: student.wallet,
          courses: student.courses,
          image: student.image,
          role: "student",
        };

        res.status(200).json({
          message: "Student Verified",
          token, // Return access token
          refreshToken, // Return refresh token
          student: studentData,
        });
      } else {
        res.status(400).json({ message: "OTP Verification failed" });
      }
    } catch (error) {
      console.log(error as Error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const student: IStudent = await studentService.login(email);
      
      const validPassword = await bcrypt.compare(password, student.password!);
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      if (!student.isVerified) {
        const otp = otpService.generateOtp();
        await otpService.createOtp({ email, otp });
        otpService.sendOtpMail(email, otp);
        return res.status(400).json({ message: "Not verified" });
      }
  
      // If password is valid and student is verified
      const token = jwt.sign(
        { studentId: student.id, role: "student" },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );
  
      const refreshToken = jwt.sign(
        { studentId: student.id, role: "student" },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );
  
      const studentData = {
        _id: student.id,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        wallet: student.wallet,
        courses: student.courses,
        image: student.image,
        role: "student",
      };
  
      return res.status(200).json({
        message: "Student Verified",
        token, 
        refreshToken, 
        student: studentData,
      });
    } catch (error) {
      console.error(error);
      next(error); // Forward error to global error handler
    }
  }
  

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, email, googlePhotoUrl } = req.body;
        const accessTokenMaxAge = 5 * 60 * 1000;
        const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; 

        // Check if user already exists
        const student = await studentService.getUserByEmail(email);
        console.log(student)

        if (student) {
            // Generate access token and refresh token for existing user
            const token = jwt.sign(
                { studentId: student.id, role: "student" },
                process.env.JWT_SECRET!,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { studentId: student.id, role: "student" },
                process.env.JWT_REFRESH_SECRET!,
                { expiresIn: "7d" }
            );

            const studentData = {
                _id: student.id,
                name: student.name,
                email: student.email,
                mobile: student.mobile,
                wallet: student.wallet,
                courses: student.courses,
                image: student.image || googlePhotoUrl,
                role: "student",
            };

            res.status(OK).cookie('access_token', token, {
                maxAge: accessTokenMaxAge,
                httpOnly: true, // Ensure tokens are secure
            }).cookie('refresh_token', refreshToken, {
                maxAge: refreshTokenMaxAge,
                httpOnly: true,
            }).json({
                success: true,
                message: "Login Successful",
                token,
                refreshToken,
                student: studentData,
            });
            return;  // Exiting the function after sending the response
        } else {
            // If user does not exist, create a new user with a random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const newStudent: IStudent = {
                name,
                email,
                password: hashedPassword,
                mobile: '', // Can be updated later by the user
                image: googlePhotoUrl,
                wallet: 0,
                courses: [],
                isVerified: true, // Assuming Google login skips the OTP verification
            };

            const savedStudent = await studentService.signup(newStudent);
            console.log('Googlesigned User:'+ savedStudent)
            // Check if savedStudent is null
            if (!savedStudent) {
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create new student" });
                return; // Exiting the function after sending the response
            }

            // Generate tokens for the new student
            const token = jwt.sign(
                { studentId: savedStudent.id, role: "student" },
                process.env.JWT_SECRET!,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { studentId: savedStudent.id, role: "student" },
                process.env.JWT_REFRESH_SECRET!,
                { expiresIn: "7d" }
            );

            const studentData = {
                _id: savedStudent.id,
                name: savedStudent.name,
                email: savedStudent.email,
                mobile: savedStudent.mobile,
                wallet: savedStudent.wallet,
                courses: savedStudent.courses,
                image: savedStudent.image,
                role: "student",
            };

            res.status(OK).cookie('access_token', token, {
                maxAge: accessTokenMaxAge,
                httpOnly: true,
            }).cookie('refresh_token', refreshToken, {
                maxAge: refreshTokenMaxAge,
                httpOnly: true,
            }).json({
                success: true,
                message: "Google Login Successful, New Student Created",
                token,
                refreshToken,
                student: studentData,
            });
            return; // Exiting the function after sending the response
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        return; // Exiting the function after sending the error response
    }
}

   async updateUser(req:Request,res:Response,next:NextFunction){
  try{
    const id = req.currentUser;
    const {name,mobile} = req.body;
    const student = await studentService.updateStudent({id,name,mobile});
    res.status(200).json(student)
  }

    catch(error){
      console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        return; 
    }
  
   }

   async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const file = req.file;
      if (!id) {
        throw new BadRequestError("Id not found");
      }
      if (!file) {
        throw new BadRequestError("Image not found");
      }
      const student = await studentService.updateImage(id!, file);
      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.params;

      const pageNumber = Number(page);
  
      // Call the service function with the converted number
      const courses = await studentService.getAllCourses(pageNumber);
  
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async getAllCategories(req: Request, res: Response, next: NextFunction){
    try{
      const categories = await studentService.getAllCategories()
      res.status(200).json(categories)
    }catch(error){
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, currentPassword } = req.body;
      const studentId = req.currentUser;
      if (!studentId) {
        throw new Error("Invalid token");
      }
      const student: IStudent |null = await studentService.findStudentById(studentId);

      const isPasswordVerified = await bcrypt.compare(
        currentPassword,
        student!.password!
      );

      if (!isPasswordVerified) {
        throw new BadRequestError("Incorrect password");
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const {
          name,
          email,
          id,
          mobile,
          courses,
          wallet,
          isBlocked,
          isVerified,
        } = await studentService.updatePassword(studentId, hashedPassword);
        const updatedData = {
          name,
          email,
          id,
          mobile,
          courses,
          wallet,
          isBlocked,
          isVerified,
        };
        res.status(200).json(updatedData);
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const course = await studentService.getSingleCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async forgotPasswordOtpVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp, email } = req.body;
      console.log(otp, email);

      const savedOtp = await otpService.findOtp(email);
      if (savedOtp?.otp === otp) {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async resetForgottedPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = await studentService.resetForgotPassword(
        email,
        hashedPassword
      );
      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
 async stripePaymentIntent(req: Request, res: Response, next: NextFunction){
  try{
    const id = req.currentUser
    const {courseId} = req.body;
    const url = await studentService.stripePayment(courseId!,id!)
    res.status(200).json({url})

  }catch(error){
    if (error instanceof Error) {
      return next(error);
    }
  }
 }
 async enrollCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.currentUser;
    const { courseId } = req.body;
    const enrolledCourse = await studentService.enrollCourse(courseId, id!);
    res.status(201).json(enrolledCourse);
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
  }
} 
 
async getEnrolledCoursesByStudent(req: Request, res: Response, next: NextFunction) {
  try{
    const studentId= req.currentUser;
 

    const enrolledCourses = await studentService.getAllEnrolledCourses(studentId!)
    res.status(200).json(enrolledCourses);


  }catch(error){
    if (error instanceof Error) {
      return next(error);
    }
  }
}
async getEnrolledCourseByStudent(req: Request, res: Response, next: NextFunction) {
  try{
    const studentId= req.currentUser;
    const {courseId} = req.params;
    console.log("Student Id:", studentId, courseId)

    const enrolledCourse = await studentService.getEnrolledCourse(studentId!,courseId)

    console.log("Enrolled course:", enrolledCourse)

    res.status(200).json(enrolledCourse);


  }catch(error){
    if (error instanceof Error) {
      return next(error);
    }
  }
}

async addProgression(req: Request, res: Response, next: NextFunction) {
  try {
    const { enrollmentId, chapterTitle} = req.query;

    console.log(req.query)

    const progression = await studentService.addProgression(
      enrollmentId as string,
      chapterTitle as string
    );
    console.log(progression)
    res.status(201).json(progression);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}

async getTotalChapterCountByCourseId(req: Request, res: Response,next:NextFunction) {

  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  try {
    const totalChapterCount = await studentService.getTotalChapterCountByCourseId(courseId);
    console.log("Total chapter controller:", totalChapterCount)
    return res.status(200).json({ courseId, totalChapters: totalChapterCount });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}


}



