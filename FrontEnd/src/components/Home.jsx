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

  // Obtener todas las marcas únicas
  const brands = useMemo(() => {
    if (!products) return [];
    const set = new Set(products.map(p => p.categoria));
    return Array.from(set);
  }, [products]);

  const handleBrandToggle = (event, newBrands) => {
    setSelectedBrands(newBrands);
  };

  // Filtrar productos según las marcas seleccionadas
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedBrands.length === 0) return products;
    return products.filter(p => selectedBrands.includes(p.categoria));
  }, [products, selectedBrands]);

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
        <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
          Filtrar por marca
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '10px',
            maxWidth: '100%',
            mx: 'auto',
            minHeight: 90,
          }}
        >
          <ToggleButtonGroup
            value={selectedBrands}
            onChange={handleBrandToggle}
            aria-label="filtro de marcas"
            size="large"
            sx={{
              flexWrap: 'wrap',
              width: '100%',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 90,
            }}
          >
            {brands.map((brand) => (
              <ToggleButton
                key={brand}
                value={brand}
                aria-label={brand}
                sx={{
                  borderRadius: 0,
                  fontWeight: 'bold',
                  height: 30,
                  width: 115,
                  color: selectedBrands.includes(brand) ? '#fff' : '#fff',
                  backgroundColor: selectedBrands.includes(brand) ? '#e4adb0' : '#424242',
                  '&.Mui-selected': {
                    backgroundColor: '#e4adb0',
                    color: '#fff',
                  },
                  '&:hover': {
                    backgroundColor: selectedBrands.includes(brand) ? '#e4adb0' : '#424242',
                    boxShadow: 'none',
                  },
                  '&.Mui-focusVisible': {
                    outline: 'none',
                    border: 'none',
                  },
                  boxShadow: 'none',
                  border: 'none',
                  mb: 1,
                  fontSize: '.65rem',
                }}
              >
                {brand}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Container>

      {/* Grid de productos filtrados */}
      <Container sx={{mt: 2}}>
        <Grid 
          container 
          spacing={1} 
          justifyContent="center"
          sx={{
            '& .MuiGrid-item': {
              minWidth: '280px',
              maxWidth: '280px',
              flexBasis: '280px',
              flexGrow: 0,
              flexShrink: 0,
            }
          }}
        >
          {filteredProducts.map((producto) => (
            <Grid 
              item 
              key={producto.id}
              sx={{
                '@media (max-width: 600px)': {
                  minWidth: '140px',
                  maxWidth: '140px',
                  flexBasis: '140px',
                },
                '@media (min-width: 601px) and (max-width: 900px)': {
                  minWidth: '200px',
                  maxWidth: '200px',
                  flexBasis: '200px',
                },
                '@media (min-width: 901px)': {
                  minWidth: '280px',
                  maxWidth: '280px',
                  flexBasis: '280px',
                }
              }}
            >
              <ProductCard
                variant={producto}
                onAddToCart={handleAddToCart}
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
    </>
  );
}

export default React.memo(Home);
