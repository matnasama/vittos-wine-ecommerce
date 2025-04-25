// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import {
  Container, Grid, Accordion, AccordionSummary, AccordionDetails,
  Card, CardMedia, CardContent, CardActions, Typography, IconButton, Badge,
  Snackbar, Box, Modal, Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MuiAlert from '@mui/material/Alert';
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Carousel from "react-material-ui-carousel";
import Login from "./Login";

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"];

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
  const [wines, setWines] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);
  const [openZoomModal, setOpenZoomModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const navigate = useNavigate();

  const { cart, addToCart, clearCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:4000/productos")
      .then((res) => res.json())
      .then((data) => {
        const winesAgrupados = agruparProductosPorMarca(data);
        setWines(winesAgrupados);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const handleZoom = (imageName) => {
    setZoomImage(`/products/${imageName}`);
    setOpenZoomModal(true);
  };

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

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Carousel>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide ${index}`}
              style={{ width: "100%", height: 300, objectFit: "cover" }}
            />
          ))}
        </Carousel>
      </Container>

      <Container sx={{ mt: 4 }}>
        {wines.map((wine, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">{wine.brand}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {wine.variants.map((variant, vIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={vIndex}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                      <CardMedia
                        component="img"
                        image={`/products/${variant.image}`}
                        alt={variant.type}
                        height="200"
                        sx={{ objectFit: "contain", p: 2 }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {variant.type}
                        </Typography>
                        <Typography variant="body1">${variant.price}</Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <IconButton onClick={() => handleZoom(variant.image)} title="Ver imagen">
                          <SearchIcon />
                        </IconButton>
                        <Badge badgeContent={cart.find(item => item.id === variant.id)?.quantity || 0} color="error">
                          <IconButton onClick={() => handleAddToCart(variant)}>
                            <AddShoppingCartIcon />
                          </IconButton>
                        </Badge>
                        <IconButton onClick={() => navigate("/cart")} color="primary" title="Ir al carrito">
                          <ShoppingCartOutlinedIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
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
            <img src="/tarjeta-credito.png" alt="Tarjeta de crédito" style={{ height: 50 }} />
          </Grid>
          <Grid item>
            <img src="/dinero.png" alt="Efectivo" style={{ height: 50 }} />
          </Grid>
          <Grid item>
            <img src="/mercadopago-logo.png" alt="MercadoPago" style={{ height: 50 }} />
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
            transform: "translate(-50%, -50%)", 
            bgcolor: "background.paper", 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 24,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton 
            onClick={() => setOpenZoomModal(false)} 
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {zoomImage && (
            <img 
              src={zoomImage} 
              alt="Zoom" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "80vh", 
                width: "auto", 
                height: "auto",
                objectFit: "contain",
                margin: "auto"
              }} 
            />
          )}
        </Box>
      </Modal>


      {/* Modal de login */}
      {showLogin && (
        <Modal open={true} onClose={() => setShowLogin(false)}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24, maxWidth: 400, width: "90%" }}>
            <IconButton onClick={() => setShowLogin(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Login onLogin={(usuario) => {
              localStorage.setItem("user", JSON.stringify(usuario));
              setUser(usuario);
              setShowLogin(false);
            }} />
          </Box>
        </Modal>
      )}
    </>
  );
}

export default Home;
