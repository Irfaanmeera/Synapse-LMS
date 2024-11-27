import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';  // Your backend URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Create an authorized instance with interceptors
const authorizedAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add both access token and refresh token to each request
authorizedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Access token
    const refreshToken = localStorage.getItem('refreshToken'); // Refresh token

    // Always send both tokens in headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
authorizedAxios.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  async (error: AxiosError) => {
    const { response } = error;

    if (response) {
      // If the access token is expired, try to refresh using the refresh token
      if (response.status === 401 && response.data?.message === "Invalid access token") {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Send the refresh token to refresh the access token
            const { data } = await axios.post(`${BASE_URL}/a/refresh-token`, {}, {
              headers: {
                'x-refresh-token': refreshToken,  // Send refresh token in header
              },
            });
            console.log("New access token:", data.accessToken);

            // Store the new access token and refresh token (optional)
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken); // Optional, if you want to update the refresh token as well

            // Retry the original request with the new access token
            if (error.config) {
              error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
              // Retry the request with the new token
              return axios.request(error.config);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            toast.error("Session expired. Please log in again.");
            localStorage.clear();  // Clear stored tokens if refresh fails
            window.location.href = "/";  // Optionally redirect to login page
            return Promise.reject(refreshError);
          }
        } else {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();  // Clear stored tokens
          window.location.href = "/";  // Redirect to login page if no refresh token
          return Promise.reject(error);
        }
      }

      // Handle other HTTP errors (e.g., 404, 500)
      if (response.status === 404) {
        window.location.href = "/error404";  // Redirect to error 404 page
      } else if (response.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";  // Redirect to error 500 page
        return Promise.reject(error);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } else {
      // Handle network errors
      toast.error("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, authorizedAxios };



// import axios, { AxiosInstance, AxiosError } from 'axios';
// import toast from 'react-hot-toast';

// const BASE_URL = 'http://localhost:3000';  // Your backend URL

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// // Create an authorized instance with interceptors
// const authorizedAxios: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add the access token to each request
// authorizedAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // Access token
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token expiration and other errors
// authorizedAxios.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const { response } = error;

//     if (response) {
//       if (response.status === 401 && response.data?.message === "Invalid access token") {
//         // If access token is expired, attempt to refresh using the refresh token
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           try {
//             // Send the refresh token to refresh the access token
//             const { data } = await axios.post(`${BASE_URL}/refresh-token`, {}, {
//               headers: {
//                 'x-refresh-token': refreshToken,  // Send refresh token in header
//               },
//             });

//             console.log("New access token:", data.accessToken);

//             // Store the new access token
//             localStorage.setItem('token', data.accessToken);

//             // Retry the original request with the new access token
//             if (error.config) {
//               error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
//               return axios.request(error.config);
//             }
//           } catch (refreshError) {
//             console.error("Token refresh failed:", refreshError);
//             toast.error("Session expired. Please log in again.");
//             localStorage.clear();  // Clear stored tokens if refresh fails
//             window.location.href = "/";  // Optionally redirect to login page if needed
//             return Promise.reject(refreshError);
//           }
//         } else {
//           toast.error("Session expired. Please log in again.");
//           localStorage.clear();  // Clear stored tokens
//           window.location.href = "/";  // Redirect to login page if no refresh token
//           return Promise.reject(error);
//         }
//       }

//       // Handle other HTTP errors (e.g., 404, 500)
//       if (response.status === 404) {
//         window.location.href = "/error404";  // Redirect to error 404 page
//       } else if (response.status === 500) {
//         window.location.href = "/error500";  // Redirect to error 500 page
//       } else {
//         toast.error("An error occurred. Please try again later.");
//       }
//     } else {
//       // Handle network errors
//       toast.error("Network error. Please check your internet connection.");
//     }
//     return Promise.reject(error);
//   }
// );

// export { axiosInstance, authorizedAxios };




// import axios, { AxiosInstance, AxiosError } from 'axios'
// import toast from 'react-hot-toast'

// const BASE_URL = 'http://localhost:3000'

// const axiosInstance: AxiosInstance = axios.create({
//     baseURL: BASE_URL
// })

// const authorizedAxios: AxiosInstance = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//       },
// })

// authorizedAxios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token')
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`
//         }
//         return config;
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error);
//     }
// )

// authorizedAxios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const { response } = error;
//         if (response) {
//           if (
//             response.status === 401 &&
//             response.data?.message === "Profile is blocked"
//           ) {
//             window.location.href = "/login";
//             toast.error("Your profile is blocked. Please contact support.");
//           } else if (response.status === 404) {
        
//             window.location.href = "/error404";
//           } else if (response.status === 500) {
//             window.location.href = "/error500";
//           } else {
//             toast.error("An error occurred. Please try again later.");
//           }
//         } else {
//           // Handle network errors
//           toast.error("Network error. Please check your internet connection.");
//         }
//         return Promise.reject(error);
//       }
// )

// export { axiosInstance, authorizedAxios }