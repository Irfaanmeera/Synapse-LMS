import {IInstructor } from "../../interfaces/instructor";
import { ICourse } from "../../interfaces/course";
import {IModule,IChapter} from '../../interfaces/module';
import { ICategory } from "../../interfaces/category";
import { IEnrolledCourse } from "../../interfaces/enrolledCourse";



export interface IInstructorService{
    signup(studentDetails: IInstructor): Promise<IInstructor|null>;
    login(email:string):Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
    findInstructorById(instructorId: string): Promise<IInstructor | null>;
    updateInstructor(instructorData:IInstructor):Promise<IInstructor>;
    updateInstructorImage(instructorId:string,file:Express.Multer.File): Promise<IInstructor>;
    getMyCourses(instructorId: string,page: number): Promise<{ courses: ICourse[]; totalCount: number } | null>;
    createCourse(courseDetails: ICourse, file: Express.Multer.File): Promise<ICourse>;
    getSingleCourse(courseId: string): Promise<{ course: ICourse; enrollments: IEnrolledCourse[] } | null>;
    updateCourse(courseDetails: ICourse): Promise<ICourse>;
    addCourseImage(courseId: string, file: Express.Multer.File): Promise<ICourse>;
    deleteCourse(courseId: string): Promise<ICourse>;
    getAllCategories(): Promise<ICategory[] | null>;
    createModule(moduleDetails: IModule,order: number,file: Express.Multer.File): Promise<IModule>;
    addChapter(courseId: string, chapter: IChapter): Promise<IModule>;
    }
