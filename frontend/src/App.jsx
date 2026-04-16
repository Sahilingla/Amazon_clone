import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrdersPage from './pages/OrdersPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Require Auth wrapper
const RequireAuth = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) return null;
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              } />
              <Route path="/checkout" element={
                <RequireAuth>
                  <CheckoutPage />
                </RequireAuth>
              } />
              <Route path="/order-confirmation/:id" element={
                <RequireAuth>
                  <OrderConfirmationPage />
                </RequireAuth>
              } />
              <Route path="/orders" element={
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
