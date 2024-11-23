/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useLocation } from "react-router-dom";
import { getAllCategories, getAllCourses } from "../../../api/studentApi";
import { Course } from "../../../interfaces/course";
import { Breadcrumbs, Link, Pagination } from "@mui/material";

const UserCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage] = useState(9); // Customize how many items to show per page
  const location = useLocation();

  const fetchCourses = async (page: number) => {
    try {
      const response: { courses: Course[]; totalCount: number } = await getAllCourses(page);
      console.log("Course response:", response)
      // Filter courses to show only those that are approved and listed
      const filteredCourses = response.courses.filter(
        (course) => course.approval === "Approved" && course.status === true
      );
      console.log("filtered Course response:", filteredCourses)
      setCourses(filteredCourses);
      setTotalCount(filteredCourses.length); // Update totalCount to match filtered courses
    } catch (error) {
      console.log("Error fetching courses:", error);
      setError("Failed to fetch courses.");
    }
  };

  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const coursesFromLocation = location.state?.courses || [];
    console.log("coursesFromLocation",coursesFromLocation)
    if (coursesFromLocation.length > 0) {
      setCourses(coursesFromLocation.filter(course => course.approval === "Approved" && course.status === true));
    } else {
      fetchCourses(currentPage);
    }
    getCategories();
  }, [currentPage]); // Re-run when currentPage changes

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Handler for pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-10 my-2 w-80vw">
      {error && <div>{error}</div>}

      <div className="mt-10" style={{ padding: "16px" }}>
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
      <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Material-UI Pagination */}
      <div className="flex justify-center items-center mt-6">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="large"
          
        />
      </div>
    </div>
  );
};

export default UserCourses;
