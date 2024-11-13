import { IInstructorService } from "../interfaces/instructorService.interface";
import { IInstructor } from "../../interfaces/instructor";
import { InstructorRepository } from "../../repositories/implements/instructorRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import ErrorHandler from "../../utils/ErrorHandler";
import { BadRequestError } from "../../constants/errors/badrequestError";
import s3, { uploadToS3 } from '../../../config/aws.config'
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
// import { LevelRepository } from "../../repositories/implements/levelRepository";
import { ModuleRepository } from "../../repositories/implements/moduleRepository";
import { EnrolledCourseRepository } from "../../repositories/implements/enrolledCourseRepository";
import { ICourse } from "../../interfaces/course";
import {IModule, IChapter} from '../../interfaces/module'
import { ICategory } from "../../interfaces/category";
import { IEnrolledCourse } from "../../interfaces/enrolledCourse";

const { BAD_REQUEST } = STATUS_CODES;

export class InstructorService implements IInstructorService {
    constructor(
        private InstructorRepository: InstructorRepository,
        private courseRepository: CourseRepository,
        private categoryRepository: CategoryRepository,
        private moduleRepository: ModuleRepository,
        private enrolledCourseRepository: EnrolledCourseRepository,
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
    async findInstructorById(instructorId: string): Promise<IInstructor | null> {
        return this.InstructorRepository.findInstructorById(instructorId)
    }

    async updateInstructor(instructorData: IInstructor): Promise<IInstructor> {
        return this.InstructorRepository.updateInstructor(instructorData)
    }
    async updateInstructorImage(
        instructorId: string,
        file: Express.Multer.File
    ): Promise<IInstructor> {
        try {
            // Step 1: Find the current profile image of the student
            const instructor = await this.InstructorRepository.findInstructorById(instructorId);

            // Step 2: If there's an existing image, delete it from the S3 bucket
            if (instructor && instructor.image) {
                const fileName = decodeURIComponent(instructor.image.split("/").pop()!.trim());
                const existingImage = {
                    Bucket: "synapsebucket-aws", // Your S3 bucket name
                    Key: `instructor-profile/${fileName}`, // The key (filename) of the existing image
                };
                await s3.send(new DeleteObjectCommand(existingImage)); // Delete the existing image
            }

            // Step 3: Prepare the new file for upload
            const key = `instructor-profile/${file.originalname}`; // The key (filename) for the new image
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
    async getMyCourses(instructorId: string, page: number): Promise<{ courses: ICourse[]; totalCount: number; } | null> {
    return await this.courseRepository.getCourseByInstructor(instructorId,page)
   }

   async getSingleCourse(courseId: string): Promise<ICourse| null> {
    
    const course = await this.courseRepository.getSingleCourseForInstructor(
      courseId
    );
    return course ;
  }
  // async createCourse(courseDetails: ICourse): Promise<ICourse> {
  //   return await this.courseRepository.createCourse(courseDetails);
  // }
  async updateCourse(
    courseId: string,
    courseDetails: ICourse,
    file?: Express.Multer.File // Make file optional
): Promise<ICourse> {
    try {
        // Step 1: Find the current course details
        const existingCourse = await this.courseRepository.getSingleCourseForInstructor(courseId);

        // Step 2: If there's an existing image, delete it from the S3 bucket
        if (existingCourse && existingCourse.image) {
            const fileName = decodeURIComponent(existingCourse.image.split("/").pop()!.trim());
            const existingImage = {
                Bucket: "synapsebucket-aws", // Your S3 bucket name
                Key: `courses/${existingCourse.name!.replace(/\s/g, "_")}/image/${fileName}`, // The key (filename) of the existing image
            };
            await s3.send(new DeleteObjectCommand(existingImage)); // Delete the existing image
        }

        // Step 3: Prepare the new file for upload, if provided
        let filePath: string | undefined; // Initialize filePath

        if (file) {
            const sanitizedCourseName = courseDetails.name!.replace(/\s/g, "_"); // Sanitize course name
            const sanitizedFileName = encodeURIComponent(file.originalname); // Sanitize file name

            const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`; // Define S3 key for new image
            const params = {
                Bucket: "synapsebucket-aws", // Your S3 bucket name
                Key: key, // The new file's key (where it will be saved in S3)
                Body: file.buffer, // The file's content (from memory)
                ContentType: file.mimetype, // The file's MIME type
            };

            // Step 4: Generate the file URL where the image will be accessible
            filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

            // Step 5: Upload the file to S3
            await s3.send(new PutObjectCommand(params));
        }

        // Step 6: Update the course in the repository
        const updatedCourseData = {
            ...courseDetails,
            image: filePath || existingCourse!.image // Use the new image URL if provided, else keep the existing one
        };

        return await this.courseRepository.updateCourse(courseId, updatedCourseData);
    } catch (error) {
        console.error(error);
        throw new BadRequestError("Couldn't update course image");
    }
}

  async deleteCourse(courseId: string): Promise<ICourse> {
    return await this.courseRepository.unlistCourse(courseId);
  }
  async listCourse(courseId: string): Promise<ICourse> {
    return await this.courseRepository.listCourse(courseId);
  }
  async getAllCategories(): Promise<ICategory[]| null> {
    return await this.categoryRepository.getListedCategories();
  }
  async createModule(
    moduleDetails: IModule,
    order: number,
    
  ): Promise<IModule> {
    try {
      const { name, courseId } = moduleDetails;

      
      const module = {
        name,
        courseId,
      
      };
      const newModule = await this.moduleRepository.createModule(module);
      await this.courseRepository.addModule(courseId!, {
        module: newModule.id!,
        order,
      });

      return newModule;
    } catch (error) {
      console.log(error);

      throw new BadRequestError("Error in upload video");
    }
  }
  // async addCourseImage(
  //   courseId: string,
  //   file: Express.Multer.File
  // ): Promise<ICourse> {
  //   const course = await this.courseRepository.findCourseById(courseId);
  //   if (!course) {
  //     throw new BadRequestError("Course not found");
  //   }
  //   const sanitizedCourseName = course.name!.replace(/\s/g, "_"); // Replace spaces with underscores or any character
  //   const sanitizedFileName = encodeURIComponent(file.originalname);

  //   const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;

  //   const params = {
  //     Bucket: "synapsebucket-aws",
  //     Key: key,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   };
  //   const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
  //   console.log(filePath);

  //   await s3.send(new PutObjectCommand(params));
  //   return await this.courseRepository.addCourseImage(courseId, filePath);
  // }
  // async addChapter(courseId: string, chapter: IChapter): Promise<IModule> {
  //   return await this.moduleRepository.addChapter(courseId, chapter);
  // }



  async createCourse(courseDetails: ICourse, file: Express.Multer.File): Promise<ICourse> {
    // Step 1: Create the course
    const createdCourse = await this.courseRepository.createCourse(courseDetails);

    // Step 2: Upload the image
    if (file) {
        const sanitizedCourseName = createdCourse.name!.replace(/\s/g, "_"); // Sanitize course name
        const sanitizedFileName = encodeURIComponent(file.originalname); // Sanitize file name

        const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;

        const params = {
            Bucket: "synapsebucket-aws",
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
        console.log(filePath);

        await s3.send(new PutObjectCommand(params)); // Upload the image to S3

        // Step 3: Update the course with the image URL
        if(createdCourse.id){
          return await this.courseRepository.addCourseImage(createdCourse.id, filePath);
        }
 
    }

    // Return the created course without an image if no file was provided
    return createdCourse;
}


async updateModule(moduleId: string, updateData: Partial<IModule>): Promise<IModule | null> {
  return await this.moduleRepository.updateModule(moduleId, updateData);
}

async deleteModule(moduleId: string): Promise<IModule | null> {
  return await this.moduleRepository.deleteModule(moduleId);
}

async addChapter(moduleId: string, chapterData: IChapter, file: Express.Multer.File): Promise<IModule | null> {
  
  const module = await this.moduleRepository.findModuleById(moduleId);
  if (!module) {
    throw new BadRequestError("Module not found");
  }

  // Upload video to S3 and get the file key
  const fileKey = await uploadToS3(file);
  console.log("File key:", fileKey);

  // Construct the full video URL based on the file key
  const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
  chapterData.videoUrl = videoUrl; // Set the videoUrl in chapterData
  console.log("ChapterDataVideoUrl:", chapterData.videoUrl);

  // Add chapter to module
  console.log("Attempting to update module with ID:", moduleId);
  return await this.moduleRepository.addChapter(moduleId, chapterData);
}
async resetForgotPassword(
  email: string,
  password: string
): Promise<IInstructor> {
  const instructor = await this.InstructorRepository.findInstructorByEmail(email)
  if (!instructor) {
    throw new BadRequestError("Instructor not found");
  }
  return await this.InstructorRepository.updatePassword(
    instructor.id!,
    password
  );
}
 async getEnrolledCoursesByInstructor(instructorId: string): Promise<IEnrolledCourse[] | null> {
     const enrolledCourses = await this.enrolledCourseRepository.getEnrolledCoursesByInstructor(instructorId)

     if(!enrolledCourses){
      throw new BadRequestError('No enrollment')
     }
     return enrolledCourses;
 }

}