import { IStudentService } from "../interfaces/studentService.interface";
import { IStudent } from "../../interfaces/student";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { BadRequestError } from "../../constants/errors/badrequestError";
import s3 from '../../../config/aws.config'
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ICourse } from "../../interfaces/course";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { InstructorRepository } from "../../repositories/implements/instructorRepository";
import { ICategory } from "../../interfaces/category";



export class StudentService implements IStudentService {
    constructor(
        private studentRepository: StudentRepository,
        private instructorRepository: InstructorRepository,
        private courseRepository: CourseRepository,
        private categoryRepository: CategoryRepository,
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
            throw new BadRequestError('User not found')
        } else {
            return student;
        }
    }

    async verifyStudent(email: string): Promise<IStudent> {
        return this.studentRepository.updateUserVerification(email)
    }
    async getUserByEmail(email: string): Promise<IStudent|null> {
        return this.studentRepository.findStudentByEmail(email);
    }

    async findStudentById(studentId: string): Promise<IStudent| null> {
        return this.studentRepository.findStudentById(studentId)
    }

    async updateStudent(studentData:IStudent): Promise <IStudent>{
        return this.studentRepository.updateStudent(studentData)
    }
    async updateImage(
        studentId: string,
        file: Express.Multer.File
      ): Promise<IStudent > {
        try {
          // Step 1: Find the current profile image of the student
          const student = await this.studentRepository.findStudentById(studentId);
      
          // Step 2: If there's an existing image, delete it from the S3 bucket
          if (student && student.image) {
            const fileName = decodeURIComponent(student.image.split("/").pop()!.trim());
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
          return await this.studentRepository.updateImage(studentId, filePath);
        } catch (error) {
          console.error(error);
          throw new BadRequestError("Couldn't upload profile image");
        }
      }
      async getAllCourses(page: number): Promise<{
        courses: ICourse[];
        totalCount: number;
    } |null> {
        return await this.courseRepository.getAllCourses(page);
        
      }
      
 async getAllCategories(): Promise<ICategory[]| null> {
     return await this.categoryRepository.getAllCategories()

 }
}
