import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2} sx={{ color: themeMode === 'dark' ? 'white' : 'black', transition: 'all 0.3s ease' }}>
        Iniciar sesión
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

      <Button variant="contained" onClick={handleLogin} fullWidth sx={{ mt: 2, backgroundColor:'#e4adb0' }}>
        Entrar
      </Button>

      <Button variant="text" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/register')}>
        ¿No tenés cuenta? Registrate aquí
      </Button>
    </Box>
  );
};

export default Login;
