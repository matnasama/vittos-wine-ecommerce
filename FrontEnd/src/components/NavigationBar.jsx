import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Badge, Box, Menu, MenuItem, Avatar 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "../contexts/CartContext";
import { Facebook, Instagram, Email, WhatsApp, ShoppingCart } from "@mui/icons-material";
import { useState } from 'react';

function NavigationBar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    handleMenuClose();
    navigate('/');
  };

  const handleAdminPanel = () => {
    handleMenuClose();
    navigate('/admin');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: "#e4adb0",
        width: '100%',
        boxShadow: 'none',
        top: 0,
        zIndex: 1200
      }}
    >
      <Toolbar 
        sx={{ 
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          py: { xs: 1, md: 0 }
        }}
      >
        <Typography
          fontFamily="libre-baskerville-regular"
          variant="h3"
          sx={{
            cursor: 'pointer',
            '&:hover': { opacity: 0.7 },
            fontSize: { xs: '2rem', md: '3rem' }
          }}
          onClick={() => navigate('/')}
        >
          VITTO'S WINE
        </Typography>

        <Box
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >            
          <IconButton 
            color="inherit" 
            href="https://www.facebook.com/" 
            target="_blank"
            className="zoom-hover"
          >
            <Facebook />
          </IconButton>
          <IconButton 
            color="inherit" 
            href="https://www.instagram.com/" 
            target="_blank"
            className="zoom-hover"
          >
            <Instagram />
          </IconButton>
          <IconButton 
            color="inherit" 
            href="mailto:lujanlucasariel@gmail.com"
            className="zoom-hover"
          >
            <Email />
          </IconButton>
          <IconButton 
            color="inherit" 
            href="https://wa.me/5491164978342" 
            target="_blank"
            className="zoom-hover"
          >
            <WhatsApp />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => navigate("/cart")}
            className="zoom-hover"
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Button 
                color="inherit" 
                onClick={handleMenuClick}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1
                }}
                className="zoom-hover"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {user.nombre.charAt(0)}
                </Avatar>
                {user.nombre}
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate("/mis-pedidos");
                }}>
                  Mis Pedidos
                </MenuItem>
                
                {user.rol === 'admin' && (
                  <MenuItem onClick={handleAdminPanel}>
                    Panel de Administración
                  </MenuItem>
                )}
                
                <MenuItem onClick={handleLogout}>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            location.pathname !== '/login' && (
              <Button 
                color="inherit" 
                onClick={() => navigate("/login")}
                sx={{ fontWeight: 'bold' }}
                className="zoom-hover"
              >
                Iniciar Sesión
              </Button>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;