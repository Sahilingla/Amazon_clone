import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { token, user } = useContext(AuthContext); // React to user auth state

  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      setCartCount(0);
      return;
    }
    try {
      const response = await api.get('/cart');
      setCart(response.data);
      setCartCount(response.data.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch whenever the token changes (user logs in or out)
  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
