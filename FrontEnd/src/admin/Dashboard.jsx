// src/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { config } from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    totalProductos: 0,
    totalUsuarios: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_URL}/api/admin/stats`);
        setStats(response.data);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Panel de Control
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e4adb0',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Pedidos
            </Typography>
            <Typography variant="h3">
              {stats.totalPedidos}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#d49a9d',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pedidos Pendientes
            </Typography>
            <Typography variant="h3">
              {stats.pedidosPendientes}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#c4878a',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Productos
            </Typography>
            <Typography variant="h3">
              {stats.totalProductos}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#b37477',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Usuarios
            </Typography>
            <Typography variant="h3">
              {stats.totalUsuarios}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
