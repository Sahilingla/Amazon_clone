import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const data = res.data.data || res.data; // ✅ fix
        setProduct(data);
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <div className="container">Loading...</div>;

  const price = parseFloat(product.price || 0);
  const stock = product.stock || 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
      
      {/* Left - Image */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
        />
      </div>

      {/* Middle */}
      <div style={{ flex: '1' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{product.name}</h1>
        <p style={{ color: '#007185', marginBottom: '15px' }}>Visit the Store</p>

        <hr style={{ borderTop: '1px solid #D5D9D9', marginBottom: '15px' }} />

        <div style={{ fontSize: '28px', color: '#B12704', marginBottom: '15px' }}>
          ${price.toFixed(2)}
        </div>

        <div>
          <h4>About this item:</h4>
          <p style={{ marginTop: '10px', lineHeight: '1.5' }}>
            {product.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Right - Buy Box */}
      <div style={{ flex: '0.5', minWidth: '250px' }}>
        <div style={{ border: '1px solid #D5D9D9', borderRadius: '8px', padding: '20px', background: '#fff' }}>
          
          <div style={{ fontSize: '24px', color: '#B12704', marginBottom: '15px' }}>
            ${price.toFixed(2)}
          </div>

          <div style={{
            color: stock > 0 ? '#007600' : '#B12704',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>
            {stock > 0 ? 'In Stock.' : 'Currently unavailable.'}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Qty: </label>
            <select 
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ padding: '4px', borderRadius: '4px' }}
            >
              {[...Array(Math.min(10, stock || 1)).keys()].map(i => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn btn-yellow"
            style={{ width: '100%', marginBottom: '10px' }}
          >
            Add to Cart
          </button>

          <button 
            onClick={handleBuyNow}
            className="btn btn-orange"
            style={{ width: '100%' }}
          >
            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;