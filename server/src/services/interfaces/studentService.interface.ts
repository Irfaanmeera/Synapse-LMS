import {IStudent } from "../../interfaces/student";


export interface IStudentService{
    signup(studentDetails: IStudent): Promise<IStudent|null>;
    login(email:string):Promise<IStudent>;
}