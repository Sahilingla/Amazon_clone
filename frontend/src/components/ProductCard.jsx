import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>
      <Link to={`/product/${product.id}`}>
        <h3 className="product-title">{product.name}</h3>
      </Link>
      <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          className="btn btn-yellow"
          onClick={() => addToCart(product.id, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
