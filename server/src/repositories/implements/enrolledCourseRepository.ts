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
      const enrolledCourse = await EnrolledCourse.findById(courseId);
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
              {path:'level',model:'level'},
              {path:'category',model:'category'},
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
      }
 