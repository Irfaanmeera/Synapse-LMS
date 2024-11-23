import { IAdmin } from "../../interfaces/Iadmin";
import { AdminRepository } from "../../repositories/implements/adminRepository";
import ErrorHandler from "../../utils/ErrorHandler";
import { IAdminService } from "../interfaces/adminService.interface";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { BadRequestError } from "../../constants/errors/badrequestError";
import { ICategory } from "../../interfaces/category";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { IStudent } from "../../interfaces/student";
import { InstructorRepository } from "../../repositories/implements/instructorRepository";
import { IInstructor } from "../../interfaces/IInstructor";
import { CourseApproval, ICourse } from "../../interfaces/course";
import { CourseRepository } from "../../repositories/implements/courseRepository";
// import { EnrolledCountByCategoryAndDate } from "../../interfaces/dashboard";
import { EnrolledCourseRepository } from "../../repositories/implements/enrolledCourseRepository";
import { IEnrolledCourse } from "../../interfaces/enrolledCourse";

const {BAD_REQUEST} = STATUS_CODES

interface adminDashboardData {
  
  totalRevenue: number;
  studentCount: number;
  instructorCount: number;
  courseCount: number;
}
interface SalesDataPoint {
  timePeriod: number | string; // Represents the grouped time period (e.g., day, month, year)
  totalRevenue: number;        // Total revenue for the time period
}

// Interface for the fetch function's return type
interface FetchSalesDataResponse {
  data: SalesDataPoint[];      // Array of sales data points
}

export class AdminService implements IAdminService {
  constructor(
    private adminRepository : AdminRepository,
    private categoryRepository: CategoryRepository,
    private studentRepository : StudentRepository,
    private instructorRepository : InstructorRepository,
    private courseRepository:CourseRepository,
    private enrolledCourseRepository: EnrolledCourseRepository,

){
        this.adminRepository = new AdminRepository();
        this.categoryRepository = new CategoryRepository();
        this.studentRepository = new StudentRepository();
        this.instructorRepository = new InstructorRepository();
        this.courseRepository = new CourseRepository()
        this.enrolledCourseRepository = new EnrolledCourseRepository();
    }
   
    async login(email:string) : Promise<IAdmin>{
        const admin = await this.adminRepository.findAdminByEmail(email)
        if(!admin){
            throw new ErrorHandler('Admin Not Found', BAD_REQUEST)
        }else{
        
            return admin;
        }
    }
    async getAllCategories(): Promise<ICategory[] | null> {
      return await this.categoryRepository.getAllCategories();
    }
    async addCategory(category: string): Promise<ICategory | null> {
      const existingCategory = await this.categoryRepository.findCategoryByName(
        category
      );
      if (existingCategory) {
        throw new BadRequestError("Category already exist");
      } else {
        return await this.categoryRepository.createCategory(category);
      }
    }
    async editCategory(categoryId: string, data: string): Promise<ICategory> {
      const isExist = await this.categoryRepository.findCategoryByName(data);
      if (isExist) {
        throw new BadRequestError("Category already exist");
      }
      const existingCategory = await this.categoryRepository.findCategoryById(
        categoryId
      );
      if (existingCategory!.id !== categoryId) {
        throw new BadRequestError("Category already exist");
      } else {
        return await this.categoryRepository.updateCategory(categoryId, data);
      }
    }
    async listCategory(categoryId: string): Promise<ICategory> {
      return this.categoryRepository.listCategory(categoryId);
    }
    async unlistCategory(categoryId: string): Promise<ICategory> {
      return this.categoryRepository.unlistCategory(categoryId);
    }
  
      async getAllStudents(): Promise<IStudent[] | null> {
        return await this.studentRepository.getAllStudents();
      }
      async getAllInstructors(): Promise<IInstructor[] | null> {
        return await this.instructorRepository.getAllInstructors();
      }
      async blockStudent(studentId: string): Promise<IStudent> {
        return await this.studentRepository.blockStudent(studentId);
      }
      async unblockStudent(studentId: string): Promise<IStudent> {
        return await this.studentRepository.unblockStudent(studentId);
      }
      async blockInstructor(instructorId: string): Promise<IInstructor> {
        return await this.instructorRepository.blockInstructor(instructorId);
      }
      async unblockInstructor(instructorId: string): Promise<IInstructor> {
        return await this.instructorRepository.unblockInstructor(instructorId);
      }
      async getAllCourses(): Promise<ICourse[]> {
          return await this.courseRepository.getCourseByAdmin();
      }
      async getSingleCourse(courseId: string): Promise<ICourse> {
        const course = await this.courseRepository.getSingleCourseForAdmin(
          courseId
        );
        if (!course) {
          throw new BadRequestError("Course not found");
        }
        return course;
      }
    
      async courseApproval(
        courseId: string,
        approval: CourseApproval
      ): Promise<ICourse> {
        const response = await this.courseRepository.courseApproval(
          courseId,
          approval
        );
        
        return response;
      }

      async adminDashboardData(): Promise<adminDashboardData> {
      
        const totalRevenue = await this.enrolledCourseRepository.getTotalRevenue();
        const instructorCount = await this.instructorRepository.getInstructorCount();
        const studentCount = await this.studentRepository.getStudentCount();
        const courseCount = await this.courseRepository.getCourseCount();
    
        return {
          
          totalRevenue,
          instructorCount,
          studentCount,
          courseCount,
        };
      }
      async getEnrolledCoursesByAdmin(): Promise<IEnrolledCourse[] | null> {
        const enrolledCourses = await this.enrolledCourseRepository.getEnrolledCoursesByAdmin()
   
        if(!enrolledCourses){
         throw new BadRequestError('No enrollment')
        }
        return enrolledCourses;
    }
   
    
       async fetchSalesData(filter: "weekly" | "monthly" | "yearly"):Promise<FetchSalesDataResponse> {
        const salesData: SalesDataPoint[] = await this.enrolledCourseRepository.getRevenueData(filter); // Assuming this returns an array
        return { data: salesData };
      
      };
 }
