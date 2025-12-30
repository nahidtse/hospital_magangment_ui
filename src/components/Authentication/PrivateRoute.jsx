import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    
  const token = localStorage.getItem('auth_token');
  const expiry = localStorage.getItem('auth_token_expiry');
  
  // if !token → login page redirect
  if (!token || (expiry && Date.now() > expiry)) {
  localStorage.clear(); // remove expired token
  return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;