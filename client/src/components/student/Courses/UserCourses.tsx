import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
import { Course } from "../../../interfaces/course";
import { Pagination, Chip, Typography, Button } from "@mui/material";
import { Category } from "../../../interfaces/Category";

const UserCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // State for selected category ID
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);

  // Fetch all courses or category-specific courses
  const fetchCourses = async (page: number, categoryId?: string) => {
    try {
      console.log("Fetching courses - page:", page, "categoryId:", categoryId); // Debug log

      const response: { courses: Course[]; totalCount: number } = categoryId
        ? await getCourses(page, categoryId) // Pass categoryId if selected
        : await getAllCourses(page); // Otherwise fetch all courses

      const filteredCourses = response.courses.filter(
        (course) => course.approval === "Approved" && course.status === true
      );
      setCourses(filteredCourses);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses.");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    console.log("Category selected:", categoryId); // Debug log
    setSelectedCategoryId(categoryId); // Set the selected category ID
    setCurrentPage(1); // Reset to first page
    fetchCourses(1, categoryId); // Call fetchCourses with the selected category ID
  };

  // Show all courses when "All" is clicked
  const handleShowAll = () => {
    setSelectedCategoryId(""); // Clear the selected category ID
    setCurrentPage(1); // Reset to first page
    fetchCourses(1); // Fetch all courses
  };

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchCourses(page, selectedCategoryId);
  };

  useEffect(() => {
    // Initial fetch for all courses and categories
    fetchCourses(1); // Fetch courses for the first page initially
    fetchCategories(); // Fetch categories once on component mount
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="mx-10 my-2 w-80vw">
      {error && <div>{error}</div>}

      {/* Category Bar */}
      <div className="flex gap-2 overflow-x-auto py-4">
  {/* "All" Chip with dynamic color */}
  <Chip
    label="All"
    onClick={handleShowAll}
    color={selectedCategoryId === "" ? "primary" : "default"} // Highlight "All" when no category is selected
    style={{
      cursor: "pointer",
      borderColor: selectedCategoryId === "" ? "#1976d2" : "#ccc", // Apply a custom border color when selected
      backgroundColor: selectedCategoryId === "" ? "#222C44" : "transparent", // Apply background when selected
      fontWeight: selectedCategoryId === "" ? "bold" : "normal", // Bold font when selected
    }}
  />

  {/* Category Chips */}
  {categories.map((cat) => (
    <Chip
      key={cat.id}
      label={cat.category}
      clickable
      onClick={() => handleCategorySelect(cat.id)}
      color={selectedCategoryId === cat.id ? "primary" : "default"} // Highlight selected category
      style={{
        cursor: "pointer",
        borderColor: selectedCategoryId === cat.id ? "#1976d2" : "#ccc", // Apply custom border color when selected
        backgroundColor: selectedCategoryId === cat.id ? "#222C44" : "transparent", // Apply background when selected
        fontWeight: selectedCategoryId === cat.id ? "bold" : "normal", // Bold font when selected
      }}
    />
  ))}
</div>

      {/* Display courses or "No courses in this category" message */}
      {courses.length === 0 ? (
        <div className="text-center py-6">
          <Typography variant="h6" color="textSecondary">
            No courses available in this category.
          </Typography>
        </div>
      ) : (
        <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
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





// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip, Typography } from "@mui/material";
// import { Category } from "../../../interfaces/category";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // State for selected category ID
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9);

//   // Fetch all courses or category-specific courses
//   const fetchCourses = async (page: number, categoryId?: string) => {
//     try {
//       console.log("Fetching courses - page:", page, "categoryId:", categoryId); // Debug log

//       const response: { courses: Course[]; totalCount: number } = categoryId
//         ? await getCourses(page, categoryId) // Pass categoryId if selected
//         : await getAllCourses(page); // Otherwise fetch all courses

//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     console.log("Category selected:", categoryId); // Debug log
//     setSelectedCategoryId(categoryId); // Set the selected category ID
//     setCurrentPage(1); // Reset to first page
//     fetchCourses(1, categoryId); // Call fetchCourses with the selected category ID
//   };

//   // Handle pagination
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategoryId);
//   };

//   useEffect(() => {
//     // Initial fetch for all courses and categories
//     fetchCourses(1); // Fetch courses for the first page initially
//     fetchCategories(); // Fetch categories once on component mount
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       {/* Category Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         {categories.map((cat) => (
//           <Chip
//             key={cat.id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat!.id)} // Pass categoryId here
//             color={selectedCategoryId === cat.id ? "primary" : "default"} // Highlight selected category
//           />
//         ))}
//       </div>

//       {/* Display courses or "No courses in this category" message */}
//       {courses.length === 0 ? (
//         <div className="text-center py-6">
//           <Typography variant="h6" color="textSecondary">
//             No courses available in this category.
//           </Typography>
//         </div>
//       ) : (
//         <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//           {courses.map((course) => (
//             <CourseCard key={course.id} course={course} />
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;



// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip } from "@mui/material";
// import { Category } from "../../../interfaces/category";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // State for selected category ID
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9);

//   // Fetch all courses or category-specific courses
//   const fetchCourses = async (page: number, categoryId?: string) => {
//     try {
//       console.log("Fetching courses - page:", page, "categoryId:", categoryId); // Debug log

//       const response: { courses: Course[]; totalCount: number } = categoryId
//         ? await getCourses(page, categoryId) // Pass categoryId if selected
//         : await getAllCourses(page); // Otherwise fetch all courses

//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     console.log("Category selected:", categoryId); // Debug log
//     setSelectedCategoryId(categoryId); // Set the selected category ID
//     setCurrentPage(1); // Reset to first page
//     fetchCourses(1, categoryId); // Call fetchCourses with the selected category ID
//   };

//   // Handle pagination
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategoryId);
//   };

//   useEffect(() => {
//     // Initial fetch for all courses and categories
//     fetchCourses(1); // Fetch courses for the first page initially
//     fetchCategories(); // Fetch categories once on component mount
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       {/* Category Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         {categories.map((cat) => (
//           <Chip
//             key={cat.id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat!.id)} // Pass categoryId here
//             color={selectedCategoryId === cat.id ? "primary" : "default"} // Highlight selected category
//           />
//         ))}
//       </div>

//       {/* Display courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;



// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip } from "@mui/material";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // Store categoryId, initially empty for all
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9); // Customize items per page

//   // Fetch all courses or category-specific courses
//   const fetchCourses = async (page: number, categoryId?: string) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = categoryId
//         ? await getCourses(page, categoryId) // Fetch courses based on categoryId
//         : await getAllCourses(page); // Fetch all courses initially
// console.log(response,"Response in user courses")
//       // Filter approved and listed courses
//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategoryId(categoryId); // Set selected categoryId
//     setCurrentPage(1); // Reset to first page
//     fetchCourses(1, categoryId); // Fetch courses based on categoryId
//   };

//   // Handle pagination
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategoryId); // Fetch courses based on current category
//   };

//   useEffect(() => {
//     // Initial fetch for all courses and categories
//     fetchCourses(1); // Fetch all courses initially
//     fetchCategories(); // Fetch categories
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       {/* Category Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         {categories.map((cat) => (
//           <Chip
//             key={cat._id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat._id)} // Pass categoryId
//             // color={selectedCategoryId === cat._id ? "primary" : "default"}
//           />
//         ))}
//       </div>

//       {/* Display courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;



// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip } from "@mui/material";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9); // Customize items per page

//   // Fetch courses (all or category-specific)
//   const fetchCourses = async (page: number, categoryId?: string) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = categoryId
//         ? await getCourses(page, categoryId)
//         : await getAllCourses(page);

//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId);
//     setCurrentPage(1); // Reset pagination to the first page
//     fetchCourses(1, categoryId);
//   };

//   // Handle pagination change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategory);
//   };

//   useEffect(() => {
//     // Initial fetch for courses and categories
//     fetchCourses(1);
//     fetchCategories();
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div className="text-red-500 text-center">{error}</div>}

//       {/* Category Selection Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         <Chip
//           label="All"
//           clickable
//           onClick={() => handleCategorySelect("All")}
//           color={selectedCategory === "All" ? "primary" : "default"}
//         />
//         {categories.map((cat) => (
//           <Chip
//             key={cat._id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat._id)} // Pass category ID for selection
//             color={selectedCategory === cat._id ? "primary" : "default"} // Highlight selected category
//           />
//         ))}
//       </div>

//       {/* Display Courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;




// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip } from "@mui/material";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9); // Customize items per page

//   // Fetch courses (all or category-specific)
//   const fetchCourses = async (page: number, category?: string) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = category
//         ? await getCourses(page, categoryId)
//         : await getAllCourses(page);

//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     setCurrentPage(1); // Reset pagination to the first page
//     fetchCourses(1, category === "All" ? undefined : category);
//   };

//   // Handle pagination change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategory === "All" ? undefined : selectedCategory);
//   };

//   useEffect(() => {
//     // Initial fetch for courses and categories
//     fetchCourses(1);
//     fetchCategories();
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div className="text-red-500 text-center">{error}</div>}

//       {/* Category Selection Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         <Chip
//           label="All"
//           clickable
//           onClick={() => handleCategorySelect("All")}
//           color={selectedCategory === "All" ? "primary" : "default"}
//         />
//         {categories.map((cat) => (
//           <Chip
//             key={cat._id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat._id)}
//             color={selectedCategory === cat._id ? "primary" : "default"}
//           />
//         ))}
//       </div>

//       {/* Display Courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;






// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Pagination, Chip } from "@mui/material";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage] = useState<number>(9); // Customize items per page

//   // Fetch all courses or category-specific courses
//   const fetchCourses = async (page: number, category?: string) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = category
//         ? await getCourses(page, category)
//         : await getAllCourses(page);
      
//       // Filter approved and listed courses
//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(response.totalCount);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setError("Failed to fetch courses.");
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     setCurrentPage(1); // Reset to first page
//     fetchCourses(1, category === "All" ? undefined : category); // Fetch courses based on selected category
//   };

//   // Handle pagination
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     fetchCourses(page, selectedCategory === "All" ? undefined : selectedCategory);
//   };

//   useEffect(() => {
//     // Initial fetch for all courses and categories
//     fetchCourses(1);
//     fetchCategories();
//   }, []);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       {/* Category Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         <Chip
//           label="All"
//           clickable
//           onClick={() => handleCategorySelect("All")}
//           color={selectedCategory === "All" ? "primary" : "default"}
//         />
//         {categories.map((cat) => (
//           <Chip
//             key={cat._id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat.category)}
//             color={selectedCategory === cat.category ? "primary" : "default"}
//           />
//         ))}
//       </div>

//       {/* Display courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;












// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { useLocation } from "react-router-dom";
// import { getAllCategories, getAllCourses, getCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Breadcrumbs, Link, Pagination, Chip } from "@mui/material";
// import { Category } from "../../../interfaces/Category";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All"); // Track selected category
//   const [currentPage, setCurrentPage] = useState(1); // For pagination
//   const [itemsPerPage] = useState(9); // Customize how many items to show per page
//   const location = useLocation();

//   const fetchCourses = async (page: number, category?: string) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = await getAllCourses(page, category);
//       // Filter courses to show only those that are approved and listed
//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       setCourses(filteredCourses);
//       setTotalCount(filteredCourses.length);
//     } catch (error) {
//       console.log("Error fetching courses:", error);
//       setError("Failed to fetch courses.");
//     }
//   };

//   const getCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedCategory = e.target.value;
//     setSelectedCategory(e.target.value);
//     if (selectedCategory) {
//       console.log(selectedCategory);
//       getCourse({ category: selectedCategory });
//     } else {
//       getCourse({});
//     }
//   };

//   const getCourse = async ({
//     page,
//     category,
//   }: {
//     page?: number;
//     category?: string;
//   }) => {
   
//     const response: {
//       courses: Course[];
//       totalCount: number;
//       categories: Category[];
//     } | null = await getCourses({ page, category });
//     setCourses(response?.courses as Course[]);
//     setTotalCount(response?.totalCount as number);
//     setCategories(response?.categories);
//   };


//   useEffect(() => {
//     const coursesFromLocation = location.state?.courses || [];
//     if (coursesFromLocation.length > 0) {
//       setCourses(coursesFromLocation.filter(course => course.approval === "Approved" && course.status === true));
//     } else {
//       fetchCourses(currentPage);
//     }
//     getCategories();
//   }, [currentPage]);

//   // Handler for category selection
//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     setCurrentPage(1); // Reset to the first page when changing category
//     fetchCourses(1, category === "All" ? undefined : category); // Fetch courses based on selected category
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       {/* Category Bar */}
//       <div className="flex gap-4 overflow-x-auto py-4">
//         <Chip
//           label="All"
//           clickable
//           onClick={() => handleCategorySelect("All")}
//           color={selectedCategory === "All" ? "primary" : "default"}
//         />
//         {categories.map((cat) => (
//           <Chip
//             key={cat._id}
//             label={cat.category}
//             clickable
//             onClick={() => handleCategorySelect(cat.category)}
//             color={selectedCategory === cat.category ? "primary" : "default"}
//           />
//         ))}
//       </div>

//       {/* Display courses */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={(event, page) => setCurrentPage(page)}
//           color="primary"
//           shape="rounded"
//           size="large"
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;





// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { useLocation } from "react-router-dom";
// import { getAllCategories, getAllCourses } from "../../../api/studentApi";
// import { Course } from "../../../interfaces/course";
// import { Breadcrumbs, Link, Pagination } from "@mui/material";

// const UserCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [error, setError] = useState("");
//   const [categories, setCategories] = useState<{ _id: string; category: string }[]>([]);
//   const [currentPage, setCurrentPage] = useState(1); // For pagination
//   const [itemsPerPage] = useState(9); // Customize how many items to show per page
//   const location = useLocation();

//   const fetchCourses = async (page: number) => {
//     try {
//       const response: { courses: Course[]; totalCount: number } = await getAllCourses(page);
//       console.log("Course response:", response)
//       // Filter courses to show only those that are approved and listed
//       const filteredCourses = response.courses.filter(
//         (course) => course.approval === "Approved" && course.status === true
//       );
//       console.log("filtered Course response:", filteredCourses)
//       setCourses(filteredCourses);
//       setTotalCount(filteredCourses.length); // Update totalCount to match filtered courses
//     } catch (error) {
//       console.log("Error fetching courses:", error);
//       setError("Failed to fetch courses.");
//     }
//   };

//   const getCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (Array.isArray(response)) {
//         setCategories(response);
//       } else {
//         console.error("Unexpected response structure:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     const coursesFromLocation = location.state?.courses || [];
//     console.log("coursesFromLocation",coursesFromLocation)
//     if (coursesFromLocation.length > 0) {
//       setCourses(coursesFromLocation.filter(course => course.approval === "Approved" && course.status === true));
//     } else {
//       fetchCourses(currentPage);
//     }
//     getCategories();
//   }, [currentPage]); // Re-run when currentPage changes

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   // Handler for pagination change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="mx-10 my-2 w-80vw">
//       {error && <div>{error}</div>}

//       <div className="mt-10" style={{ padding: "16px" }}>
//         {/* <Breadcrumbs aria-label="breadcrumb">
//           <Link color="inherit" href="/" underline="hover">
//             Home
//           </Link>
//           <Link color="inherit" href="/courses" underline="hover">
//             Courses
//           </Link>
//         </Breadcrumbs> */}
//       </div>

//       {/* Display courses directly */}
//       <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Material-UI Pagination */}
//       <div className="flex justify-center items-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           shape="rounded"
//           size="large"
          
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCourses;
