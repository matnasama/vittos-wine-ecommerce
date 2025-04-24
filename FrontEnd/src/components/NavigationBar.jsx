// src/components/NavigationBar.jsx
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; // 👉 Agregamos useLocation
import { useCart } from "../contexts/CartContext";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import Email from "@mui/icons-material/Email";
import WhatsApp from "@mui/icons-material/WhatsApp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function NavigationBar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation(); // 👉 Saber dónde estamos
  const { cart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position="static" color='transparent'
    sx={{ 
        backgroundColor: "#e4adb0",
        width: '100%',
        margin: 'auto'
    }}>
      <Toolbar 
      sx={{ 
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        display: 'flex',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        color:'#fff',
        transition: 'all 0.3s ease'
      }}>
        <Box>
        <Typography
            fontFamily={"libre-baskerville-regular"}
            variant="h3"
            p={2}
            sx={{
                flexGrow: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { opacity: 0.7 }
            }}
            onClick={() => navigate('/')}
            >
            VITTO'S WINE
        </Typography>
        </Box>
        <Box
              sx={{ 
                display: 'flex',
                color:'#fff',
              }}
        >            
        <IconButton color="inherit" href="https://www.facebook.com/" target="_blank"><Facebook /></IconButton>
        <IconButton color="inherit" href="https://www.instagram.com/" target="_blank"><Instagram /></IconButton>
        <IconButton color="inherit" href="mailto:lujanlucasariel@gmail.com"><Email /></IconButton>
        <IconButton color="inherit" href="https://wa.me/5491164978342" target="_blank"><WhatsApp /></IconButton>
        <IconButton color="inherit" onClick={() => navigate("/cart")}>
          <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate("/mis-pedidos")}>
              Mis Pedidos
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        ) : (
          // 👉 Solo mostramos "Iniciar Sesión" si NO estamos en /login
          location.pathname !== '/login' && (
            <Button color="inherit" onClick={() => navigate("/login")}>
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

