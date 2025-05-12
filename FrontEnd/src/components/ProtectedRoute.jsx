import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await authService.verifyToken();
        
        if (response && response.usuario) {
          const userRole = response.usuario.rol;
          
          setIsAuthenticated(true);
          setIsAdmin(userRole === 'admin');
          
          if (requireAdmin && userRole !== 'admin') {
            setError('Acceso denegado: Se requieren privilegios de administrador');
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        setError(err.message || 'Error en la verificación de autenticación');
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [requireAdmin]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Navigate to="/login" state={{ from: location, error }} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
} 