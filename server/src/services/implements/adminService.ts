import { IAdmin } from "../../interfaces/admin";
import { AdminRepository } from "../../repositories/implements/adminRepository";
import ErrorHandler from "../../utils/ErrorHandler";
import { IAdminService } from "../interfaces/adminService.interface";
import { STATUS_CODES } from "../../constants/httpStatusCodes";

const {BAD_REQUEST} = STATUS_CODES

export class AdminService implements IAdminService {
  constructor(
    private adminRepository : AdminRepository){
        this.adminRepository = new AdminRepository()
    }
   
    async login(email:string) : Promise<IAdmin>{
        const admin = await this.adminRepository.findAdminByEmail(email)
        if(!admin){
            throw new ErrorHandler('Admin Not Found', BAD_REQUEST)
        }else{
        
            return admin;
        }
    }

 }
