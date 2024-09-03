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
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Import logout action

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [filterMonth, setFilterMonth] = useState('current'); // State for filter month
  const dispatch = useDispatch();

  // Use useSelector to access user data from the Redux store
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }

    // Fetch current month's attendance on component mount
    fetchAttendance('current');
  }, [user]);

  const fetchAttendance = async (month) => {
    setLoading(true);
    try {
      const response = await axios.get(`/attendance/attendance?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceData(response.data); // Update state with fetched attendance data
    } catch (error) {
      toast.error('Failed to fetch attendance data!');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await axios.post('/attendance/checkin', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Checked in successfully!');
      fetchAttendance(filterMonth); // Refresh attendance data
    } catch (error) {
      toast.error('Failed to check in!');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await axios.post('/attendance/pause', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Attendance paused!');
      fetchAttendance(filterMonth); // Refresh attendance data
    } catch (error) {
      toast.error('Failed to pause attendance!');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await axios.post('/attendance/resume', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Attendance resumed!');
      fetchAttendance(filterMonth); // Refresh attendance data
    } catch (error) {
      toast.error('Failed to resume attendance!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await axios.post('/attendance/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Checked out successfully!');
      fetchAttendance(filterMonth); // Refresh attendance data
    } catch (error) {
      toast.error('Failed to check out!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Employee Dashboard</Text>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Role</FormLabel>
          <Input
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleProfileUpdate} isLoading={loading}>
          Update Profile
        </Button>

        {/* Attendance Filter and List */}
        <FormControl>
          <FormLabel>Filter Attendance by Month</FormLabel>
          <Select value={filterMonth} onChange={(e) => {
            setFilterMonth(e.target.value);
            fetchAttendance(e.target.value);
          }}>
            <option value="current">Current Month</option>
            {/* Add options for past months dynamically if needed */}
            <option value="2024-08">August 2024</option>
            <option value="2024-07">July 2024</option>
            {/* More options as required */}
          </Select>
        </FormControl>

        {/* Display Attendance Data */}
        <Table variant="simple" mt={4}>
          <Thead>
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
              <Tr key={record._id}>
                <Td>{new Date(record.checkInTime).toLocaleDateString()}</Td>
                <Td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A'}</Td>
                <Td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A'}</Td>
                <Td>{record.totalWorkHours ? record.totalWorkHours.toFixed(2) : '0.00'}</Td>
                <Td>{record.totalPauseTime ? record.totalPauseTime.toFixed(2) : '0.00'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Attendance Action Buttons */}
        <Flex justifyContent="space-between" mt={4}>
          <Button colorScheme="green" onClick={handleCheckIn} isLoading={loading}>Check In</Button>
          <Button colorScheme="yellow" onClick={handlePause} isLoading={loading}>Pause</Button>
          <Button colorScheme="teal" onClick={handleResume} isLoading={loading}>Resume</Button>
          <Button colorScheme="red" onClick={handleCheckOut} isLoading={loading}>Check Out</Button>
        </Flex>

        {/* Logout Button */}
        <Button colorScheme="gray" onClick={handleLogout} mt={4}>Logout</Button>
      </Stack>
    </Box>
  );
};

export default EmployeeDashboard;
