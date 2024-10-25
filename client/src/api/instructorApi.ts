/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedAxios } from './config'
import axios, {AxiosProgressEvent} from 'axios'

const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        console.error("Backend error message:", axiosError.response.data.message);
        return Promise.reject(axiosError.response.data.message); // Display backend error
      }
    }
    return Promise.reject("An unexpected error occurred."); // Fallback message
  };
  
const updateInstructor = async(data:{name:string})=>{
try{
const response = await authorizedAxios.put('instructor/updateInstructor',data)
console.log('Update Resposne :', response.data)

if(response){
    return Promise.resolve(response.data)
}
}catch(error){
    return handleAxiosError(error);
}
}

const updateInstructorImage = async(file:File,onUploadProgress?: (progressEvent: AxiosProgressEvent) => void)=>{
try{
  
  const formData = new FormData()
  formData.append('image',file)
  const response = await authorizedAxios.put('instructor/updateImage',formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    },
    onUploadProgress,
  });
  if(response.data){
  return Promise.resolve(response.data)
  }else{
    return Promise.reject('Upload Image Failed')
  }
}catch(error){
    return handleAxiosError(error);
}
    
}
// const handleCreateCourse = async (courseData) => {
//   try {
//     await authorizedAxios.post('/instructor/addCourse', courseData);
//     alert('Course created successfully!');
//   } catch (error) {
//     console.error('Error creating course:', error);
//   }
// };
const fetchInstructorCourses = async (page: number = 1) => {
  try {
    const response = await authorizedAxios.get(`/instructor/myCourses`, {
      params: {
        page: page,  // Pass the page number if pagination is needed
      }
    });

    console.log("Api response fetcjhcourse: ", response.data)
    if(response.data){
      return Promise.resolve(response.data)
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
const addCourseImage = async (file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
  try {
    const formData = new FormData();
    formData.append('image', file); // Append the image file to the FormData object

    const response = await authorizedAxios.post('/instructor/addCourseImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress, // Optional upload progress handler
    });

    if (response.data) {
      return Promise.resolve(response.data); // Resolve with the response data
    } else {
      return Promise.reject('Upload Image Failed'); // Reject if response does not contain data
    }
  } catch (error) {
    return handleAxiosError(error); // Handle any errors that occur
  }
};
export {updateInstructor,updateInstructorImage,fetchInstructorCourses,addCourseImage}