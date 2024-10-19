import { IInstructor } from "../../interfaces/instructor";

export interface IInstructorRepository {
  createInstructor(studentData: IInstructor): Promise<IInstructor>;
  findInstructorByEmail(email: string): Promise<IInstructor | null>;
  findInstructorById(instructorId: string): Promise<IInstructor | null>;
  updateInstructorVerification(email: string): Promise<IInstructor>;
  updateInstructor(instructorData:IInstructor):Promise<IInstructor>;
  updateInstructorImage(instructorId:string,image:string):Promise<IInstructor>;

}