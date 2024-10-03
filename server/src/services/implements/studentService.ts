import { IStudentService } from "../interfaces/studentService.interface";
import { IStudent } from "../../interfaces/student";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";
import { BadRequestError } from "../../constants/errors/badrequestError";


const { BAD_REQUEST } = STATUS_CODES;

export class StudentService implements IStudentService {
    constructor(
        private studentRepository: StudentRepository,
    ) {
        this.studentRepository = new StudentRepository();
    }

    async signup(studentDetails: IStudent): Promise<IStudent | null> {
        try {
            const existingStudent = await this.studentRepository.findStudentByEmail(
                studentDetails.email!
            );
            if (existingStudent) {   
                throw new BadRequestError("Student already exists");
            }
            return await this.studentRepository.createStudent(studentDetails);
        } catch (error) {
            console.log(error as Error);
            throw error; // Rethrow the error to be caught in the controller
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