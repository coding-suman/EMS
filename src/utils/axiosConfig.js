import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api', // Set your API base URL
});

// Interceptor for handling responses
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default instance;
