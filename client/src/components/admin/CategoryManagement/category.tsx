import React, { useEffect, useState } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Modal, Box } from '@mui/material';
import { fetchCategories, toggleCategoryStatus, addCategory, editCategory, listCategory, unlistCategory } from '../../../api/adminApi';  // Replace with actual API imports
import { Category } from '../../../interfaces/category';  // Define Category interface for type safety
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = categories.filter(category =>
        category.category.toLowerCase().includes(query)
      );
      setCategories(filtered);
    } else {
      setCategories(categories);
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await addCategory(newCategoryName); // Get the category object returned from the API
      console.log()
      setCategories(prevCategories => [...prevCategories, newCategory]); // Add the newly added category to the list
      setOpenModal(false); // Close the modal
      setNewCategoryName(''); // Clear the input field for the new category
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };
  

  const handleEditCategory = async () => {
    if (editingCategoryId) {
      try {
        await editCategory(editingCategoryId, { category: editingCategoryName });
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category.id === editingCategoryId ? { ...category, category: editingCategoryName } : category
          )
        );
        setEditingCategoryId(null);
        setEditingCategoryName('');
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    }
  };
  // Handle listing a category
const handleListCategory = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await listCategory(id);
      if (response) {
        const updatedCategories = categories.map((category) =>
          category.id === id ? { ...category, status: true } : category
        );
        setCategories(updatedCategories);
        // Update filtered list
        toast.success("Category listed successfully!");
      }
    } catch (error) {
      console.error("Failed to list category:", error);
    }
  };
  
  // Handle unlisting a category
  const handleUnlistCategory = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await unlistCategory(id);
      if (response) {
        const updatedCategories = categories.map((category) =>
          category.id === id ? { ...category, status: false } : category
        );
        setCategories(updatedCategories);
        toast.success("Category unlisted successfully!");
      }
    } catch (error) {
      console.error("Failed to unlist category:", error);
    }
  };
  

//   const handleToggleCategoryStatus = async (categoryId: string) => {
//     try {
//       await toggleCategoryStatus(categoryId);
//       setCategories(prevCategories =>
//         prevCategories.map(category =>
//           category.id === categoryId ? { ...category, status: !category.status } : category
//         )
//       );
//     } catch (error) {
//       console.error("Failed to toggle category status:", error);
//     }
//   };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
     <h4 className="mb-6 text-xl font-semibold text-black">Categories</h4>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '56px' }}>
  {/* Search Field */}
  <TextField
    label="Search Categories"
    variant="outlined"
    size="small"
    value={searchQuery}
    onChange={handleSearch}
    sx={{ mb: 3}}  // flexGrow makes the TextField take up available space
  />

  {/* Add Category Button */}
  <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
    Add Category
  </Button>
</div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">S.No</TableCell>
              <TableCell align="center">Category Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell align="center">{index + 1 + indexOfFirstItem}</TableCell>
                <TableCell align="center">{category.category}</TableCell>
                <TableCell align="center">
                  {category.status ? "Listed" : "Unlisted"}
                </TableCell>
                <TableCell align="center">
                  <Button onClick={() => setEditingCategoryId(category.id)}>Edit</Button>
                
                </TableCell>
                <TableCell>
    {category.status ? (
      <Button
        variant="contained"
        color="warning"
        onClick={(e) => handleUnlistCategory(category.id, e)}
      >
        Unlist
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleListCategory(category.id, e)}
      >
        List
      </Button>
    )}
  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(categories.length / itemsPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center',marginTop:"20px"}}
      />

      {/* Add Category Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '20%' }}>
          <h3>Add New Category</h3>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Box>
      </Modal>

      {/* Edit Category Modal */}
      <Modal open={Boolean(editingCategoryId)} onClose={() => setEditingCategoryId(null)}>
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '20%' }}>
          <h3>Edit Category</h3>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={editingCategoryName}
            onChange={(e) => setEditingCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleEditCategory}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminCategories;
