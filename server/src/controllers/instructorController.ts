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

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES

const instructorRepository = new InstructorRepository();
const instructorService = new InstructorService(instructorRepository);
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
            wallet: instructor.wallet,
            courses: instructor.courses,
            role: "instructor",
        };

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
  async updateInstructor(req:Request,res:Response,next:NextFunction){
    try{
      const id = req.currentUser;
      const {name,mobile,qualification} = req.body;
      const instructor = await instructorService.updateInstructor({id, name, mobile, qualification});
      res.status(200).json(instructor)
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
        const student = await instructorService.updateInstructorImage(id!, file);
        res.status(200).json(student);
      } catch (error) {
        if (error instanceof Error) {
          return next(error);
        }
      }
    }
  
}



