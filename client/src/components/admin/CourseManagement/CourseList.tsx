import React, { useEffect, useState } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem } from '@mui/material';
import { fetchCoursesByAdmin, updateCourseApproval } from '../../../api/adminApi';
import { Course } from '../../../interfaces/course';
import { Link, useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchCoursesByAdmin();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    getCourses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.instructor?.name.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  };

  const handleApprovalChange = async (courseId: string, newStatus: string) => {
    try {
      await updateCourseApproval(courseId, newStatus);
      setFilteredCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, approval: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Failed to update approval status:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black">Courses</h4>

      {/* Search Bar */}
      <TextField
        label="Search by Course Name or Instructor"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Course</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Instructor</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Level</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Approval Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCourses.map((course, index) => (
                 
              <TableRow key={course.id} sx={{ "&:nth-of-type(even)": { bgcolor: "grey.100" } }} >
                {/* <Link to={`/admin/course/${course.id}`} key={course.id}> */}
                <TableCell align="center">{index + 1 + indexOfFirstItem}</TableCell>
                <TableCell onClick={() => navigate(`/admin/course/${course.id}`)} align="center">{course.name}</TableCell>
                <TableCell align="center">{course.instructor?.name || 'N/A'}</TableCell>
                <TableCell align="center">{course.price}</TableCell>
                <TableCell align="center">{course.level}</TableCell>
                <TableCell align="center">
                  <Select
                    value={course.approval}
                    onChange={(e) => handleApprovalChange(course.id, e.target.value)}
                    sx={{
                      color:
                        course.approval === "Approved" ? "green" :
                        course.approval === "Rejected" ? "red" : "orange",
                      height: 25,
                      minWidth: 90,
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </TableCell>
               
              </TableRow>
             
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Pagination
        count={Math.ceil(filteredCourses.length / itemsPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default AdminCourses;
