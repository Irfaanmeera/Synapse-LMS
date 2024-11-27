import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../interfaces/entityInterface/IAdmin';
import { AdminService } from '../services/adminService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison
import ErrorHandler from '../utils/ErrorHandler';
import { STATUS_CODES } from '../constants/httpStatusCodes';

import { BadRequestError } from '../constants/errors/badrequestError';
import { generateToken } from '../utils/generateJWT';


const { BAD_REQUEST } = STATUS_CODES;


export class AdminController {
  constructor(
    private adminService: AdminService
  ) { }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      // Find admin by email
      const admin: IAdmin = await this.adminService.login(email);
      console.log(admin);

      // Compare plain password with hashed password
      const isPasswordMatch = await bcrypt.compare(password, admin.password!);

      if (isPasswordMatch) {
        // Generate access token and refresh token if password matches
        const token = generateToken(admin.id, 'admin', process.env.JWT_SECRET!, '1h');
        const refreshToken = generateToken(admin.id, 'admin', process.env.JWT_REFRESH_SECRET!, '7d');
        

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
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.adminService.getAllCategories();
      res.status(200).json({ categories });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.body;
      const upperCaseCategory = category.toUpperCase();
      const newCategory = await this.adminService.addCategory(upperCaseCategory);
      res.status(201).json({ category: newCategory });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, data } = req.body;
      const upperCaseData = data.toUpperCase();
      const updatedCaetgory = await this.adminService.editCategory(
        categoryId,
        upperCaseData
      );
      res.status(200).json({ category: updatedCaetgory });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async listCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.body;
      const listedCategory = await this.adminService.listCategory(categoryId);
      res.status(200).json({ category: listedCategory, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unlistCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.body;
      const unlistedCategory = await this.adminService.unlistCategory(categoryId);
      res.status(200).json({ category: unlistedCategory, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }


  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.adminService.getAllStudents();
      res.status(200).json({ students });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const instructors = await this.adminService.getAllInstructors();
      res.status(200).json({ instructors });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async blockInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructorId } = req.body;
      if (!instructorId) {
        throw new BadRequestError("Invalid Id");
      }
      await this.adminService.blockInstructor(instructorId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unblockInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructorId } = req.body;
      if (!instructorId) {
        throw new BadRequestError("Invalid Id");
      }
      await this.adminService.unblockInstructor(instructorId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async blockStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body;
      if (!studentId) {
        throw new BadRequestError("Invalid Id");
      }
      await this.adminService.blockStudent(studentId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unblockStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body;
      if (!studentId) {
        throw new BadRequestError("Invalid Id");
      }
      await this.adminService.unblockStudent(studentId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async getCoursesByAdmin(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const courses = await this.adminService.getAllCourses();
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
}

async approveCourse(req: Request, res: Response, next: NextFunction){
  try {
    const { courseId, approval } = req.body;
    const updatedCourse = await this.adminService.courseApproval(courseId, approval);
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
async getSingleCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const course = await this.adminService.getSingleCourse(courseId);
    res.status(200).json(course);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}
async adminDashBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await this.adminService.adminDashboardData();
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}
async getEnrolledCoursesByAdmin(req: Request, res: Response,next:NextFunction){
  try{
 const enrolledCourses = await this.adminService.getEnrolledCoursesByAdmin()
 res.status(201).json(enrolledCourses);
  } catch(error){
    if (error instanceof Error) {
      console.log(error.message)
      next(error);
    }
  }

}
async getRevenueChartData(req: Request, res: Response,next:NextFunction) {
  try {
    const { filter } = req.query; // weekly, monthly, yearly
    if (!filter) {
      return res.status(400).json({ message: "Filter is required" });
    }

    const revenueData = await this.adminService.fetchSalesData(filter as "weekly" | "monthly" | "yearly");
    console.log("Sales data in admin controller", revenueData.data)
    res.status(200).json(revenueData);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}

}

