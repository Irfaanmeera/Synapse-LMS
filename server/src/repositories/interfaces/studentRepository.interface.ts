import { IStudent} from "../../interfaces/student";


export interface IStudentRepository {
    emailExistCheck(email: string): Promise<IStudent | null>;
    saveStudent(studentDetails:IStudent) : Promise<IStudent|null>;
    
    

}