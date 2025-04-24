import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const updateQuantity = (index, delta) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(p => p.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
