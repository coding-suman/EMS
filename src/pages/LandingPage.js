import React from 'react';
import { Box, Button, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box>
      <Flex
        align="center"
        justify="center"
        height="100vh"
        bgGradient="linear(to-r, blue.500, teal.500)"
        color="white"
        textAlign="center"
      >
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Welcome to the Employee Management System
          </Heading>
          <Text fontSize="lg">
            Streamline your workforce management with our intuitive platform.
          </Text>
          <Stack direction="row" spacing={4}>
            <Link to="/login">
              <Button colorScheme="teal" variant="solid">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button colorScheme="teal" variant="outline">
                Register
              </Button>
            </Link>
          </Stack>
        </VStack>
      </Flex>

      {/* Features Section */}
      <Box py={16} px={8}>
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Key Features
        </Heading>
        <Flex justify="center" wrap="wrap" spacing={8}>
          <Box maxW="300px" m={4} p={6} borderWidth={1} borderRadius="md" textAlign="center">
            <Heading as="h3" size="lg" mb={4}>
              Attendance Tracking
            </Heading>
            <Text>
              Easily track employee attendance with automated check-in and check-out.
            </Text>
          </Box>
          <Box maxW="300px" m={4} p={6} borderWidth={1} borderRadius="md" textAlign="center">
            <Heading as="h3" size="lg" mb={4}>
              Employee Profiles
            </Heading>
            <Text>
              Manage detailed employee profiles and keep all important information in one place.
            </Text>
          </Box>
          <Box maxW="300px" m={4} p={6} borderWidth={1} borderRadius="md" textAlign="center">
            <Heading as="h3" size="lg" mb={4}>
              Export Reports
            </Heading>
            <Text>
              Export attendance records and other reports for payroll and compliance purposes.
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingPage;
