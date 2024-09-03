// src/pages/Register.js
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerValidationSchema } from '../utils/validationSchemas';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerValidationSchema)
  });

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
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('auth/register', data);

      // Store the token in local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      // Dispatch login action to update Redux state
      dispatch(login(response.data));

      toast.success('Registered successfully!');

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Container maxW="md" py={10}>
        <Box p={8} boxShadow="md" borderRadius="lg" bg="white">
          <Heading as="h1" size="xl" textAlign="center" mb={6}>
            Register
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl id="firstName" isInvalid={errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input type="text" {...register('firstName')} />
                {errors.firstName && <Text color="red.500" fontSize="sm">{errors.firstName.message}</Text>}
              </FormControl>
              <FormControl id="lastName" isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" {...register('lastName')} />
                {errors.lastName && <Text color="red.500" fontSize="sm">{errors.lastName.message}</Text>}
              </FormControl>
              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email')} />
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register('password')} />
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
              </FormControl>
              <FormControl id="confirmPassword" isInvalid={errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword.message}</Text>}
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full" mt={4}>
                Register
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
