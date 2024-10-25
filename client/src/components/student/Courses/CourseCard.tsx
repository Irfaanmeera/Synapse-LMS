/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link } from "react-router-dom";
// import Ratings from "../../instructor/utils/Ratings";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  course: any; // Expecting a course object as a prop
};

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Link to={`/course_details/${course?._id}`}>
      <div className="w-[100%] h-[100%] backdrop-blur border border-[#00000015] rounded-lg p-3 shadow-sm">
        <div className="relative h-[20vh]">
          <img
            src={course.image}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            alt=""
          />
        </div>
        <div className="p-3 flex flex-col justify-between h-[calc(15vh - 3rem)]">
          <div className="h-[50px] overflow-hidden overflow-ellipsis mb-2">
            <h1 className="font-Poppins text-[16px]">
              {course.name.slice(0, 70)}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <h5>{course.enrolled} students</h5>
          </div>
        </div>
        <div className="flex w-full items-center justify-between pt-3">
          <div className="flex">
            <h3>{course.price === 0 ? "Free" : "₹"+ course.price }</h3>
            {/* <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80">
              {course.estimatedPrice}₹
            </h5> */}
          </div>
          <div className="flex items-center pb-3">
            {/* <AiOutlineUnorderedList size={20} /> */}
            <h5 className="pl-2">{course.modules?.length} Chapters</h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
