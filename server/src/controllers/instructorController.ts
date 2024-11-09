/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { InstructorService } from '../services/implements/instructorService';
import { OtpService } from '../services/implements/otpService';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import bcrypt from 'bcryptjs'
import { IInstructor } from '../interfaces/instructor';
import jwt from "jsonwebtoken";
import ErrorHandler from '../utils/ErrorHandler';
import { InstructorRepository } from '../repositories/implements/instructorRepository';
import { BadRequestError } from '../constants/errors/badrequestError';
import { ForbiddenError } from '../constants/errors/forbiddenError'
import { CourseRepository } from '../repositories/implements/courseRepository';
import { CategoryRepository } from '../repositories/implements/categoryRepository';
import { EnrolledCourseRepository } from '../repositories/implements/enrolledCourseRepository';
import { ModuleRepository } from '../repositories/implements/moduleRepository';
import { ICourse } from '../interfaces/course';
import { IModule } from '../interfaces/module';


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES

const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository()
const moduleRepository = new ModuleRepository()
const enrolledCourseRepository = new EnrolledCourseRepository()
const instructorService = new InstructorService(instructorRepository, courseRepository, categoryRepository, moduleRepository, enrolledCourseRepository);

const otpService = new OtpService();

export class InstructorController {

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log("Request Body:", req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password:", password); // Check if password is undefined


      const instructorData: IInstructor = {
        name,
        email,
        mobile,
        password: hashedPassword,
      }
      await instructorService.signup(instructorData)
      const otp = otpService.generateOtp()
      await otpService.createOtp({ email, otp })
      otpService.sendOtpMail(email, otp)
      res.status(OK).json({ success: true, message: 'OTP sent for verification...' });

    } catch (error) {
      console.log(error as Error)
      res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
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
        const instructor: IInstructor = await instructorService.verifyInstructor(email)
        const token = jwt.sign(
          {
            instructorId: instructor.id,
            role: "Instructor",
          },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" } // Access token expires in 15 minutes
        );

        const refreshToken = jwt.sign(
          {
            instructorId: instructor.id,
            role: "Instructor",
          },
          process.env.JWT_REFRESH_SECRET!, // Make sure you have a separate secret for refresh tokens
          { expiresIn: "7d" } // Refresh token expires in 7 days
        );
        const instructorData = {
          _id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          mobile: instructor.mobile,
          image: instructor.image,
          wallet: instructor.wallet,
          qualification: instructor.qualification,
          description: instructor.description,
          courses: instructor.courses,
          role: "instructor",
        };
        console.log(instructorData)

        res.status(200).json({
          message: "Instructor Verified",
          token, // Return access token
          refreshToken, // Return refresh token
          instructor: instructorData,
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
      const { email, password } = req.body
      const instructor: IInstructor = await instructorService.login(email)
      const validPassword = await bcrypt.compare(password, instructor.password!)
      if (validPassword) {
        if (instructor.isVerified) {
          const token = jwt.sign(
            {
              instructorId: instructor.id,
              role: "instructor",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" } // Access token expires in 15 minutes
          );

          const refreshToken = jwt.sign(
            {
              instructorId: instructor.id,
              role: "instructor",
            },
            process.env.JWT_REFRESH_SECRET!, // Make sure you have a separate secret for refresh tokens
            { expiresIn: "7d" } // Refresh token expires in 7 days
          );
          const instructorData = {
            _id: instructor.id,
            name: instructor.name,
            email: instructor.email,
            mobile: instructor.mobile,
            image: instructor.image,
            qualification: instructor.qualification,
            description: instructor.description,
            wallet: instructor.wallet,
            courses: instructor.courses,
            walletHistory: instructor.walletHistory,
            role: "instructor",
          };

          res.status(200).json({
            message: "Instructor Verified",
            token, // Return access token
            refreshToken, // Return refresh token
            instructor: instructorData,
          });
        } else {
          const otp = otpService.generateOtp();
          await otpService.createOtp({ email, otp });
          otpService.sendOtpMail(email, otp);
          throw new ErrorHandler("Not verified", BAD_REQUEST);
        }
      } else {
        res.status(400).json({ message: "Incorrect password" });
        throw new ErrorHandler("Incorrect password", BAD_REQUEST);
      }
    } catch (error) {
      console.log(error as Error)
    }
  }
  async updateInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const { name, mobile, qualification, description } = req.body;
      const instructor = await instructorService.updateInstructor({ id, name, mobile, qualification, description });
      res.status(200).json(instructor)
    }

    catch (error) {
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
      const student = await instructorService.updateInstructorImage(id!, file);
      res.status(200).json(student);
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
      const instructor = await instructorService.resetForgotPassword(
        email,
        hashedPassword
      );
      res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getMycourses(req: Request, res: Response, next: NextFunction) {
    try {
      let pageNo = 0;
      const { page } = req.query;
      if (page !== undefined && !isNaN(Number(page))) {
        pageNo = Number(page);
      }
      const instructorId = req.currentUser;
      if (!instructorId) {
        throw new ForbiddenError("Invalid token");
      }
      const courses = await instructorService.getMyCourses(
        instructorId,
        pageNo
      );
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async createCourse(req: Request, res: Response) {
    try {
      const instructorId = req.currentUser;
      const { name, description, level, category, price } = req.body;
      console.log('Incoming course data:', req.body);
      console.log('Incoming file:', req.file);
      const courseDetails = {
        name,
        description,
        level,
        category,
        price,
        instructor: instructorId,
      };
      const file: Express.Multer.File | undefined = req.file; // Ensure file can be undefined
      console.log(file)
      // Check if file is provided
      if (!file) {
        return res.status(400).json({ error: 'Image file is required.' }); // Handle missing file
      }

      const createdCourse = await instructorService.createCourse(courseDetails, file); // Call the service method
      return res.status(201).json(createdCourse); // Return the created course with a 201 status
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while creating the course.' }); // Handle errors
    }
  }
  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      console.log("Course Id: ", courseId)
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await instructorService.getSingleCourse(courseId);
      console.log(course)
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { name, description, price, level, category } = req.body;

      // Gather course details from the request body
      const courseDetails = {
        name,
        description,
        price,
        level,
        category,
      };

      // Check if there is an image file uploaded and pass it to the service
      const file = req.file ? req.file : undefined;

      // Call the service function to update the course details
      const updatedCourse = await instructorService.updateCourse(courseId, courseDetails, file);

      // Respond with the updated course data
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  }


  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      console.log("Delete Course: ", courseId)
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await instructorService.deleteCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  
  async listCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      console.log("List Course: ", courseId)
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await instructorService.listCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }


  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await instructorService.getAllCategories()
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const moduleData = req.body;
      const existingModule = await instructorService.getSingleCourse(moduleData.courseId);

      console.log("existing module:", existingModule)
      const order = (existingModule?.modules?.length || 0) + 1;
      const module = await instructorService.createModule(moduleData, order);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async updateModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const updateData = req.body;
      const updatedModule = await instructorService.updateModule(moduleId, updateData);
      res.status(200).json(updatedModule);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    };
  }

  async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      await instructorService.deleteModule(moduleId);
      res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  };
  async addChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const chapterData = req.body;
      const file = req.file;

      console.log("Add Chapter backend Response :", moduleId, chapterData, file)
      const module = await instructorService.addChapter(moduleId, chapterData, file!);
      console.log("add chapter response:", module)
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  };


}






