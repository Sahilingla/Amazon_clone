import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch Categories
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    // Fetch Products with params
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');

    let url = '/products';
    const params = [];
    if (search) params.push(`search=${search}`);
    if (selectedCategory) params.push(`categoryId=${selectedCategory}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    api.get(url)
       .then(res => setProducts(res.data))
       .catch(console.error);

  }, [location.search, selectedCategory]);

  return (
    <div className="container page-layout animate-fade-in">
      {/* Sidebar with categories */}
      <aside className="sidebar">
        <h3>Categories</h3>
        <ul>
          <li 
            style={{ fontWeight: selectedCategory === null ? 'bold' : 'normal' }}
            onClick={() => setSelectedCategory(null)}
          >
            All Departments
          </li>
          {categories.map(cat => (
            <li 
              key={cat.id} 
              style={{ fontWeight: selectedCategory === cat.id ? 'bold' : 'normal' }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Grid */}
      <main className="main-content">
        <h2>Results</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
