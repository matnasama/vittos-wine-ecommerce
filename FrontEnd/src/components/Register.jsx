import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setThemeMode(e.matches ? 'dark' : 'light');
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, email, telefono, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess('Usuario registrado exitosamente!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2} sx={{ color: themeMode === 'dark' ? 'white' : 'black', transition: 'all 0.3s ease' }}>
        Crear cuenta
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        margin="normal"
        InputLabelProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' }
        }}
        InputProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' },
          sx: {
            '& fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&:hover fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' }
          }
        }}
      />

      <TextField
        fullWidth
        label="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        margin="normal"
        InputLabelProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' }
        }}
        InputProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' },
          sx: {
            '& fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&:hover fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' }
          }
        }}
      />

      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        InputLabelProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' }
        }}
        InputProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' },
          sx: {
            '& fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&:hover fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' }
          }
        }}
      />

      <TextField
        fullWidth
        label="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        margin="normal"
        InputLabelProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' }
        }}
        InputProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' },
          sx: {
            '& fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&:hover fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' }
          }
        }}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        InputLabelProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' }
        }}
        InputProps={{
          style: { color: themeMode === 'dark' ? 'white' : 'black' },
          sx: {
            '& fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&:hover fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused fieldset': { borderColor: themeMode === 'dark' ? 'white' : 'black' }
          }
        }}
      />

      <Button variant="contained" onClick={handleRegister} fullWidth sx={{ mt: 2, backgroundColor:'#e4adb0' }}>
        Registrarme
      </Button>
    </Box>
  );
};

export default Register;
