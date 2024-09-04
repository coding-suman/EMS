// src/components/NotificationList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../redux/notificationSlice';
import { Box, Text, Button, Spinner, Flex } from '@chakra-ui/react';

const NotificationList = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const token = localStorage.getItem('token'); // Fetch token from local storage

  useEffect(() => {
    dispatch(fetchNotifications({ token })); // Pass token to thunk action
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    // alert(id)
    dispatch(markNotificationAsRead({ id, token }));
  };

  if (loading) return <Spinner />;

  return (
    <Box className='flex items-center justify-center'>
      <Flex alignItems="center" justifyContent="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Notification</Text>
      </Flex>
      {notifications.map((notification) => (
        <Box key={notification._id} p={3} border="1px" borderRadius="md" mb={2}>
          <Text>{notification.message}</Text>
          <Button onClick={() => handleMarkAsRead(notification._id)} mt={2} colorScheme="blue">
            Mark as Read
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default NotificationList;
