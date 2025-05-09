import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { config } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(config.API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      // Redirigir al login después del registro exitoso
      navigate('/login');
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
        onSubmit={handleSubmit}
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
          Registro
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          name="nombre"
          label="Nombre completo"
          value={formData.nombre}
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
          name="email"
          label="Email"
          type="email"
          value={formData.email}
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
          name="telefono"
          label="Teléfono"
          value={formData.telefono}
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
          name="direccion"
          label="Dirección"
          value={formData.direccion}
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
          value={formData.password}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
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
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          ¿Ya tenés cuenta? Iniciá sesión aquí
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
