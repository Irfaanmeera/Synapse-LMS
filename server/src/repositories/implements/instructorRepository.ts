import { Instructor } from "../../models/instructorModel";
import { IInstructor } from "../../interfaces/instructor";
import { IInstructorRepository } from "../interfaces/instructorRepository.interface";
import { BadRequestError } from "../../constants/errors/badrequestError";

export class InstructorRepository implements IInstructorRepository{

    async createInstructor(instructorData: IInstructor): Promise<IInstructor> {
        const instructor = Instructor.build(instructorData)
        return await instructor.save();
    }

    async findInstructorById(instructorId:string):Promise<IInstructor |null>{
        return await Instructor.findById(instructorId)
    }
    async findInstructorByEmail(email: string): Promise<IInstructor | null> {
        return await Instructor.findOne({ email })
    }
    async updateInstructorVerification(email: string): Promise<IInstructor> {
        const instructor = await Instructor.findOne({email})
        instructor!.set({isVerified:true})
        return await instructor!.save()
    }
    async updateInstructor(instructorData:IInstructor): Promise<IInstructor>{
        const {id,name,mobile,qualification,description} = instructorData;
        const instructor = await Instructor.findById(id)
        if(!instructor){
            throw new BadRequestError('Instructor not found')
        }
        instructor.set({
            name,
            mobile,
            qualification,
            description
        })
        return await instructor.save()
    }

    async updateInstructorImage(instructorId:string,image:string):Promise<IInstructor>{
        const instructor = await Instructor.findById(instructorId)
        if(!instructor){
            throw new BadRequestError('Invalid Id')
        }
        instructor.set({
            image,
        })
        return await instructor.save()
    }

    
}