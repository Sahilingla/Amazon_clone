import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form.name, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ width: '400px', border: '1px solid #D5D9D9', padding: '30px', borderRadius: '8px', background: '#fff' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: '400', fontSize: '28px' }}>Create account</h2>
        {error && <div style={{ color: '#B12704', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Your name</label>
            <input 
              type="text" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #a6a6a6' }} 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
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
              placeholder="At least 6 characters"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #a6a6a6' }} 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-yellow" style={{ width: '100%' }}>Continue</button>
        </form>
        <div style={{ marginTop: '20px', fontSize: '13px' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
