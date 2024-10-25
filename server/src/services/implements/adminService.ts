import { IAdmin } from "../../interfaces/admin";
import { AdminRepository } from "../../repositories/implements/adminRepository";
import ErrorHandler from "../../utils/ErrorHandler";
import { IAdminService } from "../interfaces/adminService.interface";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { BadRequestError } from "../../constants/errors/badrequestError";
import { ICategory } from "../../interfaces/category";

const {BAD_REQUEST} = STATUS_CODES

export class AdminService implements IAdminService {
  constructor(
    private adminRepository : AdminRepository,
    private categoryRepository: CategoryRepository,

){
        this.adminRepository = new AdminRepository();
        this.categoryRepository = new CategoryRepository();
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

 }
