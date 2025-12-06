import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Wrapper component that prevent unauthorized users from accessing pages that needed to be authorized before visiting
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  // If the user is not logged in, redirect them to login page. 
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;