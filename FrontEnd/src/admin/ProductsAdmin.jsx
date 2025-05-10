// src/admin/ProductsAdmin.jsx
import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Grid, useMediaQuery, useTheme
} from '@mui/material';
import { Delete, Edit, Add, Sort, RestartAlt } from '@mui/icons-material';
import axios from 'axios';
import { config } from '../config';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(config.API_ENDPOINTS.ADMIN_PRODUCTOS);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [search, products]);

  const handleFilter = () => {
    const result = products.filter(product =>
      product.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(result);
  };

  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.categoria.localeCompare(b.categoria);
      } else {
        return b.categoria.localeCompare(a.categoria);
      }
    });
    setFilteredProducts(sorted);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleReset = () => {
    setSearch('');
    setSortOrder('asc');
    setFilteredProducts(products);
  };

  const handleCreate = () => {
    setCurrentProduct({
      nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: ''
    });
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct({ ...product });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`${config.API_ENDPOINTS.ADMIN_PRODUCTOS}/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        setError('No se pudo eliminar el producto');
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...currentProduct,
        precio: Number(currentProduct.precio),
        stock: Number(currentProduct.stock)
      };

      if (currentProduct.id) {
        await axios.put(
          `${config.API_ENDPOINTS.ADMIN_PRODUCTOS}/${currentProduct.id}`,
          payload
        );
      } else {
        await axios.post(
          config.API_ENDPOINTS.ADMIN_PRODUCTOS,
          payload
        );
      }
      setOpenModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('No se pudo guardar el producto');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
          onClick={fetchProducts}
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
    <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Gestión de Productos</Typography>

        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              backgroundColor: '#e4adb0',
              '&:hover': { backgroundColor: '#d49a9d' },
              whiteSpace: 'nowrap'
            }}
          >
            AGREGAR PRODUCTO
          </Button>

          <TextField
            label="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={handleSort}
            sx={{
              borderColor: '#e4adb0',
              color: '#e4adb0',
              '&:hover': {
                borderColor: '#d49a9d',
                backgroundColor: 'rgba(228, 173, 176, 0.08)'
              },
              whiteSpace: 'nowrap'
            }}
          >
            ORDENAR POR MARCA ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
          </Button>

          <Button
            variant="text"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{
              color: '#999',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              },
              whiteSpace: 'nowrap'
            }}
          >
            Resetear filtros
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} p={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {product.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.descripcion}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${product.precio}
                </Typography>
                <Typography variant="body2">
                  Stock: {product.stock}
                </Typography>
                <Typography variant="body2">
                  Categoría: {product.categoria}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton onClick={() => handleEdit(product)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(product.id)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              value={currentProduct?.nombre || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={currentProduct?.descripcion || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, descripcion: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Precio"
              type="number"
              value={currentProduct?.precio || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, precio: e.target.value })}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={currentProduct?.stock || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              fullWidth
            />
            <TextField
              label="Categoría"
              value={currentProduct?.categoria || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, categoria: e.target.value })}
              fullWidth
            />
            <TextField
              label="URL de la imagen"
              value={currentProduct?.imagen || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, imagen: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#e4adb0',
              '&:hover': { backgroundColor: '#d49a9d' }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
