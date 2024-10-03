/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from './config';
import axios from 'axios';
// import {socket} from '../components/socket/Socket'

interface StudentData {
    name?: string;  
    password?: string; 
    mobile?: number | string; 
    email?: string; 
}

interface InstructorData {
     name?: string; 
    password?: string; 
    mobile?: number | string; 
    email?: string; 
}


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
      

      const studentSignup = async (studentData: StudentData): Promise<{ success: boolean; email: string } | undefined> => {
        try {
            const response = await axiosInstance.post('/signup', studentData);
            const { message, email } = response.data;
    
            console.log('Submitting data:', response.data);
    
            if (message === 'OTP sent for verification...') {
                return { success: true, email };
            }
        } catch (error) {
          return handleAxiosError(error);
            }
    };
    
const verifyOtp = async (otp: string, email: string) => {
    try {
        const response = await axiosInstance.post('/verifyOtp', { otp, email });
        const { token, refreshToken, student } = response.data;
        console.log(response)
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        return student;
    } catch (error) {
        return handleAxiosError(error);
    }
};

const resendOtp = async (email: string) => {
    try {
        await axiosInstance.post("/resendOtp", { email });
        return Promise.resolve("OTP resent successfully.");
    } catch (error) {
        return handleAxiosError(error);
    }
};

const studentLogin = async (studentData: StudentData) => {
  try {
    const response = await axiosInstance.post('/login', studentData);
    const { token, refreshToken, student } = response.data;
    
    // Store tokens in local storage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Return student data upon successful login
    return student;
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error); // Await the error handling to properly catch it
  }
};



const userLogout = async () => {
    // socket.disconnect();
    localStorage.removeItem("token");
  };




export { studentSignup, verifyOtp, resendOtp, studentLogin,userLogout };
