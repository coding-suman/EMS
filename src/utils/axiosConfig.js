import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject(error);
  }
);

export default instance;
