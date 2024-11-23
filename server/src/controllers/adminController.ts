import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../interfaces/Iadmin';
import { AdminService } from '../services/implements/adminService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison
import ErrorHandler from '../utils/ErrorHandler';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import { AdminRepository } from '../repositories/implements/adminRepository';
import { CategoryRepository } from '../repositories/implements/categoryRepository';
import { BadRequestError } from '../constants/errors/badrequestError';
import { StudentRepository } from '../repositories/implements/studentRepository';
import { InstructorRepository } from '../repositories/implements/instructorRepository';
import { CourseRepository } from '../repositories/implements/courseRepository';
import { EnrolledCourseRepository } from '../repositories/implements/enrolledCourseRepository';

const { BAD_REQUEST } = STATUS_CODES;
const adminRepository = new AdminRepository();
const categoryRepository = new CategoryRepository()
const studentRepository = new StudentRepository()
const instructorRepository = new InstructorRepository()
const courseRepository = new CourseRepository()
const enrolledCourseRepository = new EnrolledCourseRepository()
const adminService = new AdminService(adminRepository, categoryRepository, studentRepository,instructorRepository,courseRepository,enrolledCourseRepository);

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
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await adminService.getAllCategories();
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
      const newCategory = await adminService.addCategory(upperCaseCategory);
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
      const updatedCaetgory = await adminService.editCategory(
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
      const listedCategory = await adminService.listCategory(categoryId);
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
      const unlistedCategory = await adminService.unlistCategory(categoryId);
      res.status(200).json({ category: unlistedCategory, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }


  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await adminService.getAllStudents();
      res.status(200).json({ students });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const instructors = await adminService.getAllInstructors();
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
      await adminService.blockInstructor(instructorId);
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
      await adminService.unblockInstructor(instructorId);
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
      await adminService.blockStudent(studentId);
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
      await adminService.unblockStudent(studentId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async getCoursesByAdmin(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const courses = await adminService.getAllCourses();
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
    const updatedCourse = await adminService.courseApproval(courseId, approval);
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
async getSingleCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const course = await adminService.getSingleCourse(courseId);
    res.status(200).json(course);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}
async adminDashBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.adminDashboardData();
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}
async getEnrolledCoursesByAdmin(req: Request, res: Response,next:NextFunction){
  try{
 const enrolledCourses = await adminService.getEnrolledCoursesByAdmin()
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

    const revenueData = await adminService.fetchSalesData(filter as "weekly" | "monthly" | "yearly");
    console.log("Sales data in admin controller", revenueData.data)
    res.status(200).json(revenueData);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
}

}

