import { Student } from "../../models/studentModel";
import { IStudent } from "../../interfaces/student";
import { IStudentRepository } from "../interfaces/studentRepository.interface";
import { BadRequestError } from "../../constants/errors/badrequestError";

export class StudentRepository implements IStudentRepository {

    async createStudent(studentData: IStudent): Promise<IStudent> {
        const student = Student.build(studentData)
        return await student.save();
    }
    async findStudentByEmail(email: string): Promise<IStudent | null> {
        return await Student.findOne({ email })
    }
    async findStudentById(studentId: string): Promise<IStudent | null> {
        const student= await Student.findById(studentId)
        if(!student){
            throw new BadRequestError('Invalid Id')
        }
        return student;
    }
    async updateUserVerification(email: string): Promise<IStudent> {
        const student = await Student.findOne({ email });
        student!.set({ isVerified: true });
        return await student!.save();
        
    }
    async updateStudent(studentData:IStudent): Promise<IStudent>{
        const {id,name,mobile} = studentData;
        const student = await Student.findById(id)
        if(!student){
            throw new BadRequestError('Student not found')
        }
        student.set({
            name,
            mobile
        })
        return await student.save()
    }

    async updateImage(studentId:string,image:string):Promise<IStudent>{
        const student = await Student.findById(studentId)
        if(!student){
            throw new BadRequestError('Invalid Id')
        }
        student.set({
            image,
        })
        return await student.save()
    }
}