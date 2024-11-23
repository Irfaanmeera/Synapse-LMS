/* eslint-disable @typescript-eslint/no-explicit-any */
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
      async getEnrolledCoursesByInstructor(instructorId: string): Promise<IEnrolledCourse[]> {
        // Fetch enrolled courses and populate necessary fields, filtering by instructor ID in course
        const enrolledCourses = await EnrolledCourse.find({})
          .populate({
            path: "courseId",
            match: { instructor: instructorId }, // Filter by instructor ID in the course document
            populate: [
              { path: "modules.module", model: "module" },
              { path: "category", model: "category" },
              { path: "instructor", model: "instructor" }
            ]
          })
          .populate("studentId") // Populate student details
          .sort({ createdAt: -1 });
    
      
        // Filter out any enrolled courses where courseId is null (i.e., no match for the instructor)
        const filteredEnrolledCourses = enrolledCourses.filter(
          (enrolledCourse) => enrolledCourse.courseId !== null
        );
      
        // If no courses are found for this instructor, you could throw an error or return an empty array
        if (!filteredEnrolledCourses.length) {
          throw new Error("No enrolled courses found for this instructor.");
        }
      
        return filteredEnrolledCourses;
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

      

        if (!course) {
          throw new BadRequestError("Enrollment not found");
        }
        if (!course.progression?.includes(chapterTitle)) {
          course.progression?.push(chapterTitle);
        }
        const updatedCourse = await course.save();
        
        return updatedCourse;
      }

      async completedStatus(enrolledId: string): Promise<void> {
        const course = await EnrolledCourse.findById(enrolledId);
        if (course) {
          course.set({ completed: true });
        }
        await course?.save();
      }
      async getEnrolledCoursesByAdmin(): Promise<IEnrolledCourse[]> {
        // Fetch all enrolled courses and populate necessary fields, sorted by newest first
        const enrolledCourses = await EnrolledCourse.find({})
          .populate({
            path: "courseId",
            populate: [
              { path: "modules.module", model: "module" },
              { path: "category", model: "category" },
              { path: "instructor", model: "instructor" },
            ],
          })
          .populate("studentId") // Populate student details
          .sort({ createdAt: -1 }); // Sort by newest first (descending order)
      
        // If no enrolled courses are found, throw an error or return an empty array
        if (!enrolledCourses.length) {
          throw new Error("No enrolled courses found.");
        }
      
        return enrolledCourses;
      }
      
      async getTotalRevenue(): Promise<number> {
        const result = await EnrolledCourse.aggregate([
          {
            $match: {
              status: true, // Assuming you want to consider only enrolled courses with status true
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$price" },
            },
          },
          {
            $project: {
              _id: 0,
              totalRevenue: 1,
            },
          },
        ]);
    
        return result.length > 0 ? result[0].totalRevenue : 0;
      }

      async getRevenueData(filter: "weekly" | "monthly" | "yearly") {
        const date = new Date();
        let startDate: Date, groupFormat: any;
      
        // Determine the date range and grouping logic based on the filter
        switch (filter) {
          case "weekly":
            startDate = new Date(date.setDate(date.getDate() - 7));
            groupFormat = { $dayOfWeek: "$createdAt" }; // Group by day of the week
            break;
          case "monthly":
            startDate = new Date(date.setMonth(date.getMonth() - 1));
            groupFormat = { $dayOfMonth: "$createdAt" }; // Group by day of the month
            break;
          case "yearly":
            startDate = new Date(date.setFullYear(date.getFullYear() - 1));
            groupFormat = { $month: "$createdAt" }; // Group by month
            break;
          default:
            throw new Error("Invalid filter type");
        }
      
        // Aggregate query to compute revenue data
        const revenueData = await EnrolledCourse.aggregate([
          {
            $match: {
              status: true, // Only consider enrolled courses with status true
              createdAt: { $gte: startDate }, // Filter by date range
            },
          },
          {
            $group: {
              _id: groupFormat, // Group by the specified format
              totalRevenue: { $sum: "$price" }, // Calculate total revenue
            },
          },
          {
            $sort: { _id: 1 }, // Sort the grouped data by the grouping field (_id)
          },
          {
            $project: {
              _id: 1,
              totalRevenue: 1,
            },
          },
        ]);
      
        console.log("Revenue Data:", revenueData); // Debugging output
        return revenueData;
      }
      
      
    
  }
 