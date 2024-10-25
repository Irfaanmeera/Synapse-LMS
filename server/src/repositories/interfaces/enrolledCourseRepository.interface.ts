import { IEnrolledCourse } from "../../interfaces/enrolledCourse";


export interface IEnrolledCourseRepository {
    createCourse(courseDeatils: IEnrolledCourse): Promise<IEnrolledCourse>;
    getCourseById(courseId: string): Promise<IEnrolledCourse>;
    getCourseByStudentIdAndCourseId(studentId: string,courseId: string): Promise<IEnrolledCourse | null>;
    getEnrolledCoursesByStudent(studentId: string): Promise<IEnrolledCourse[]>;
    getEnrolledCoursesByCourseId(couresId: string): Promise<IEnrolledCourse[]>;
}