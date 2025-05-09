import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Intentar obtener pedidos del localStorage primero
    const cachedPedidos = localStorage.getItem('misPedidos');
    if (cachedPedidos) {
      setPedidos(JSON.parse(cachedPedidos));
      setLoading(false);
    }

    fetch('http://localhost:4000/api/mis-pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        // Guardar en localStorage
        localStorage.setItem('misPedidos', JSON.stringify(data));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener pedidos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mis pedidos</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
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
