import React from 'react';
import { Box, Flex, Button, Spacer, Image, useBreakpointValue } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  const logoSize = useBreakpointValue({ base: '100px', md: '100px' });

  return (
    <Box as="nav" bg="teal.100" p={4} boxShadow="sm">
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          boxSize={logoSize}
          cursor="pointer"
          onClick={handleLogoClick}
        />

        <Spacer />

        {user ? (
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        ) : location.pathname === '/login' ? (
          <Button colorScheme="teal" onClick={() => handleNavigate('/register')}>
            Register
          </Button>
        ) : (
          <Button colorScheme="teal" onClick={() => handleNavigate('/login')}>
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
