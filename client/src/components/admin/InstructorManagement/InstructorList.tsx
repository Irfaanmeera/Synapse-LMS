import { useEffect, useState } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { blockInstructor, getAllInstructors, unblockInstructor } from '../../../api/adminApi';
import { Instructor } from '../../../interfaces/Instructor';

const InstructorList = () => {
  const [instructorList, setInstructorList] = useState<Instructor[]>([]);
  const [filteredList, setFilteredList] = useState<Instructor[]>([]);  // List after applying search filter
  const [searchQuery, setSearchQuery] = useState<string>('');  // Search query
  const [currentPage, setCurrentPage] = useState<number>(1);  // Current page for pagination
  const [itemsPerPage] = useState<number>(5);  // Number of items per page

  // Fetch all instructors
  const getInstructors = async () => {
    try {
      const response = await getAllInstructors();
      console.log("Response in instructor list by admin:", response);
      setInstructorList(response); // Assuming `response.data.instructors` is the array of instructors
      setFilteredList(response); // Initialize filteredList with all instructors
    } catch (error) {
      console.log(error);
    }
  };

  // Handle block action
  const handleBlock = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await blockInstructor(id);
    console.log("Response in block", response);
    if (response) {
      const newList = instructorList.map((instructor) =>
        instructor?.id === id ? { ...instructor, isBlocked: true } : instructor
      );
      setInstructorList(newList);
      setFilteredList(newList); // Update filtered list after block action
    }
  };

  // Handle unblock action
  const handleUnblock = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await unblockInstructor(id);
    if (response) {
      const newList = instructorList.map((instructor) =>
        instructor.id === id ? { ...instructor, isBlocked: false } : instructor
      );
      setInstructorList(newList);
      setFilteredList(newList); // Update filtered list after unblock action
    }
  };

  // Filter instructors based on search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = instructorList.filter((instructor) =>
        instructor.name?.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(instructorList);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Instructors</h4>

      {/* Search Bar */}
      <TextField
        label="Search by Instructor Name"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow className="bg-bodydark2">
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Instructor</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Email</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Mobile</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Courses</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Blocked</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((instructor, index) => (
              <TableRow key={instructor?.id || index} sx={{ "&:nth-of-type(even)": { bgcolor: "grey.100" } }}>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {index + 1}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {instructor.name}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {instructor.email}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {instructor.mobile}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {instructor.courses.length}
                </TableCell>
                <TableCell align="center" sx={{ color: instructor.isBlocked ? "error.main" : "success.main" }}>
                  {instructor.isBlocked ? "Blocked" : "Active"}
                </TableCell>
                <TableCell align="center">
                  {instructor.isBlocked ? (
                    <button
                      onClick={(e) => handleUnblock(instructor.id ?? "", e)}
                      style={{
                        backgroundColor: "#8A99AF",  // Unblock button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleBlock(instructor.id ?? "", e)}
                      style={{
                        backgroundColor: "#1C2434",  // Block button style
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Block
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Pagination
        count={Math.ceil(filteredList.length / itemsPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default InstructorList;