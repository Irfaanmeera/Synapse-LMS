/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
// import ErrorHandler from '../utils/ErrorHandler';
import { catchAsyncError } from '../middlewares/catchAsyncErrors';
import { StudentService } from '../services/implements/studentService';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import { generateAndSendOTP } from '../utils/otpGenerator';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES
class StudentController {
  constructor(private studentService: StudentService) { }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      req.app.locals.studentData = req.body;
      const student = await this.studentService.signup(req.app.locals.studentData)
      console.log(student)
      if (!student) {
        req.app.locals.newStudent = true;
        req.app.locals.studentData = req.body;
        req.app.locals.email = req.body.email;
        const otp = await generateAndSendOTP(req.body.email)
        req.app.locals.otp = otp;

        const expirationMinutes = 5;
        setTimeout(() => {
          delete req.app.locals.otp
        }, expirationMinutes * 60 * 1000)
        res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

      } else {
        res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
      }

    } catch (error) {
      console.log(error as Error)
      res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
    }
  }
  async resendOtp(res: Response, req: Request): Promise<void> {
    try {
      const email = req.app.locals.email
      const otp = await generateAndSendOTP(email)
      req.app.locals.otp = otp;
      req.app.locals.resendOtp = otp;

      const expirationMinutes = 5;
      setTimeout(() => {
        delete req.app.locals.otp
        delete req.app.locals.resendOtp
      }, expirationMinutes * 60 * 1000)
    } catch (error) {
      console.log(error as Error);
    }
  }

  async verifyResendOtp(res: Response, req: Request) {
    try {
      const otp = req.body.otp;
      if (!otp) return res.json({ success: false, message: 'Please enter the otp!' });
      if (!req.app.locals.resendOtp) return res.json({ success: false, message: 'Otp expired!' });
      if (otp === req.app.locals.resendOtp) res.json({ success: true, message: 'OTP verification successull' });
      else res.json({ success: false, message: 'Entered otp is not correct!' })
    } catch (error) {
      console.log(error as Error);
      res.json({ success: false, message: 'Internal server Error occured!' });
    }
  }

  async verifyOtp(res: Response, req: Request): Promise<void> {
    try {
      const { otp } = req.body
      const isNewStudent = req.app.locals.newStudent
      const savedStudent = req.app.locals.studentData

      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      if (otp === Number(req.app.locals.otp)) {
        if (isNewStudent) {
          const newStudent = await this.studentService.saveStudent(savedStudent)
          req.app.locals = {}
          res.status(OK).cookie('access_token', newStudent?.data.token, {
            maxAge: accessTokenMaxAge
          }).cookie('refresh_token', isNewStudent.data.refresh_token, {
            maxAge: refreshTokenMaxAge
          }).json(newStudent);
        } else {

          res.status(OK).cookie('access_token', isNewStudent.data.token, {
            maxAge: accessTokenMaxAge
          }).cookie('refresh_token', isNewStudent.data.refresh_token, {
            maxAge: refreshTokenMaxAge
          }).json({ success: true, message: 'Old User verified' });
        }
      } else {
        res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
      }

    } catch (error) {
      console.log(error as Error);
      res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
    }
  }

}

export default StudentController;


