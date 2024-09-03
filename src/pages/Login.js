import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '../utils/validationSchemas';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import axios from '../utils/axiosConfig';  // Use your configured Axios instance
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access Redux state for authentication
  const { user, token } = useSelector((state) => state.auth);

  // Determine if the user is authenticated
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect the user based on their role if they are already authenticated
      if (user?.role === 'Admin') {
        navigate('/admin');
      } else if (user?.role === 'Employee') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('auth/login', data);
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      // Dispatch login action to update Redux state
      dispatch(login(response.data));

      toast.success('Logged in successfully!');

      // Redirect based on role immediately after login
      if (response.data.user.role === 'Admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'Employee') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Page</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
