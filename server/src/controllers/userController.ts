import {Request,Response,NextFunction} from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsyncError } from '../middlewares/catchAsyncErrors';
import { StudentService } from '../services/implements/studentService';
import { IStudent } from '../interfaces/student';
