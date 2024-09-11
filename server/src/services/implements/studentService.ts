import { IStudentService } from "../interfaces/studentService.interface";
import { IStudent } from "../../interfaces/student";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import ErrorHandler from "../../utils/ErrorHandler";

export class StudentService implements IStudentService {
    private studentRepository: StudentRepository;

    constructor() {
        this.studentRepository = new StudentRepository();
    }
    async signup(studentDetails: IStudent): Promise<IStudent> {
        const existingStudent = await this.studentRepository.findStudentByEmail(
            studentDetails.email!
        )
        if (existingStudent) {
            throw new ErrorHandler('Email already registered.Please use a different email', 400)
        }
        return await this.studentRepository.createStudent(studentDetails)
    }
    async login(email: string): Promise<IStudent> {
        const student = await this.studentRepository.findStudentByEmail(email);
        if (!student) {
            throw new ErrorHandler("Email not found", 400);
        } else {
            return student;
        }
    }
}