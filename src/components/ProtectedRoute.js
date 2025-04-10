// src/components/ProtectedRoute.js
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


export const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, loadUser, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !user || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  return children;
};
