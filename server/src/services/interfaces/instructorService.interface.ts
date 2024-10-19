import {IInstructor } from "../../interfaces/instructor";

export interface IInstructorService{
    signup(studentDetails: IInstructor): Promise<IInstructor|null>;
    login(email:string):Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
    findInstructorById(instructorId: string): Promise<IInstructor | null>;
    updateInstructor(instructorData:IInstructor):Promise<IInstructor>;
    updateInstructorImage(instructorId:string,file:Express.Multer.File): Promise<IInstructor>;
}