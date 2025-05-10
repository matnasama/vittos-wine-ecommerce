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
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No se encontró token');
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }

        const response = await authService.verifyToken();
        console.log('Respuesta del backend:', response);
        
        if (response && response.usuario) {
          const userRole = response.usuario.rol;
          console.log('Rol del usuario:', userRole);
          
          setIsAuthenticated(true);
          setIsAdmin(userRole === 'admin');
          
          if (requireAdmin && userRole !== 'admin') {
            console.log('Usuario no es administrador');
            setError('Acceso denegado: Se requieren privilegios de administrador');
          }
        } else {
          console.log('No se encontró usuario en la respuesta');
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error en la verificación:', err);
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
    console.log('Error de autenticación:', error);
    return <Navigate to="/login" state={{ from: location, error }} replace />;
  }

  if (!isAuthenticated) {
    console.log('Usuario no autenticado');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Usuario no autorizado como admin');
    return <Navigate to="/" replace />;
  }

  console.log('Renderizando contenido protegido');
  return children;
} 