import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import MisPedidos from './components/MisPedidos';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductsAdmin from './admin/ProductsAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import UsersAdmin from './admin/UsersAdmin';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';

// Crear una instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <div className="App">
            <NavigationBar user={user} setUser={setUser} />
            <main style={{ minHeight: 'calc(100vh - 130px)' }}>
              <Routes>
                <Route path="/" element={<Home user={user} setUser={setUser} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login onLogin={(usuario) => {
                  localStorage.setItem("user", JSON.stringify(usuario));
                  setUser(usuario);
                }} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="orders" element={<OrdersAdmin />} />
                  <Route path="users" element={<UsersAdmin />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;