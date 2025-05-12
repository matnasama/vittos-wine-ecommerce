// src/admin/Dashboard.jsx
import { 
  Typography, 
  Grid, 
  Paper, 
  Box
} from '@mui/material';
import { useEffect, useState } from 'react';
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
        setError(null);
        const token = localStorage.getItem(config.TOKEN_KEY);
        const response = await axios.get(config.API_ENDPOINTS.ADMIN_STATS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(response.data);
      } catch (err) {
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Typography>Cargando estadísticas...</Typography>;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: 'background.default',
      pb: 4
    }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 5, mt: 2, textAlign: 'center' }}>
        Panel de Control
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          width: '100%',
          maxWidth: 1100,
          mx: 'auto',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#e4adb0',
            color: 'white',
            borderRadius: 3,
            width: { xs: '90vw', sm: 220, md: 240 },
            height: 180,
            boxSizing: 'border-box',
            justifyContent: 'center',
            minWidth: 180,
            flex: '1 1 220px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Total Pedidos
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {stats.totalPedidos}
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#d49a9d',
            color: 'white',
            borderRadius: 3,
            width: { xs: '90vw', sm: 220, md: 240 },
            height: 180,
            boxSizing: 'border-box',
            justifyContent: 'center',
            minWidth: 180,
            flex: '1 1 220px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Pedidos Pendientes
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {stats.pedidosPendientes}
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#c4878a',
            color: 'white',
            borderRadius: 3,
            width: { xs: '90vw', sm: 220, md: 240 },
            height: 180,
            boxSizing: 'border-box',
            justifyContent: 'center',
            minWidth: 180,
            flex: '1 1 220px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Total Productos
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {stats.totalProductos}
          </Typography>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#b37477',
            color: 'white',
            borderRadius: 3,
            width: { xs: '90vw', sm: 220, md: 240 },
            height: 180,
            boxSizing: 'border-box',
            justifyContent: 'center',
            minWidth: 180,
            flex: '1 1 220px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Total Usuarios
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {stats.totalUsuarios}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
