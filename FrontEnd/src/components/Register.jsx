import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

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
      const res = await fetch('http://localhost:4000/api/register', {
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
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        maxWidth: 400, 
        margin: 'auto', 
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
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
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        name="telefono"
        label="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        name="direccion"
        label="Dirección"
        value={formData.direccion}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
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
          height: '42px'
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
      </Button>

      <Button 
        variant="text" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={() => navigate('/login')}
        disabled={loading}
      >
        ¿Ya tenés cuenta? Iniciá sesión aquí
      </Button>
    </Box>
  );
};

export default Register;
