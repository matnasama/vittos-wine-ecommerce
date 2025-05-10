// src/admin/Dashboard.jsx
import { 
  Typography, 
  Grid, 
  Paper, 
  Box
} from '@mui/material';

export default function Dashboard() {
  // Datos estáticos temporalmente
  const stats = {
    totalPedidos: 25,
    pedidosPendientes: 8,
    totalProductos: 42,
    totalUsuarios: 15
  };

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
