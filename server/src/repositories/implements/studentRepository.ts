import { Student } from "../../models/studentModel";
import { IStudent } from "../../interfaces/student";
import { IStudentRepository } from "../interfaces/studentRepository.interface";

export class StudentRepository implements IStudentRepository {

    async createStudent(studentData: IStudent): Promise<IStudent> {
        const student = Student.build(studentData)
        return await student.save()
    }
    async findStudentByEmail(email: string): Promise<IStudent | null> {
        return await Student.findOne({ email })
    }
    async updateUserVerification(email: string): Promise<IStudent> {
        const student = await Student.findOne({ email });
        student!.set({ isVerified: true });
        return await student!.save();
        
    }
}