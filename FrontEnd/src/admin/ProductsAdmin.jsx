// src/admin/ProductsAdmin.jsx
import { useEffect, useState } from 'react';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Button, TableContainer, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import ProductModal from './ProductModal';

export default function ProductsAdmin() {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/productos');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos', err);
      showSnackbar('Error al cargar productos', 'error');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCrear = () => {
    setProductoActual({
      nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: ''
    });
    setOpenModal(true);
  };

  const handleEditar = (producto) => {
    setProductoActual({...producto});
    setOpenModal(true);
  };

  const handleEliminar = async (id) => {
    const token = JSON.parse(localStorage.getItem('usuarioLogueado'))?.token;
  
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:4000/api/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        showSnackbar('Producto eliminado correctamente', 'success');
        fetchProductos();
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        showSnackbar('Error al eliminar producto', 'error');
      }
    }
  };

  const handleSave = async () => {
    const token = JSON.parse(localStorage.getItem('usuarioLogueado'))?.token;
  
    try {
      if (productoActual.id) {
        await axios.put(
          `http://localhost:4000/api/productos/${productoActual.id}`,
          productoActual,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        showSnackbar('Producto actualizado correctamente', 'success');
      } else {
        await axios.post(
          'http://localhost:4000/api/productos',
          productoActual,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        showSnackbar('Producto creado correctamente', 'success');
      }
      setOpenModal(false);
      fetchProductos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      showSnackbar('Error al guardar producto', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Gestión de Productos</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mb: 2 }} 
        onClick={handleCrear}
      >
        Agregar Producto
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>{prod.descripcion}</TableCell>
                <TableCell>${prod.precio}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>{prod.categoria}</TableCell>
                <TableCell>
                  {prod.imagen && (
                    <img 
                      src={prod.imagen} 
                      alt={prod.nombre} 
                      style={{ maxWidth: '50px', maxHeight: '50px' }} 
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="secondary" 
                    onClick={() => handleEditar(prod)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleEliminar(prod.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
        producto={productoActual}
        setProducto={setProductoActual}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}