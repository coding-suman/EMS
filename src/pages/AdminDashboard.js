import React, { useEffect, useState } from 'react';

import {
  Box,
  Flex,
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
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [selectedRecord, setSelectedRecord] = useState(null);
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
      fetchAttendanceRecords(selectedEmployee, selectedMonth);
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

  return (
    <Box maxW="1200px" mx="auto">
      <Flex alignItems="center" justifyContent="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Admin Dashboard</Text>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="flex-start"
            mb={4}
            gap={4}
          >
            <Select
              placeholder="Select Employee"
              onChange={(e) => handleEmployeeSelection(e.target.value)}
              value={selectedEmployee}
              width={{ base: '100%', md: 'auto' }}
            >
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName} - {employee.email}
                </option>
              ))}
            </Select>

            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              width={{ base: '100%', md: 'auto' }}
            >
              <option value="current">Current Month</option>
              <option value="2024-08">August 2024</option>
              <option value="2024-07">July 2024</option>
            </Select>

            <Button colorScheme="teal" mt={{ base: 2, md: 0 }}>
              <CSVLink
                data={attendanceRecords}
                headers={headers}
                filename="attendance_records.csv"
                className="btn btn-primary"
              >
                Export to CSV
              </CSVLink>
            </Button>
          </Flex>

          <Table variant="simple">
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
