import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, TimeIcon, RepeatIcon, CloseIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import NotificationList from '../components/NotificationList';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterMonth, setFilterMonth] = useState('current');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
    fetchAttendance('current');
  }, [user]);

  const fetchAttendance = async (month) => {
    setLoading(true);
    try {
      const response = await axios.get(`/attendance/attendance?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceData(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile!');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceAction = async (action) => {
    setLoading(true);
    const actionMap = {
      checkin: '/attendance/checkin',
      pause: '/attendance/pause',
      resume: '/attendance/resume',
      checkout: '/attendance/checkout',
    };
    const actionMessages = {
      checkin: 'Checked in successfully!',
      pause: 'Attendance paused!',
      resume: 'Attendance resumed!',
      checkout: 'Checked out successfully!',
    };
    try {
      await axios.post(actionMap[action], {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(actionMessages[action]);
      fetchAttendance(filterMonth);
    } catch (error) {
      toast.error(`Failed to ${action} attendance!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Flex alignItems="center" justifyContent="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Employee Dashboard</Text>
      </Flex>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        gap={4}
        mb={8}
      >
        {/* Notification List on the right side for larger screens, above the form on smaller screens */}
        <Box flex={1} order={{ base: 1, md: 2 }}>
          <NotificationList />
        </Box>

        {/* Profile Update Form */}
        <Box flex={2} order={{ base: 2, md: 1 }}>
          <Stack spacing={4} className="flex items-center justify-center">
            <FormControl id="firstName">
              <FormLabel>First Name</FormLabel>
              <Input
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                variant="filled"
              />
            </FormControl>
            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                variant="filled"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                variant="filled"
              />
            </FormControl>
            <FormControl id="role">
              <FormLabel>Role</FormLabel>
              <Input
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                variant="filled"
              />
            </FormControl>
            <Button className="w-1/4" colorScheme="blue" onClick={handleProfileUpdate} isLoading={loading}>
              Update Profile
            </Button>
          </Stack>
        </Box>
      </Flex>

      <FormControl mb={8}>
        <FormLabel>Filter Attendance by Month</FormLabel>
        <Select value={filterMonth} onChange={(e) => {
          setFilterMonth(e.target.value);
          fetchAttendance(e.target.value);
        }}>
          <option value="current">Current Month</option>
          <option value="2024-08">August 2024</option>
          <option value="2024-07">July 2024</option>
        </Select>
      </FormControl>

      <Table variant="simple" size="md" shadow="md" rounded="md" overflow="hidden">
        <Thead bg="gray.200">
          <Tr>
            <Th>Date</Th>
            <Th>Check-In Time</Th>
            <Th>Check-Out Time</Th>
            <Th>Total Working Hours</Th>
            <Th>Total Pause Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendanceData.map((record) => (
            <Tr key={record._id} _hover={{ bg: 'gray.100' }}>
              <Td>{new Date(record.checkInTime).toLocaleDateString()}</Td>
              <Td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A'}</Td>
              <Td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A'}</Td>
              <Td>{record.totalWorkHours ? record.totalWorkHours.toFixed(2) : '0.00'}</Td>
              <Td>{record.totalPauseTime ? record.totalPauseTime.toFixed(2) : '0.00'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justifyContent="center" mt={8}>
        <Button
          leftIcon={<CheckIcon />}
          colorScheme="green"
          onClick={() => handleAttendanceAction('checkin')}
          isLoading={loading}
          m={2}
        >
          Check In
        </Button>
        <Button
          leftIcon={<TimeIcon />}
          colorScheme="yellow"
          onClick={() => handleAttendanceAction('pause')}
          isLoading={loading}
          m={2}
        >
          Pause
        </Button>
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="teal"
          onClick={() => handleAttendanceAction('resume')}
          isLoading={loading}
          m={2}
        >
          Resume
        </Button>
        <Button
          leftIcon={<CloseIcon />}
          colorScheme="red"
          onClick={() => handleAttendanceAction('checkout')}
          isLoading={loading}
          m={2}
        >
          Check Out
        </Button>
      </Flex>
    </Box>
  );
};

export default EmployeeDashboard;
