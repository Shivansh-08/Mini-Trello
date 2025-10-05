// In client/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || !userInfo.token) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;