import { IInstructorService } from "../interfaces/instructorService.interface";
import { IInstructor } from "../../interfaces/instructor";
import { InstructorRepository } from "../../repositories/implements/instructorRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";


const { BAD_REQUEST } = STATUS_CODES;

export class InstructorService implements IInstructorService {
    constructor(
        private InstructorRepository: InstructorRepository,
    ) { }

    async signup(InstructorData: IInstructor): Promise<IInstructor | null> {
        try {
            const existingInstructor = await this.InstructorRepository.findInstructorByEmail(
                InstructorData.email!
            );
            if (existingInstructor) {
                throw new ErrorHandler("Instructor already exists", BAD_REQUEST);
            } else {
                return await this.InstructorRepository.createInstructor(InstructorData);
            }

        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async login(email: string): Promise<IInstructor> {
        const Instructor = await this.InstructorRepository.findInstructorByEmail(email)
        if (!Instructor) {
            throw new ErrorHandler('Instructor not found', BAD_REQUEST)
        } else {
            return Instructor;
        }
    }

    async verifyInstructor(email: string): Promise<IInstructor> {
        return this.InstructorRepository.updateInstructorVerification(email)
    }
}