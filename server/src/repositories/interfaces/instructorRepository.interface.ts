import { IInstructor } from "../../interfaces/instructor";
// import { ICourse } from "../../interfaces/course";
// import { IModule } from "../../interfaces/module";
// import { IChapter } from "../../interfaces/module";
// import { ICategory } from "../../interfaces/category";
// import { ILevel } from "../../interfaces/level";
// import { ILanguage } from "../../interfaces/language";


export interface IInstructorRepository {
  createInstructor(instructorData: IInstructor): Promise<IInstructor>;
  findInstructorByEmail(email: string): Promise<IInstructor | null>;
  findInstructorById(instructorId: string): Promise<IInstructor | null>;
  updateInstructorVerification(email: string): Promise<IInstructor>;
  updateInstructor(instructorData:IInstructor):Promise<IInstructor>;
  updateInstructorImage(instructorId:string,image:string):Promise<IInstructor>;
 
}