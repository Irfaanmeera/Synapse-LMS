import {IStudent } from "../../interfaces/student";
import { ICourse } from "../../interfaces/course";
import { ICategory } from "../../interfaces/category";
import { IEnrolledCourse } from "../../interfaces/enrolledCourse";




export interface IStudentService{
    signup(studentData: IStudent): Promise<IStudent|null>;
    login(email:string):Promise<IStudent>;
    verifyStudent(email: string): Promise<IStudent>;
    getUserByEmail(email:string):Promise<IStudent |null>;
    findStudentById(studentId:string):Promise<IStudent | null>;
    updateStudent(studentData:IStudent):Promise<IStudent>;
    updateImage(stduentId:string,file:Express.Multer.File): Promise<IStudent>;
    updatePassword(studentId: string, password: string): Promise<IStudent>;
    resetForgotPassword(email: string, password: string): Promise<IStudent>;
    getAllCourses(page:number):Promise<{courses: ICourse[];totalCount: number;}|null>;
    getAllCategories():Promise<ICategory[] |null>;
    getSingleCourse(courseId: string): Promise<ICourse>;
    stripePayment(courseId: string, studentId: string): Promise<string>;
    enrollCourse(courseId: string, studentId: string): Promise<IEnrolledCourse>;
    getEnrolledCourse(studentId: string,courseId: string,): Promise<IEnrolledCourse | null>;
    getAllEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]>;
    addProgression(enrollmentId: string,chapterTitle: string): Promise<IEnrolledCourse>;
    getTotalChapterCountByCourseId(courseId: string):Promise<number>;
}