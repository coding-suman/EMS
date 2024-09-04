// src/redux/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosConfig';

// Fetch notifications for the logged-in user
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.get('/notifications', {
      headers: { Authorization: `Bearer ${token}` } // Add Authorization header
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Mark a notification as read
export const markNotificationAsRead = createAsyncThunk('notifications/markAsRead', async ({ id, token }, { rejectWithValue }) => {
  try {
    await axios.put(`/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` } // Add Authorization header
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((notification) => notification._id !== action.payload);
      });
  },
});

export default notificationSlice.reducer;
