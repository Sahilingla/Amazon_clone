import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ width: '400px', border: '1px solid #D5D9D9', padding: '30px', borderRadius: '8px', background: '#fff' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: '400', fontSize: '28px' }}>Sign in</h2>
        {error && <div style={{ color: '#B12704', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input 
              type="email" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #a6a6a6' }} 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input 
              type="password" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #a6a6a6' }} 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-yellow" style={{ width: '100%' }}>Continue</button>
        </form>
        
        <div style={{ marginTop: '30px', borderTop: '1px solid #e7e7e7', paddingTop: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#767676', backgroundColor: '#fff', display: 'inline-block', position: 'relative', top: '-24px', padding: '0 10px' }}>
            New to Amazon?
          </div>
          <button 
            type="button"
            className="btn"
            style={{ width: '100%', border: '1px solid #a6a6a6', background: '#e7e9ec' }}
            onClick={() => navigate('/signup')}
          >
            Create your Amazon account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
