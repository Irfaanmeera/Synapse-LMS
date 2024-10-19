import {IStudent } from "../../interfaces/student";

export interface IStudentService{
    signup(studentData: IStudent): Promise<IStudent|null>;
    login(email:string):Promise<IStudent>;
    verifyStudent(email: string): Promise<IStudent>;
    getUserByEmail(email:string):Promise<IStudent |null>;
    findStudentById(studentId:string):Promise<IStudent | null>;
    updateStudent(studentData:IStudent):Promise<IStudent>;
    updateImage(stduentId:string,file:Express.Multer.File): Promise<IStudent>;
}