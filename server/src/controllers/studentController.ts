/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
// import ErrorHandler from '../utils/ErrorHandler';
import { catchAsyncError } from '../middlewares/catchAsyncErrors';
import { StudentService } from '../services/implements/studentService';
import { OtpService } from '../services/implements/otpService';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import bcrypt from 'bcryptjs'
import { IStudent } from '../interfaces/student';
import jwt from "jsonwebtoken";
import ErrorHandler from '../utils/ErrorHandler';
import { StudentRepository } from '../repositories/implements/studentRepository';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES

const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const otpService = new OtpService();

export class StudentController {
  
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log("Request Body:", req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password:", password); // Check if password is undefined


      const studentData: IStudent = {
        name,
        email,
        mobile,
        password:hashedPassword,
      }
      await studentService.signup(studentData)
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
  async verifyStudent(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const existingOtp = await otpService.findOtp(email)
      if (otp === existingOtp?.otp) {
        const student: IStudent = await studentService.verifyStudent(email)
        const accessToken = jwt.sign(
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
          accessToken, // Return access token
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
      const { email, password } = req.body
      const student: IStudent = await studentService.login(email)
      const validPassword = await bcrypt.compare(password, student.password!)
      if (validPassword) {
        if (student.isVerified) {
          const accessToken = jwt.sign(
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
            accessToken, // Return access token
            refreshToken, // Return refresh token
            student: studentData,
          });
        } else {
          const otp = otpService.generateOtp();
          await otpService.createOtp({ email, otp });
          otpService.sendOtpMail(email, otp);
          throw new ErrorHandler("Not verified", BAD_REQUEST);
        }
      } else {
        throw new ErrorHandler("Incorrect password", BAD_REQUEST);
      }
    } catch (error) {
      console.log(error as Error)
    }
  }
}



