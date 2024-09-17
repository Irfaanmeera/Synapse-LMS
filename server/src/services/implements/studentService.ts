import { IStudentService } from "../interfaces/studentService.interface";
import { IStudent, IUserAuthResponse } from "../../interfaces/student";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";
import { CreateJWT } from "../../utils/generateToken";
import Encrypt from "../../utils/comparePassword";

const { OK, INTERNAL_SERVER_ERROR} = STATUS_CODES;

export class StudentService implements IStudentService {
    constructor(
    private studentRepository: StudentRepository,
    private encrypt:Encrypt,
    private createJwt :CreateJWT
    ){}
  
    async signup(studentData: IStudent): Promise<IStudent | null> {
        try {
            return await this.studentRepository.emailExistCheck(
                studentData.email!
            )


        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async saveStudent(studentData: IStudent): Promise<IUserAuthResponse|undefined> {
        try {
            const student =await this.studentRepository.saveStudent(studentData)
            if(student){
                const token = this.createJwt.generateAccessToken(student?.id)
                const refreshToken = this.createJwt.generateRefreshToken(student?.id)
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
                        userId: studentData.id,
                        token: token,
                        data: student,
                        refreshToken
                    }
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { status: INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal server error' } };
        }
    }




    async login(email: string): Promise<IStudent> {
        const student = await this.studentRepository.emailExistCheck(email);
        if (!student) {
            throw new ErrorHandler("Email not found", 400);
        } else {
            return student;
        }
    }
}