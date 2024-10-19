import { IAdmin } from "../../interfaces/admin";

export interface IAdminService{
    login(email:string): Promise <IAdmin>
}