import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:4000/mis-pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error('Error al obtener pedidos:', err));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mis pedidos</Typography>
      {pedidos.length === 0 ? (
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
                    primary={`${prod.nombre}: ${prod.cantidad} unidades`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Precio unitario: ${prod.precio}
                        </Typography><br/>
                        <Typography component="span" variant="body2">
                          Marca: {prod.marca}
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
