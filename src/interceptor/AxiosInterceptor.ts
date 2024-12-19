import axios from 'axios';
import { API_BASE_URL } from '../constants/Constants';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // If the token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error("Request failed during request interception"));
  }
);

export default axiosInstance;