import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { config } from '../config';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(config.API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error de autenticación');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      
      // Redirigir a admin si es administrador
      if (data.user.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form"
        onSubmit={handleLogin}
        sx={{ 
          maxWidth: 400, 
          margin: 'auto', 
          mt: { xs: 2, sm: 4, md: 8 },
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          textAlign="center" 
          sx={{ 
            mb: 3,
            fontFamily: 'libre-baskerville-regular',
            color: '#e4adb0'
          }}
        >
          Iniciar sesión
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          required
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#e4adb0',
              },
            },
          }}
        />

        <TextField
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          required
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#e4adb0',
              },
            },
          }}
        />

        <Button 
          type="submit"
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 2,
            backgroundColor: '#e4adb0',
            '&:hover': {
              backgroundColor: '#d49a9d'
            },
            height: '48px',
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>

        <Button 
          variant="text" 
          fullWidth 
          sx={{ 
            mt: 1,
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(228, 173, 176, 0.08)'
            }
          }}
          onClick={() => navigate('/register')}
          disabled={loading}
        >
          ¿No tenés cuenta? Registrate aquí
        </Button>
      </Box>
    </Container>
  );
};

export default Login;