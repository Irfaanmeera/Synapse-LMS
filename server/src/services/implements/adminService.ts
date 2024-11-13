import { IAdmin } from "../../interfaces/admin";
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
import { IInstructor } from "../../interfaces/instructor";

const {BAD_REQUEST} = STATUS_CODES

export class AdminService implements IAdminService {
  constructor(
    private adminRepository : AdminRepository,
    private categoryRepository: CategoryRepository,
    private studentRepository : StudentRepository,
    private instructorRepository : InstructorRepository,

){
        this.adminRepository = new AdminRepository();
        this.categoryRepository = new CategoryRepository();
        this.studentRepository = new StudentRepository();
        this.instructorRepository = new InstructorRepository();
    }
   
    async login(email:string) : Promise<IAdmin>{
        const admin = await this.adminRepository.findAdminByEmail(email)
        if(!admin){
            throw new ErrorHandler('Admin Not Found', BAD_REQUEST)
        }else{
        
            return admin;
        }
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
    

 }
