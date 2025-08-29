import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    if (requireAdmin) {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      return adminToken && adminUser;
    }
    // For regular user authentication (can be expanded later)
    const userToken = localStorage.getItem('userToken');
    return userToken;
  };

  // Check if user has admin role
  const isAdmin = () => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        return user.role === 'admin';
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // If route requires admin access
  if (requireAdmin) {
    if (!isAuthenticated()) {
      // Redirect to admin login if not authenticated
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    if (!isAdmin()) {
      // Redirect to home if not admin
      return <Navigate to="/" replace />;
    }
  }

  // If route requires regular authentication
  if (!requireAdmin && !isAuthenticated()) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated and authorized, render the protected content
  return children;
};

export default ProtectedRoute;
