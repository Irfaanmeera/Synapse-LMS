import { IInstructorService } from "../interfaces/instructorService.interface";
import { IInstructor } from "../../interfaces/instructor";
import { InstructorRepository } from "../../repositories/implements/instructorRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";
import { BadRequestError } from "../../constants/errors/badrequestError";
import s3 from '../../../config/aws.config'
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";


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
    async findInstructorById(instructorId: string): Promise<IInstructor| null> {
        return this.InstructorRepository.findInstructorById(instructorId)
    }

    async updateInstructor(instructorData:IInstructor): Promise <IInstructor>{
        return this.InstructorRepository.updateInstructor(instructorData)
    }
    async updateInstructorImage(
        instructorId: string,
        file: Express.Multer.File
      ): Promise<IInstructor > {
        try {
          // Step 1: Find the current profile image of the student
          const instructor = await this.InstructorRepository.findInstructorById(instructorId);
      
          // Step 2: If there's an existing image, delete it from the S3 bucket
          if (instructor && instructor.image) {
            const fileName = decodeURIComponent(instructor.image.split("/").pop()!.trim());
            const existingImage = {
              Bucket: "synapsebucket-aws", // Your S3 bucket name
              Key: `profile-images/${fileName}`, // The key (filename) of the existing image
            };
            await s3.send(new DeleteObjectCommand(existingImage)); // Delete the existing image
          }
      
          // Step 3: Prepare the new file for upload
          const key = `profile-images/${file.originalname}`; // The key (filename) for the new image
          const params = {
            Bucket: "synapsebucket-aws", // Your S3 bucket name
            Key: key, // The new file's key (where it will be saved in S3)
            Body: file.buffer, // The file's content (from memory)
            ContentType: file.mimetype, // The file's MIME type
          };
      
          // Step 4: Generate the file URL where the image will be accessible
          const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
      
          // Step 5: Upload the file to S3
          await s3.send(new PutObjectCommand(params));
      
          // Step 6: Update the student's profile image in the database with the new URL
          return await this.InstructorRepository.updateInstructorImage(instructorId, filePath);
        } catch (error) {
          console.error(error);
          throw new BadRequestError("Couldn't upload profile image");
        }
      }

}