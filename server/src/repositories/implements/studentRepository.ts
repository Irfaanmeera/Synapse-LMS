import {studentCollection} from "../../models/studentModel";
import { IStudent } from "../../interfaces/student";
import { IStudentRepository } from "../interfaces/studentRepository.interface";

export class StudentRepository implements IStudentRepository{
    async createStudent(studentDetails:IStudent):Promise<IStudent>{
        const student = new studentCollection(studentDetails)
        return await student.save();
    }
    async findStudentByEmail(email: string): Promise<IStudent | null> {
        return await studentCollection.findOne({ email });
      }
}