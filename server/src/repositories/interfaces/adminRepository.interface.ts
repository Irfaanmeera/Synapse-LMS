import { IAdmin } from "../../interfaces/admin";

export interface IAdminRepository{
    findAdminByEmail (email:string):Promise<IAdmin |null>
}