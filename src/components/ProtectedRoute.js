// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';  // Import useSelector from react-redux

const ProtectedRoute = ({ children, requiredRole }) => {
  // Access Redux state using useSelector
  const { user, token } = useSelector((state) => state.auth);

  // Determine if the user is authenticated
  const isAuthenticated = !!token;
  // Determine the user's role if available
  const role = user ? user.role : null;

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect based on user's role
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
};

export default ProtectedRoute;
