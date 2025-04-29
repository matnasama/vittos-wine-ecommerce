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
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get('http://localhost:4000/api/pedidos', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
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
          navigate('/login');
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
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:4000/api/pedidos/${id}`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err);
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
                <strong>Dirección:</strong> {pedido.usuario_direccion || 'No registrada'}
              </Typography>
              <Typography variant="body1">
                <strong>Teléfono:</strong> {pedido.usuario_telefono || 'No registrado'}
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              gap: 2
            }}>
              <Typography variant="body1">
                <strong>Estado:</strong>
              </Typography>
              <Select
                value={pedido.estado || 'pendiente'}
                onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 150,
                  backgroundColor: estadosPosibles.find(e => e.value === pedido.estado)?.color ?
                    `${theme.palette[estadosPosibles.find(e => e.value === pedido.estado).color.split('.')[0]].light}30` : 'inherit',
                  color: estadosPosibles.find(e => e.value === pedido.estado)?.color || 'inherit'
                }}
              >
                {estadosPosibles.map(estado => (
                  <MenuItem 
                    key={estado.value} 
                    value={estado.value}
                    sx={{ color: estado.color }}
                  >
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <List dense sx={{ mb: 2 }}>
              {pedido.productos.map((prod, i) => (
                <ListItem key={i} sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={prod.imagen_url} 
                      alt={prod.nombre}
                      variant="rounded"
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${prod.marca} ${prod.nombre}`}
                    secondary={`${prod.cantidad} x $${formatMoney(prod.precio)}`}
                    sx={{ flex: '1 1 auto' }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    ${formatMoney(prod.cantidad * prod.precio)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                {pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total: ${formatMoney(pedido.total)}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}