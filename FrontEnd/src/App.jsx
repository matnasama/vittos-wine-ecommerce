import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from '@mui/material'; // Importación faltante
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import MisPedidos from "./components/MisPedidos";
import NavigationBar from "./components/NavigationBar";
import { CartProvider } from "./contexts/CartContext";
import Footer from "./components/Footer";
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductsAdmin from './admin/ProductsAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import UsersAdmin from './admin/UsersAdmin';
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <CartProvider>
      <Router>
        <NavigationBar user={user} setUser={setUser} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh' 
        }}>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home user={user} setUser={setUser} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/mis-pedidos" element={<MisPedidos />} />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login onLogin={(usuario) => {
                      localStorage.setItem("user", JSON.stringify(usuario));
                      setUser(usuario);
                    }} />
                  )
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
              </Route>
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </CartProvider>
  );
}

export default App;