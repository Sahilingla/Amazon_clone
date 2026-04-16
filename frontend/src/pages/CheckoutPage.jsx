import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.quantity * item.Product.price), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return alert('Please enter a shipping address');
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/orders', { address });
      clearCart(); // From context
      navigate(`/order-confirmation/${res.data.orderId}`);
    } catch (error) {
      console.error(error);
      alert('Error placing order');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return <div className="container">Your cart is empty.</div>;

  return (
    <div className="container cart-page animate-fade-in">
      <div className="cart-items">
        <h2>Enter shipping address</h2>
        <form onSubmit={handlePlaceOrder} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Address</label>
            <textarea 
              rows="4" 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #D5D9D9' }}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, City, Country, Zip"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn btn-yellow" 
            style={{ width: '200px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Use this address'}
          </button>
        </form>
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <span>Items ({totalItems}):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <span>Shipping & handling:</span>
          <span>$0.00</span>
        </div>
        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #D5D9D9' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', color: '#B12704', fontWeight: 'bold' }}>
          <span>Order total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button 
          onClick={handlePlaceOrder}
          className="btn btn-yellow" 
          style={{ width: '100%', marginTop: '20px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place your order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
