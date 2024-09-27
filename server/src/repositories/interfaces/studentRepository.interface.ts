import { IStudent} from "../../interfaces/student";


export interface IStudentRepository {
  createStudent(studentData: IStudent): Promise<IStudent>;
  findStudentByEmail(email: string): Promise<IStudent | null>;
  updateUserVerification(email: string): Promise<IStudent>;
    
}