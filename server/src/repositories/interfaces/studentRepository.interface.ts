import { IStudent} from "../../interfaces/student";


export interface IStudentRepository {
    createStudent(studentDetails:IStudent) : Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null>;

}