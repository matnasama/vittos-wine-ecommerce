import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import MisPedidos from "./components/MisPedidos";
import NavigationBar from "./components/NavigationBar"; // importamos el nuevo
import { CartProvider } from "./contexts/CartContext";
import Footer from "./components/Footer";
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
        <NavigationBar user={user} setUser={setUser} /> {/* Siempre visible */}

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
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
