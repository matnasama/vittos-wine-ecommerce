import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar si hay token y usuario
        if (!authService.isAuthenticated()) {
          throw new Error('No authenticated');
        }

        // Verificar token con el backend
        const response = await authService.verifyToken();
        
        // Actualizar el estado de autenticación y rol
        setIsAuthenticated(true);
        setIsAdmin(response.user.rol.toLowerCase() === 'admin');

        // Si se requiere admin y el usuario no lo es, lanzar error
        if (requireAdmin && !isAdmin) {
          throw new Error('Not admin');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        authService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [requireAdmin]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 