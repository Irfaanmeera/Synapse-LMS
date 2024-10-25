import { IAdmin } from "../../interfaces/admin";
import {ICategory} from '../../interfaces/category'

export interface IAdminService{
    login(email:string): Promise <IAdmin>
    addCategory(category: string): Promise<ICategory | null>;
}