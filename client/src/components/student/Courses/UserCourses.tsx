/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import {  useLocation } from "react-router-dom";
import { getAllCategories, getAllCourses } from "../../../api/studentApi";
import { Course } from "../../../interfaces/course";
import { Breadcrumbs, Typography,Link } from "@mui/material";

const UserCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
  const location = useLocation();

  const fetchCourses = async (page: number) => {
    try {
    const response: { courses: Course[]; totalCount: number } = await getAllCourses(page);
      console.log('Courses: ', response);
      setCourses(response.courses);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.log("Error fetching courses:", error);
      setError("Failed to fetch courses.");
    }
  };

  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      if (Array.isArray(response)) {
        console.log('Category Response:', response);
        setCategories(response); // Set the state with the array of categories
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const coursesFromLocation = location.state?.courses || [];
    if (coursesFromLocation.length > 0) {
      console.log(coursesFromLocation);
      setCourses(coursesFromLocation);
    } else {
      fetchCourses(1);
    }
    getCategories();
  }, []);

  return (
    <div className="mx-10 my-2 w-80vw">
      {error && <div>{error}</div>}
{/* 
      {categories.length > 0 && (
        <div className="hidden md:flex items-center justify-between mt-4 mb-10 p-4 shadow-lg rounded-md">
          {categories.map((category) => (
            <div key={category._id}>{category.category}</div> // Adjust according to your category structure
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Search Courses"
        className="mb-10 rounded-md w-[300px] p-1 border border-gray-200"
        // Search functionality removed
      /> */}

<div className="mt-10" style={{ padding: '16px'}}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" underline="hover">
              Home
            </Link>
            <Link color="inherit" href="/courses" underline="hover">
              Courses
            </Link>
      
          </Breadcrumbs>
        </div>

      {/* Display courses directly */}
      <div className=" ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {courses.map((course) => (
        
          <div key={course.id}>
            <CourseCard course={course} /> {/* Pass course data to CourseCard */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCourses;
