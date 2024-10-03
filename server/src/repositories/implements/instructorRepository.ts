import { Instructor } from "../../models/instructorModel";
import { IInstructor } from "../../interfaces/instructor";
import { IInstructorRepository } from "../interfaces/instructorRepository.interface";

export class InstructorRepository implements IInstructorRepository{

    async createInstructor(instructorData: IInstructor): Promise<IInstructor> {
        const instructor = Instructor.build(instructorData)
        return await instructor.save();
    }

    async findInstructorByEmail(email:string):Promise<IInstructor |null>{
        return await Instructor.findOne({email})
    }

    async updateInstructorVerification(email: string): Promise<IInstructor> {
        const instructor = await Instructor.findOne({email})
        instructor!.set({isVerified:true})
        return await instructor!.save()
    }
}