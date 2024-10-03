import {IInstructor } from "../../interfaces/instructor";

export interface IInstructorService{
    signup(studentDetails: IInstructor): Promise<IInstructor|null>;
    login(email:string):Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
}