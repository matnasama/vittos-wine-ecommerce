// src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Button, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, CircularProgress, Modal
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, setCart } = useCart();
  const navigate = useNavigate();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const envio = 3135;
  const total = subtotal + envio;

  useEffect(() => {
    localStorage.setItem("lastCart", JSON.stringify(cart));
  }, [cart]);

  const onFinalizarCompra = async () => {
    const user = JSON.parse(localStorage.getItem(config.USER_KEY));
    const token = localStorage.getItem(config.TOKEN_KEY);
  
    if (!user || !token) {
      alert("Debes iniciar sesión para finalizar la compra.");
      navigate("/login");
      return;
    }
  
    setIsProcessing(true);
  
    const orden = {
      userId: user.id,
      productos: cart.map(({ id, quantity, price }) => ({ productoId: id, quantity, price })),
      total,
    };
  
    try {
      const res = await fetch(`${config.API_URL}/api/orden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orden),
      });
  
      if (!res.ok) throw new Error("Error al registrar la orden");
  
      clearCart();
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate("/mis-pedidos");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar la orden:", error);
      setToastMessage("Hubo un error al procesar tu pedido.");
      setOpenToast(true);
    } finally {
      setIsProcessing(false);
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
          {isProcessing ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography variant="h6">Procesando tu pedido...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>No hay productos en el carrito.</Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                Volver al Inicio
              </Button>
            </>
          )}
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
                      src={`/products/optimized/${item.imagen}`}
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
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }} 
              onClick={onFinalizarCompra}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} color="inherit" />
                  Procesando pedido...
                </Box>
              ) : (
                'Finalizar compra'
              )}
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

      {/* Modal de éxito */}
      <Modal
        open={showSuccessModal}
        onClose={() => {}}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: 400,
            width: '90%',
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="h6" align="center">
            ¡Pago realizado con éxito!
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Aguarde un instante mientras procesamos su pedido...
          </Typography>
        </Box>
      </Modal>

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
