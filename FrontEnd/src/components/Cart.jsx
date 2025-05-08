// src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Button, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, setCart } = useCart();
  const navigate = useNavigate();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const envio = 3135;
  const total = subtotal + envio;

  useEffect(() => {
    localStorage.setItem("lastCart", JSON.stringify(cart));
  }, [cart]);

  const onFinalizarCompra = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  
    if (!user || !token) {
      alert("Debes iniciar sesión para finalizar la compra.");
      navigate("/login");
      return;
    }
  
    const orden = {
      userId: user.id,
      productos: cart.map(({ id, quantity, price }) => ({ productoId: id, quantity, price })),
      total,
    };
  
    try {
      const res = await fetch("http://localhost:4000/api/orden", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orden),
      });
  
      if (!res.ok) throw new Error("Error al registrar la orden");
  
      setToastMessage("Pedido realizado con éxito");
      setOpenToast(true);
      clearCart();
  
      setTimeout(() => {
        navigate("/mis-pedidos");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar la orden:", error);
      setToastMessage("Hubo un error al procesar tu pedido.");
      setOpenToast(true);
    }
  };
 

  const handleClearCart = () => {
    clearCart();
    setOpenConfirmDialog(false);
    setToastMessage('Carrito vaciado');
    setOpenToast(true);
  };

  const handleRemoveFromCart = (index) => {
    removeFromCart(index);
    setToastMessage('Producto eliminado del carrito');
    setOpenToast(true);
  };

  const handleRecoverCart = () => {
    const lastCart = JSON.parse(localStorage.getItem("lastCart"));
    if (lastCart && lastCart.length > 0) {
      setCart(lastCart);
    } else {
      alert("No hay un carrito anterior para recuperar.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Tu carrito</Typography>

      {cart.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>No hay productos en el carrito.</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Volver al Inicio
          </Button>

        </Box>
      ) : (
        <Box>
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{ mb: 2, p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={`/products/${item.imagen}`}
                      alt={item.nombre}
                      style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8 }}
                    />
                    <Box>
                      <Typography fontWeight="bold">{item.nombre}</Typography>
                      <Typography variant="body2">${item.price.toFixed(2)}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mt={{ xs: 2, sm: 0 }}>
                    <IconButton onClick={() => updateQuantity(index, -1)}><RemoveIcon /></IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => updateQuantity(index, 1)}><AddIcon /></IconButton>
                  </Box>

                  <Box textAlign="right" mt={{ xs: 2, sm: 0 }}>
                    <Typography variant="subtitle2">Subtotal</Typography>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>

                  <IconButton onClick={() => handleRemoveFromCart(index)} sx={{ color: 'error.main' }}>
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Resumen</Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography>Envío</Typography>
              <Typography>${envio}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2} fontWeight="bold">
              <Typography>Total</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={onFinalizarCompra}>
              Finalizar compra
            </Button>
            <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={() => setOpenConfirmDialog(true)}>
              Vaciar carrito
            </Button>
          </Paper>
        </Box>
      )}

      {/* Dialog confirmación */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>¿Vaciar carrito?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar todos los productos del carrito?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={handleClearCart} color="error">Vaciar</Button>
        </DialogActions>
      </Dialog>

      {/* Toast notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenToast(false)} severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Cart;
