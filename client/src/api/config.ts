import axios, { AxiosInstance, AxiosError } from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = 'http://localhost:4000'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL
})

const authorizedAxios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
      },
})

authorizedAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
)

authorizedAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response) {
          if (
            response.status === 401 &&
            response.data?.message === "Profile is blocked"
          ) {
            window.location.href = "/login";
            toast.error("Your profile is blocked. Please contact support.");
          } else if (response.status === 404) {
        
            window.location.href = "/error404";
          } else if (response.status === 500) {
            window.location.href = "/error500";
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        } else {
          // Handle network errors
          toast.error("Network error. Please check your internet connection.");
        }
        return Promise.reject(error);
      }
)

export { axiosInstance, authorizedAxios }