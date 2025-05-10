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
        console.log('Iniciando verificación de autenticación...');
        
        // Verificar si hay token y usuario
        if (!authService.isAuthenticated()) {
          console.log('No hay token o usuario en localStorage');
          throw new Error('No authenticated');
        }

        console.log('Token encontrado, verificando con el backend...');
        
        // Verificar token con el backend
        const response = await authService.verifyToken();
        console.log('Respuesta del backend:', response);
        
        const userRole = response.user.rol.toLowerCase();
        console.log('Rol del usuario:', userRole);
        
        // Actualizar estados de forma síncrona
        const isUserAdmin = userRole === 'admin';
        setIsAdmin(isUserAdmin);
        setIsAuthenticated(true);

        // Si se requiere admin y el usuario no lo es, lanzar error
        if (requireAdmin && !isUserAdmin) {
          console.log('Se requiere admin pero el usuario no lo es');
          throw new Error('Not admin');
        }
        
        console.log('Verificación completada exitosamente');
      } catch (error) {
        console.error('Error detallado en verificación:', error);
        console.error('Stack trace:', error.stack);
        authService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [requireAdmin]);

  // Esperar a que termine la carga
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

  // Verificar autenticación
  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verificar rol de admin si es necesario
  if (requireAdmin && !isAdmin) {
    console.log('Usuario no es admin, redirigiendo a home');
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  console.log('Renderizando contenido protegido');
  return children;
};

export default ProtectedRoute; 