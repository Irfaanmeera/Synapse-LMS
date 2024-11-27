import { IStudentService } from "../interfaces/serviceInterfaces/IStudentService";
import { BadRequestError } from "../constants/errors/badrequestError";
import s3 from '../config/aws.config'
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ICourse,ISearch} from "../interfaces/entityInterface/ICourse";
import { CourseRepository,CategoryRepository,InstructorRepository,EnrolledCourseRepository,ModuleRepository,StudentRepository } from "../repositories";
import { ICategory,IStudent,IEnrolledCourse } from "../interfaces/entityInterface";
import { NotFoundError } from "../constants/errors/notFoundError";
import Stripe from "stripe";


// import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const INSTRUCTOR_PERCENTAGE = 70;

export class StudentService implements IStudentService {
    constructor(
        private studentRepository: StudentRepository,
        private instructorRepository: InstructorRepository,
        private courseRepository: CourseRepository,
        private categoryRepository: CategoryRepository,
        private moduleRepository: ModuleRepository,
        private enrolledCourseRepository : EnrolledCourseRepository,
    ) { }

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
      
      // async getCourses({
      //   page,
      //   category,
      // }: {
      //   page: number;
      //   category?: string;
      // }): Promise<{
      //   courses: ICourse[];
      //   totalCount: number;
      //   categories: ICategory[];
      // } | null> {
      //   const courseDetails = await this.courseRepository.getListedCourses({
      //     page,
      //     category,
      //   });
      //   const categories = await this.categoryRepository.getListedCategories();
      //   const result = { ...courseDetails, categories } as {
      //     courses: ICourse[];
      //     totalCount: number;
      //     categories: ICategory[];
      //   } | null;
      //   console.log("Result from get courses cateogories",result)
      //   return result;
      // }

      async getCoursesByCategoryId(categoryId: string, page: number = 1, limit: number = 10): Promise<{ courses: ICourse[], total: number }> {
        // Validate categoryId is not empty or invalid
        if (!categoryId) {
            throw new Error("Category ID is required");
        }

        // Fetch courses based on category ID from the repository
        const result = await this.courseRepository.getCoursesByCategory(categoryId, page, limit);

        return result;
    }

      // async fetchCoursesByCategory(
      //   category: string,
      //   page: number = 1,
      //   itemsPerPage: number = 9
      // ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
      //   const result = await this.courseRepository.getCoursesByCategory(category, page, itemsPerPage);
      
      //   if (!result) {
      //     return null; 
      //   }
      
      //   const { courses, totalCount } = result;
      //   return { courses, totalCount };
      // }
      
 async getAllCategories(): Promise<ICategory[]| null> {
     return await this.categoryRepository.getAllCategories()

 }
 async getSingleCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.getSingleCourseForInstructor(
      courseId
    );
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  }
  
  async searchCourse(details: ISearch): Promise<ICourse[] | null> {
    const course = await this.courseRepository.searchCoursesForStudents(
      details
    );
    return course;
  }
  async updatePassword(studentId: string, password: string): Promise<IStudent> {
    return await this.studentRepository.udpatePassword(studentId, password);
  }
  async resetForgotPassword(
    email: string,
    password: string
  ): Promise<IStudent> {
    const student = await this.studentRepository.findStudentByEmail(email);
    if (!student) {
      throw new BadRequestError("Student not found");
    }
    return await this.studentRepository.udpatePassword(student.id!, password);
  }
   async stripePayment(courseId: string, studentId: string): Promise<string> {
       const course = await this.courseRepository.findCourseById(courseId)
       const existingEnrollment = await this.enrolledCourseRepository.checkEnrolledCourse(courseId,studentId)
       if(existingEnrollment){
            throw new BadRequestError('Already Enrolled')
       }
       if(!course){
        throw new BadRequestError("Course not found")
       }
       const payment = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.name as string,
              },
              unit_amount: course.price! * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.ORIGIN}/status?success=true&courseId=${courseId}`,
        cancel_url: `${process.env.ORIGIN}/status`,
      });
      return payment.url!;
   }
    
   async enrollCourse(courseId: string, studentId: string): Promise<IEnrolledCourse> {
       const existingEnrolledCourse = await this.enrolledCourseRepository.checkEnrolledCourse(courseId,studentId)

       if(existingEnrolledCourse){
        throw new BadRequestError('Course already enrolled')
       }
       const course = await this.courseRepository.findCourseById(courseId)
       await this.studentRepository.courseEnroll(studentId,courseId)

       const courseDetails = {
        courseId,
        studentId,
        price:course?.price,
       }
       const enrolledCourse = await this.enrolledCourseRepository.createCourse(courseDetails)
       const instructorAmount = (course!.price!  * INSTRUCTOR_PERCENTAGE)/100;
       const description = `Enrollment fee of ${course?.name} (ID: ${course?.id})`;
       if (course) {
        await this.instructorRepository.addToWallet(
          course.instructor!,
          instructorAmount
        );
        await this.instructorRepository.addWalletHistory(
          course.instructor!,
          instructorAmount,
          description,
        );
        await this.courseRepository.incrementEnrolledCount(courseId);
      }
      return enrolledCourse;
   }
   
  async getEnrolledCourse(
    studentId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    const enrolledCourse=  await this.enrolledCourseRepository.getCourseByStudentIdAndCourseId(
      studentId,courseId
    );
    console.log("Enrolled course in repo:", enrolledCourse)
    return enrolledCourse;
  }

  async getAllEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]> {
    return await this.enrolledCourseRepository.getEnrolledCoursesByStudent(
      studentId
    );
  }

  async addProgression(
    enrollmentId: string,
    chapterTitle: string
  ): Promise<IEnrolledCourse> {
    const response = await this.enrolledCourseRepository.addModuleToProgression(
      enrollmentId,
      chapterTitle,
    );

    console.log("response from service:", response)

    // const course = await this.courseRepository.findCourseById(
    //   response.courseId!
    // );
    // if (
    //   course?.modules?.length === response.progression?.length &&
    //   !response.completed
    // ) {
    //   const student = await this.studentRepository.findStudentById(
    //     response.studentId!
    //   );
    //   const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     service: "Gmail",
    //     secure: true,
    //     auth: {
    //       user: process.env.TRANSPORTER_EMAIL,
    //       pass: process.env.TRANSPORTER_PASSWORD,
    //     },
    //   });
    //   transporter.sendMail({
    //     to: student!.email,
    //     from: process.env.TRANSPORTER_EMAIL,
    //     subject: "SYNAPSE: Course Completion Certificate",
    //     html: `<div><h1>Course completion certificate from Synapse</h1></div>`,
    //     attachments: [
    //       {
    //         filename: "certificate.jpg",
    //         path: __dirname + "/../../../src/files/certificate.jpg",
    //       },
    //     ],
    //   });
    //   await this.enrolledCourseRepository.completedStatus(response.id!);
    // }
    return response;
  }

  async getTotalChapterCountByCourseId(courseId: string):Promise<number>{
    return await this.moduleRepository.getTotalChapterCount(courseId)
  }

}
