import { IAdmin } from "../../interfaces/Iadmin";

export interface IAdminRepository{
    findAdminByEmail (email:string):Promise<IAdmin |null>
}