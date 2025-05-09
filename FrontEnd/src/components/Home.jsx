// src/components/Home.jsx
import React, { useState, useMemo } from "react";
import {
  Container, Grid, Typography, Snackbar, Box, Modal, Button, CircularProgress, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Carousel from "react-material-ui-carousel";
import { useProducts } from '../api/queries';
import ProductCard from './ProductCard';

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"];

function Home({ user, setUser }) {
  const [zoomImage, setZoomImage] = useState(null);
  const [openZoomModal, setOpenZoomModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();
  const { data: products, isLoading, error } = useProducts();

  const handleAddToCart = (variant) => {
    addToCart({
      id: variant.id,
      nombre: variant.nombre,
      price: Number(variant.precio),
      imagen: variant.imagen_url,
      quantity: 1,
    });
    setOpenToast(true);
  };

  const handleZoom = (imageName) => {
    setZoomImage(`/products/${imageName}`);
    setOpenZoomModal(true);
  };

  // Obtener todas las marcas únicas
  const brands = useMemo(() => {
    if (!products) return [];
    const set = new Set(products.map(p => p.categoria));
    return Array.from(set);
  }, [products]);

  // Lógica del botón TODO
  const allSelected = selectedBrands.length === brands.length;
  const noneSelected = selectedBrands.length === 0;

  const handleBrandToggle = (event, newBrands) => {
    // Si se hace click en TODO
    if (newBrands.includes('TODO')) {
      if (allSelected) {
        setSelectedBrands([]);
      } else {
        setSelectedBrands(brands);
      }
      return;
    }
    setSelectedBrands(newBrands);
  };

  // Filtrar productos según las marcas seleccionadas
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedBrands.length === 0 || allSelected) return products;
    return products.filter(p => selectedBrands.includes(p.categoria));
  }, [products, selectedBrands, allSelected]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">Error al cargar los productos</Typography>
      </Box>
    );
  }

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Carousel>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide ${index}`}
              loading="lazy"
              style={{ width: "100%", height: 300, objectFit: "cover" }}
            />
          ))}
        </Carousel>
      </Container>

      {/* Barra de filtros por marca */}
      <Container sx={{ mt: 4, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 2,
            maxWidth: '90%',
            mx: 'auto',
            minHeight: 90,
          }}
        >
          <ToggleButtonGroup
            value={allSelected ? brands : selectedBrands}
            onChange={handleBrandToggle}
            aria-label="filtro de marcas"
            size="large"
            sx={{
              flexWrap: 'wrap',
              width: '100%',
              gap: 2,
              justifyContent: 'space-around',
              alignItems: 'center',
              minHeight: 90,
            }}
          >
            <ToggleButton
              value="TODO"
              aria-label="TODO"
              selected={allSelected}
              sx={{
                borderRadius: 8,
                fontWeight: 'bold',
                height: 48,
                width: 120,
                color: allSelected ? '#fff' : '#fff',
                backgroundColor: allSelected ? '#e4adb0' : '#424242',
                '&.Mui-selected': {
                  backgroundColor: '#e4adb0',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: allSelected ? '#e4adb0' : '#424242',
                  boxShadow: 'none',
                },
                '&.Mui-focusVisible': {
                  outline: 'none',
                  border: 'none',
                },
                boxShadow: 'none',
                border: 'none',
                mx: 1,
                mb: 1,
                px: 4,
                fontSize: '1rem',
              }}
            >
              TODO
            </ToggleButton>
            {brands.map((brand) => (
              <ToggleButton
                key={brand}
                value={brand}
                aria-label={brand}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                  height: 56,
                  width: 135,
                  color: selectedBrands.includes(brand) || allSelected ? '#fff' : '#fff',
                  backgroundColor: selectedBrands.includes(brand) || allSelected ? '#e4adb0' : '#424242',
                  '&.Mui-selected': {
                    backgroundColor: '#e4adb0',
                    color: '#fff',
                  },
                  '&:hover': {
                    backgroundColor: selectedBrands.includes(brand) || allSelected ? '#e4adb0' : '#424242',
                    boxShadow: 'none',
                  },
                  '&.Mui-focusVisible': {
                    outline: 'none',
                    border: 'none',
                  },
                  boxShadow: 'none',
                  border: 'none',
                  mx: 1,
                  mb: 1,
                  px: 4,
                  fontSize: '1rem',
                }}
              >
                {brand}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Container>

      {/* Grid de productos filtrados */}
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {filteredProducts.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <ProductCard
                variant={producto}
                onAddToCart={handleAddToCart}
                onZoom={handleZoom}
                cart={cart}
                navigate={navigate}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography fontFamily={"libre-baskerville-regular"} variant="h4" sx={{ marginBottom: "16px" }}>
          MEDIOS DE PAGO
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <img src="/tarjeta-credito.png" alt="Tarjeta de crédito" loading="lazy" style={{ height: 50 }} />
          </Grid>
          <Grid item>
            <img src="/dinero.png" alt="Efectivo" loading="lazy" style={{ height: 50 }} />
          </Grid>
          <Grid item>
            <img src="/mercadopago-logo.png" alt="MercadoPago" loading="lazy" style={{ height: 50 }} />
          </Grid>
        </Grid>
      </Container>

      {/* Toast agregado al carrito */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenToast(false)} severity="success" sx={{ width: '100%' }}>
          Producto agregado al carrito
        </MuiAlert>
      </Snackbar>

      {/* Modal de zoom */}
      <Modal open={openZoomModal} onClose={() => setOpenZoomModal(false)}>
        <Box 
          sx={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            marginLeft: "-45%",
            marginTop: "-45%",
            bgcolor: "background.paper", 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 24,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {zoomImage && (
            <img
              src={zoomImage}
              alt="Producto ampliado"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default React.memo(Home);
