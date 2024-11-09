import { IStudent } from "../../interfaces/student";

export interface IStudentRepository {
  createStudent(studentData: IStudent): Promise<IStudent>;
  findStudentByEmail(email: string): Promise<IStudent | null>;
  findStudentById(studentId:string):Promise<IStudent | null>;
  updateUserVerification(email: string): Promise<IStudent>;
  updateStudent(studentData:IStudent):Promise<IStudent>;
  updateImage(studentId:string,image:string):Promise<IStudent>;
  udpatePassword(studentId: string, password: string): Promise<IStudent | null>;
  courseEnroll(studentId: string, courseId: string): Promise<IStudent>;
  getAllStudents(): Promise<IStudent[] | null>;
  blockStudent(studentId: string): Promise<IStudent | null>;
  unblockStudent(studentId: string): Promise<IStudent | null>;
}