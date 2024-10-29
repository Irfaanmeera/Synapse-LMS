import {IInstructor } from "../../interfaces/instructor";
import { ICourse } from "../../interfaces/course";
import {IModule,IChapter} from '../../interfaces/module';
import { ICategory } from "../../interfaces/category";




export interface IInstructorService{
    signup(studentDetails: IInstructor): Promise<IInstructor|null>;
    login(email:string):Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
    findInstructorById(instructorId: string): Promise<IInstructor | null>;
    updateInstructor(instructorData:IInstructor):Promise<IInstructor>;
    updateInstructorImage(instructorId:string,file:Express.Multer.File): Promise<IInstructor>;
    getMyCourses(instructorId: string,page: number): Promise<{ courses: ICourse[]; totalCount: number } | null>;
    createCourse(courseDetails: ICourse, file: Express.Multer.File): Promise<ICourse>;
    getSingleCourse(courseId: string): Promise< ICourse| null>;
    updateCourse(courseId: string, courseDetails: ICourse,file:Express.Multer.File): Promise<ICourse>;
    deleteCourse(courseId: string): Promise<ICourse>;
    getAllCategories(): Promise<ICategory[] | null>;
    createModule(moduleDetails: IModule, order:number): Promise<IModule>;
    updateModule(moduleId: string, updateData: Partial<IModule>): Promise<IModule | null>;
    deleteModule(moduleId: string): Promise<IModule | null>;
    addChapter(moduleId: string, chapter: IChapter,file: Express.Multer.File): Promise<IModule |null>;
    }
