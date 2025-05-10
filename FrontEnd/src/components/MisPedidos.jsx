import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { config } from '../config';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(config.API_ENDPOINTS.MIS_PEDIDOS);
        setPedidos(response.data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
        setError('No se pudieron cargar los pedidos. Por favor, intentá nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mis pedidos</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : pedidos.length === 0 ? (
        <Typography>No tenés pedidos registrados.</Typography>
      ) : (
        pedidos.map(pedido => (
          <Paper key={pedido.id} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Pedido #{pedido.id}</Typography>
            <Typography variant="body2">Fecha: {new Date(pedido.fecha).toLocaleString()}</Typography>
            <Typography variant="body2">Estado: {pedido.estado}</Typography>
            <List dense>
              {pedido.productos.map((prod, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`${prod.nombre}: ${prod.cantidad} ${prod.cantidad === 1 ? 'unidad' : 'unidades'}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Precio unitario: ${prod.precio}
                        </Typography><br/>
                        <Typography component="span" variant="body2">
                          Categoría: {prod.categoria}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1">Total: ${pedido.total}</Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default MisPedidos;
