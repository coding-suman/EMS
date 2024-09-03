import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Box,
  useDisclosure,
  Select,
  Text,
  Spinner,
} from '@chakra-ui/react';
import axios from '../utils/axiosConfig';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]); // To store all employees
  const [attendanceRecords, setAttendanceRecords] = useState([]); // To store attendance records
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Currently selected employee for viewing attendance
  const [selectedMonth, setSelectedMonth] = useState('current'); // Currently selected month
  const [selectedRecord, setSelectedRecord] = useState(null); // Currently selected record for editing
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/employees', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const fetchAttendanceRecords = async (employeeId, month = 'current') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/attendance/admin?month=${month}&userId=${employeeId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployee(employeeId);
    fetchAttendanceRecords(employeeId, selectedMonth);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    if (selectedEmployee) {
      fetchAttendanceRecords(selectedEmployee, newMonth);
    }
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    onOpen();
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/attendance/${selectedRecord._id}`, selectedRecord, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Attendance record updated successfully!');
      onClose();
      fetchAttendanceRecords(selectedEmployee, selectedMonth); // Refresh records after update
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Failed to update attendance record!');
    }
  };

  const headers = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Check-In Time", key: "checkInTime" },
    { label: "Check-Out Time", key: "checkOutTime" },
    { label: "Total Working Hours", key: "totalWorkHours" },
    { label: "Total Pause Time", key: "totalPauseTime" },
    { label: "Status", key: "status" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Admin Dashboard</Text>
      <Button colorScheme="gray" onClick={handleLogout} mt={4}>Logout</Button>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Select
            placeholder="Select Employee"
            onChange={(e) => handleEmployeeSelection(e.target.value)}
            value={selectedEmployee} // Ensure the selected employee is reflected in the dropdown
          >
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.firstName} {employee.lastName} - {employee.email}
              </option>
            ))}
          </Select>

          <Select mt={4} value={selectedMonth} onChange={handleMonthChange}>
            <option value="current">Current Month</option>
            <option value="2024-08">August 2024</option>
            <option value="2024-07">July 2024</option>
            {/* Add more months as needed */}
          </Select>

          <Button colorScheme="teal" mb={4} mt={4}>
            <CSVLink
              data={attendanceRecords}
              headers={headers}
              filename="attendance_records.csv"
              className="btn btn-primary"
            >
              Export to CSV
            </CSVLink>
          </Button>

          <Table variant="simple" isLoading={loading}>
            <Thead>
              <Tr>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Check-In Time</Th>
                <Th>Check-Out Time</Th>
                <Th>Total Working Hours</Th>
                <Th>Total Pause Time</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendanceRecords.map((record) => (
                <Tr key={record._id}>
                  <Td>{record.firstName}</Td>
                  <Td>{record.lastName}</Td>
                  <Td>{record.email}</Td>
                  <Td>{new Date(record.checkInTime).toLocaleString()}</Td>
                  <Td>{new Date(record.checkOutTime).toLocaleString()}</Td>
                  <Td>{record.totalWorkHours ? record.totalWorkHours.toFixed(2) : '0.00'}</Td>
                  <Td>{record.totalPauseTime ? record.totalPauseTime.toFixed(2) : '0.00'}</Td>
                  <Td>{record.status}</Td>
                  <Td>
                    <Button onClick={() => handleEditRecord(record)}>Edit</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Attendance Record</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Check-In Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={selectedRecord?.checkInTime ? new Date(selectedRecord.checkInTime).toISOString().slice(0, -1) : ''}
                    onChange={(e) => setSelectedRecord({ ...selectedRecord, checkInTime: new Date(e.target.value).toISOString() })}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Check-Out Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={selectedRecord?.checkOutTime ? new Date(selectedRecord.checkOutTime).toISOString().slice(0, -1) : ''}
                    onChange={(e) => setSelectedRecord({ ...selectedRecord, checkOutTime: new Date(e.target.value).toISOString() })}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
