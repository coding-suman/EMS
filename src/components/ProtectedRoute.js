import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;
  const role = user ? user.role : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
};

export default ProtectedRoute;
