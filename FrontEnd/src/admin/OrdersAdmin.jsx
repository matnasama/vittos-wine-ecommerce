import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuItem,
  Select,
  Box,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

// Función helper para formatear valores monetarios
const formatMoney = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function OrdersAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.rol !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchPedidos();
  }, [navigate]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(config.API_ENDPOINTS.ADMIN_PEDIDOS);
      
      // Asegurarnos que los valores numéricos están correctamente formateados
      const pedidosFormateados = response.data.map(pedido => ({
        ...pedido,
        total: formatMoney(pedido.total),
        productos: pedido.productos.map(prod => ({
          ...prod,
          precio: formatMoney(prod.precio)
        }))
      }));
      
      setPedidos(pedidosFormateados);
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al cargar los pedidos';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = 'Acceso denegado. Por favor, inicie sesión nuevamente.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setError(null);
      
      await axios.put(
        `${config.API_ENDPOINTS.ADMIN_PEDIDOS}/${id}`,
        { estado: nuevoEstado }
      );
      
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      setError(err.response?.data?.message || 'Error al actualizar el estado');
    }
  };

  const estadosPosibles = [
    { value: 'pendiente', label: 'Pendiente', color: 'warning.main' },
    { value: 'enviado', label: 'Enviado', color: 'primary.main' },
    { value: 'entregado', label: 'Entregado', color: 'success.main' },
    { value: 'cancelado', label: 'Cancelado', color: 'error.main' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchPedidos}
          sx={{ 
            backgroundColor: '#e4adb0', 
            '&:hover': { backgroundColor: '#d49a9d' } 
          }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestión de Pedidos
      </Typography>

      {pedidos.length === 0 ? (
        <Typography>No hay pedidos registrados.</Typography>
      ) : (
        pedidos.map(pedido => (
          <Paper 
            key={pedido.id} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: theme.shadows[2]
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Pedido #{pedido.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(pedido.fecha).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Cliente:</strong> {pedido.usuario_nombre || pedido.usuario_email}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {pedido.usuario_email}
              </Typography>
              <Typography variant="body1">
                <strong>Total:</strong> ${pedido.total}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Estado actual:
              </Typography>
              <Select
                value={pedido.estado}
                onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                fullWidth
                size="small"
                sx={{
                  '& .MuiSelect-select': {
                    color: theme.palette[estadosPosibles.find(e => e.value === pedido.estado)?.color || 'text.primary']
                  }
                }}
              >
                {estadosPosibles.map((estado) => (
                  <MenuItem 
                    key={estado.value} 
                    value={estado.value}
                    sx={{ color: theme.palette[estado.color] }}
                  >
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Productos:
            </Typography>
            <List>
              {pedido.productos.map((producto, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={producto.imagen} alt={producto.nombre} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={producto.nombre}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Cantidad: {producto.cantidad}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Precio unitario: ${producto.precio}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      )}
    </Box>
  );
}