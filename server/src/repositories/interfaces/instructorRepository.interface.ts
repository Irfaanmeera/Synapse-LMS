import { IInstructor } from "../../interfaces/instructor";

export interface IInstructorRepository {
  createInstructor(studentData: IInstructor): Promise<IInstructor>;
  findInstructorByEmail(email: string): Promise<IInstructor | null>;
  updateInstructorVerification(email: string): Promise<IInstructor>;

}