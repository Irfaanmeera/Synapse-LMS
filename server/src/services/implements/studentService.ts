import { IStudentService } from "../interfaces/studentService.interface";
import { IStudent } from "../../interfaces/student";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";
// import { CreateJWT } from "../../utils/generateToken";
// import Encrypt from "../../utils/comparePassword";

const {BAD_REQUEST } = STATUS_CODES;

export class StudentService implements IStudentService {
    constructor(
        private studentRepository: StudentRepository,
    ) {
        this.studentRepository = new StudentRepository();
    }

    async signup(studentData: IStudent): Promise<IStudent | null> {
        try {
            const existingStudent = await this.studentRepository.findStudentByEmail(
                studentData.email!
            );
            if (existingStudent) {
                throw new ErrorHandler("Student already exists", BAD_REQUEST);
            } else {
                return await this.studentRepository.createStudent(studentData);
            }

        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async login(email: string): Promise<IStudent> {
        const student = await this.studentRepository.findStudentByEmail(email)
        if (!student) {
            throw new ErrorHandler('User not found', BAD_REQUEST)
        } else {
            return student;
        }
    }

    async verifyStudent(email: string): Promise<IStudent> {
        return this.studentRepository.updateUserVerification(email)
    }
}