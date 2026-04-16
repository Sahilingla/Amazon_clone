import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.quantity * item.Product.price), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container cart-page animate-fade-in">
      <div className="cart-items">
        <h1 style={{ marginBottom: '20px', fontSize: '28px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div>
            Your cart is empty. <Link to="/">Continue shopping</Link>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item-row">
              <img src={item.Product.image} alt={item.Product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <Link to={`/product/${item.Product.id}`} style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {item.Product.name}
                </Link>
                <div style={{ color: '#007600', marginTop: '5px' }}>In Stock</div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '20px' }}>
                  <select 
                    value={item.quantity} 
                    onChange={e => updateQuantity(item.id, Number(e.target.value))}
                    style={{ padding: '5px', borderRadius: '4px' }}
                  >
                    {[...Array(10).keys()].map(i => (
                      <option key={i+1} value={i+1}>Qty: {i+1}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                ${parseFloat(item.Product.price).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          Subtotal ({totalItems} items): <span style={{ fontWeight: 'bold' }}>${subtotal.toFixed(2)}</span>
        </div>
        <button 
          className="btn btn-yellow" 
          style={{ width: '100%' }}
          onClick={() => navigate('/checkout')}
          disabled={cart.length === 0}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
