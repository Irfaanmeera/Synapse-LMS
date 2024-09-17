import { studentCollection } from "../../models/studentModel";
import { IStudent } from "../../interfaces/student";
import { IStudentRepository } from "../interfaces/studentRepository.interface";

export class StudentRepository implements IStudentRepository {
    async emailExistCheck(email: string): Promise<IStudent | null> {
        try {
            return await studentCollection.findOne({ email });
        } catch (error: unknown) {
            console.log(error);
            return null;
        }

    }

    async saveStudent(studentData: IStudent): Promise<IStudent | null> {
        try {
            const student = new studentCollection(studentData)
            await student.save();
            return student as IStudent;
        } catch (error: unknown) {
            console.log(error);
            return null;
        }
    }
}