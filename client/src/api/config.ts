import axios, { AxiosInstance, AxiosError } from 'axios'

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
    (error: AxiosError) => {
        return Promise.reject(error);
    }
)

export { axiosInstance, authorizedAxios }