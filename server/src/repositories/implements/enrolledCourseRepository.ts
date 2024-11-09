import { IEnrolledCourse } from "../../interfaces/enrolledCourse";
import { IEnrolledCourseRepository } from "../interfaces/enrolledCourseRepository.interface";
import { EnrolledCourse } from "../../models/enrolledCourse";
import { BadRequestError } from "../../constants/errors/badrequestError";


export class EnrolledCourseRepository implements IEnrolledCourseRepository {
    async createCourse(courseDetails: IEnrolledCourse): Promise<IEnrolledCourse> {
      const enrollCourse = EnrolledCourse.build(courseDetails);
      return await enrollCourse.save();
    }
  
    async getCourseById(courseId: string): Promise<IEnrolledCourse> {
      const enrolledCourse = await EnrolledCourse.findById(courseId).populate({
        path: "courseId",
        populate: {
          path: "modules.module",
          model: "module",
        },
      });

      if (!enrolledCourse) {
        throw new BadRequestError("Course not found");
      }
      return enrolledCourse;
    }
    async getCourseByStudentIdAndCourseId(studentId: string, courseId: string): Promise<IEnrolledCourse | null> {
        return await EnrolledCourse.findOne({ studentId, courseId }).populate({
          path: "courseId",
          populate: {
            path: "modules.module",
            model: "module",
          },
        });
      }

      async getEnrolledCoursesByStudent(studentId: string): Promise<IEnrolledCourse[]> {
          const enrolledCourses = EnrolledCourse.find({studentId}).populate({
            path:"courseId",
            populate:[
              {path:"modules.module",model:'module'},
              {path:'category',model:'category'},
              {path:'instructor',model:'instructor'},

            ]
          });
          if(!enrolledCourses){
            throw new BadRequestError('Enrollment not found')
          }
          return enrolledCourses;
      }
      async getEnrolledCoursesByCourseId(
        courseId: string
      ): Promise<IEnrolledCourse[]> {
        return await EnrolledCourse.find({ courseId }).populate("studentId");
      }

      async checkEnrolledCourse(
        courseId: string,
        studentId: string
      ): Promise<IEnrolledCourse | null> {
        return await EnrolledCourse.findOne({ studentId, courseId });
      }

      async addModuleToProgression(
        enrollmentId: string,
        chapterTitle: string
      ): Promise<IEnrolledCourse> {
        const course = await EnrolledCourse.findById(enrollmentId);

        console.log("Repository course:",course)

        if (!course) {
          throw new BadRequestError("Enrollment not found");
        }
        if (!course.progression?.includes(chapterTitle)) {
          course.progression?.push(chapterTitle);
        }
        const updatedCourse = await course.save();
        console.log("Updated Course: ", updatedCourse)
        return updatedCourse;
      }

      async completedStatus(enrolledId: string): Promise<void> {
        const course = await EnrolledCourse.findById(enrolledId);
        if (course) {
          course.set({ completed: true });
        }
        await course?.save();
      }
  }
 