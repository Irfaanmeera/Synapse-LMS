/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { Upload } from 'lucide-react';
import { authorizedAxios } from '../../api/config'; // Adjust the import path
import { Course } from '../../interfaces/course';

interface Category {
  id: string;
  category: string;
}

const CreateCourse: React.FC = () => {
  const [formData, setFormData] = useState<Course>({
    name: '',
    description: '',
    price: 0,
    image: '',
    level: 'Beginner',
    category: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authorizedAxios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      description: content,
    }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'File size too large. Please choose a smaller image.',
          severity: 'error',
        });
        return;
      }
  
      // Generate local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setThumbnailPreview(base64String);
      };
      reader.readAsDataURL(file);
  
      // Temporarily store the file in state for uploading
      setFormData(prev => ({
        ...prev,
        image: file.name, // Set the name or a placeholder, actual upload happens during submit
      }));
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Course name is required',
        severity: 'error',
      });
      return false;
    }
    if (!formData.description.trim()) {
      setSnackbar({
        open: true,
        message: 'Course description is required',
        severity: 'error',
      });
      return false;
    }
    if (formData.price < 0) {
      setSnackbar({
        open: true,
        message: 'Price cannot be negative',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    try {
      // Create a new FormData object to hold course data and the image
      const formDataToSubmit = new FormData();
      
      // Append course data to FormData
      if(formData){
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('description', formData.description);
        formDataToSubmit.append('level', formData.level);
        formDataToSubmit.append('category', formData.category);
        formDataToSubmit.append('price', String(formData.price));
      }
      // Append the image file if it exists
      if (formData.image) {
        formDataToSubmit.append('image', formData.image); // Assuming formData.image is of type File or Blob
      }
  
      console.log('Sending course data:', formDataToSubmit);
  
      // Submit the form data including the image
      const response = await authorizedAxios.post('/instructor/addCourse', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setSnackbar({
        open: true,
        message: 'Course created successfully!',
        severity: 'success',
      });
  
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        level: 'Beginner',
        category: '',
      });
      setThumbnailPreview('');
  
    } catch (error: any) {
      console.error('Error creating course:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating course. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Course
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Course Description
              </Typography>
              <Editor
                apiKey="cpfnjdzxy2x3skaeme2548vxjpeqm5khbh4b3keov8u4eni9"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                }}
                value={formData.description}
                onEditorChange={handleEditorChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  label="Level"
                  disabled={loading}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advance">Advance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="thumbnail-upload"
                type="file"
                onChange={handleThumbnailChange}
                disabled={loading}
              />
              <label htmlFor="thumbnail-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  disabled={loading}
                >
                  Upload Course Image
                </Button>
              </label>

              {thumbnailPreview && (
                <Box mt={2}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: '300px', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning
>
  <Alert
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default CreateCourse;