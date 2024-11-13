import { IAdmin } from "../../interfaces/admin";
import {ICategory} from '../../interfaces/category'
import { IInstructor } from "../../interfaces/instructor";
import { IStudent } from "../../interfaces/student";

export interface IAdminService{
    login(email:string): Promise <IAdmin>
    addCategory(category: string): Promise<ICategory | null>;
    getAllStudents(): Promise<IStudent[] | null>;
    getAllInstructors(): Promise<IInstructor[] | null>;
    blockStudent(studentId: string): Promise<IStudent>;
    unblockStudent(studentId: string): Promise<IStudent>;
    blockInstructor(instructorId: string): Promise<IInstructor>;
    unblockInstructor(instructorId: string): Promise<IInstructor>;
}