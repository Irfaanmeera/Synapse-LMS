import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Course } from "../../interfaces/course";
import { fetchInstructorCourses } from "../../api/instructorApi";



const CourseDisplay = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8; // Number of courses per page

  // Replace with actual instructor ID

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetchInstructorCourses(page); // Ensure page is passed correctly
        console.log("InstructorCourses: ", response); // Log the full response
        setCourses(response.courses); // Correctly set the courses
        setTotalCount(response.totalCount); // Correctly set the total count
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image || "default-course-image.jpg"}
                  alt={course.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  {/* <Typography variant="subtitle2" color="text.secondary">
                    Category: {course.category?.category}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Level: {course.level?.level}
                  </Typography> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Pagination
        count={Math.ceil(totalCount / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default CourseDisplay;
