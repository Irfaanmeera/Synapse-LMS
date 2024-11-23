import { Admin} from "../../models/adminModel";
import { IAdmin } from "../../interfaces/Iadmin";
import { IAdminRepository } from "../interfaces/adminRepository.interface";

export class AdminRepository implements IAdminRepository{
  async findAdminByEmail(email:string) : Promise<IAdmin |null>{
   const admin= await Admin.findOne({email})
   console.log(admin)
   return admin;
   }
}

