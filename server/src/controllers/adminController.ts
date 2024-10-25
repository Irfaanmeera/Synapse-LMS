import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../interfaces/admin';
import { AdminService } from '../services/implements/adminService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison
import ErrorHandler from '../utils/ErrorHandler';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import { AdminRepository } from '../repositories/implements/adminRepository';
import { CategoryRepository } from '../repositories/implements/categoryRepository';

const { BAD_REQUEST } = STATUS_CODES;
const adminRepository = new AdminRepository();
const categoryRepository = new CategoryRepository()
const adminService = new AdminService(adminRepository,categoryRepository);

export class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      // Find admin by email
      const admin: IAdmin = await adminService.login(email);
      console.log(admin);

      // Compare plain password with hashed password
      const isPasswordMatch = await bcrypt.compare(password, admin.password!);

      if (isPasswordMatch) {
        // Generate access token and refresh token if password matches
        const token = jwt.sign(
          {
            adminId: admin.id,
            role: "admin",
          },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" } // Access token expires in 15 minutes
        );

        const refreshToken = jwt.sign(
          {
            adminId: admin.id,
            role: "admin",
          },
          process.env.JWT_REFRESH_SECRET!, // Separate secret for refresh tokens
          { expiresIn: "7d" } // Refresh token expires in 7 days
        );

        // Admin details to send back in response
        const adminDetails = {
          _id: admin.id,
          email: admin.email,
          role: "admin",
        };

        console.log(adminDetails)

        res.status(200).json({
          admin: adminDetails,
          message: "Admin signed in",
          token,
          refreshToken,
          success: true,
        });
      } else {
        // If password is incorrect
        res.status(400).json({ message: "Incorrect Password" });
        throw new ErrorHandler("Incorrect password", BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(error);
      } else {
        console.log("An unknown error occurred");
      }
    }
  }
  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.body;
      const upperCaseCategory = category.toUpperCase();
      const newCategory = await adminService.addCategory(upperCaseCategory);
      res.status(201).json({ category: newCategory });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}
