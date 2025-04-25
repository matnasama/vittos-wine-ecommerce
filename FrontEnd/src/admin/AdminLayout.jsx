// src/admin/AdminLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Cambiado de 'usuarioLogueado' a 'user'
    if (!user || user.rol !== 'admin') {
      navigate('/'); // redirigir si no es admin
    }
  }, [navigate]);

  const menu = [
    { text: 'Dashboard', path: '/admin' },
    { text: 'Productos', path: '/admin/products' },
    { text: 'Pedidos', path: '/admin/orders' },
    { text: 'Usuarios', path: '/admin/users' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>Panel de Administración</Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}>
        <Toolbar />
        <List>
          {menu.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}