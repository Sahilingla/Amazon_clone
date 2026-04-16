import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Amazon<span>.clone</span>
      </Link>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for products, brands and more"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <Search size={20} color="#333" />
        </button>
      </form>

      {/* Nav Actions */}
      <div className="nav-actions">
        {user ? (
          <div className="nav-item" onClick={logout}>
            <span className="nav-item-line-1">Hello, {user.name.split(' ')[0]}</span>
            <span className="nav-item-line-2">Sign Out</span>
          </div>
        ) : (
          <Link to="/login" className="nav-item">
            <span className="nav-item-line-1">Hello, sign in</span>
            <span className="nav-item-line-2">Account & Lists</span>
          </Link>
        )}
        
        <Link to="/orders" className="nav-item" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="nav-item-line-1">Returns</span>
          <span className="nav-item-line-2">& Orders</span>
        </Link>

        <Link to="/cart" className="nav-item cart-icon-container">
          <ShoppingCart size={32} color="#fff" />
          <span className="cart-count">{cartCount}</span>
          <span className="nav-item-line-2" style={{ marginLeft: 5 }}>Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
