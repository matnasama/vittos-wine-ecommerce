// src/admin/AdminLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  IconButton,
  useMediaQuery,
  Typography,
  Divider,
  useTheme,
  CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240; // Reducido ligeramente para optimizar espacio

export default function AdminLayout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.rol !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const menu = [
    { text: 'Dashboard', path: '/admin' },
    { text: 'Productos', path: '/admin/products' },
    { text: 'Pedidos', path: '/admin/orders' },
    { text: 'Usuarios', path: '/admin/users' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Botón de menú flotante para móviles - Posición ajustada */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            left: 16,
            top: 100, // Ajustado para no superponer con el título
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#e4adb0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#d49a9d'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      {/* Drawer - Menú lateral */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: theme.shadows[3], // Sombra más sutil
            position: 'relative'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 2,
              textAlign: 'center'
            }}
          >
            PANEL DE ADMINISTRACIÓN
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {menu.map((item) => (
            <ListItemButton 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#f5d0d2'
                },
                mb: 0.5
              }}
            >
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: 'medium'
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          <ListItemButton 
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#e4adb0',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#d49a9d'
              }
            }}
          >
            <HomeIcon sx={{ mr: 1, color: 'white' }} />
            <ListItemText 
              primary="IR AL SITIO" 
              primaryTypographyProps={{
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Contenido principal - Diseño optimizado */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
          width: { xs: '100%', md: `calc(90% - ${drawerWidth}px - 10px)` }, // Ajuste del ancho
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(mobileOpen && {
            width: `calc(90% - ${drawerWidth}px - 10px)`
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ 
          maxWidth: '100%', 
          overflowX: 'hidden',
          ml: { md: 2 } // Margen adicional interno
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}