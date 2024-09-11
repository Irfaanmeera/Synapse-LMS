import {IStudent } from "../../interfaces/student";


export interface IStudentService{
    signup(studentDetails: IStudent): Promise<IStudent>;
    login(email:string):Promise<IStudent>
}