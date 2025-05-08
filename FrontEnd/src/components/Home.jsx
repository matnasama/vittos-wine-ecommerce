// src/components/Home.jsx
import React, { useState } from "react";
import {
  Container, Grid, Accordion, AccordionSummary, AccordionDetails,
  Typography, Snackbar, Box, Modal, Button, CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Carousel from "react-material-ui-carousel";
import { useProducts } from '../api/queries';
import ProductCard from './ProductCard';

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"];

// Memoize the grouping function
const agruparProductosPorMarca = (productos) => {
  const agrupado = {};

  productos.forEach((producto) => {
    const marca = producto.categoria;
    if (!agrupado[marca]) {
      agrupado[marca] = { brand: marca, variants: [] };
    }
    agrupado[marca].variants.push({
      id: producto.id,
      type: producto.nombre,
      price: producto.precio,
      image: producto.imagen_url,
    });
  });

  return Object.values(agrupado);
};

function Home({ user, setUser }) {
  const [zoomImage, setZoomImage] = useState(null);
  const [openZoomModal, setOpenZoomModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();
  const { data: products, isLoading, error } = useProducts();

  const handleAddToCart = (variant) => {
    addToCart({
      id: variant.id,
      nombre: variant.type,
      price: Number(variant.price),
      imagen: variant.image,
      quantity: 1,
    });
    setOpenToast(true);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleZoom = (imageName) => {
    setZoomImage(`/products/${imageName}`);
    setOpenZoomModal(true);
  };

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

  const wines = agruparProductosPorMarca(products || []);

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

      <Container sx={{ mt: 4 }}>
        {wines.map((wine, index) => (
          <Accordion 
            key={index}
            expanded={expandedAccordion === `panel${index}`}
            onChange={handleAccordionChange(`panel${index}`)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">{wine.brand}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {wine.variants.map((variant, vIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={vIndex}>
                    <ProductCard
                      variant={variant}
                      onAddToCart={handleAddToCart}
                      onZoom={handleZoom}
                      cart={cart}
                      navigate={navigate}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
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
