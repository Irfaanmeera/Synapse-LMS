/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedAxios, axiosInstance } from './config'
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
  
const updateUser = async(data:{name:string})=>{
try{
const response = await authorizedAxios.put('/updateUser',data)
console.log(response.data)

if(response){
    return Promise.resolve(response.data)
}
}catch(error){
    return handleAxiosError(error);
}
}

const updateImage = async(file:File,onUploadProgress?: (progressEvent: AxiosProgressEvent) => void)=>{
try{
  
  const formData = new FormData()
  formData.append('image',file)
  const response = await authorizedAxios.put('/updateImage',formData,{
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

const getAllCourses = async(page:number)=>{
  try{
    const response= await axiosInstance.get(`/courses?page=${page}`,)
    console.log("CoursesApi", response.data)

if(response){
    return Promise.resolve(response.data)
}
  }catch(error){
    return handleAxiosError(error);
  }
}
const getAllCategories = async()=>{
  try{
    const response= await axiosInstance.get('/categories')
    console.log(response.data)

if(response){
    return Promise.resolve(response.data)
}
  }catch(error){
    return handleAxiosError(error);
  }
}
const getSingleCourse = async (courseId: string | undefined) => {
  try {
    const response = await authorizedAxios.get(`/course/${courseId}`);
    console.log(response)
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};





export {updateUser,updateImage,getAllCourses,getAllCategories,getSingleCourse}