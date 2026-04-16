import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
       .then(res => setOrder(res.data))
       .catch(console.error);
  }, [id]);

  if (!order) return <div className="container">Loading order details...</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '40px', maxWidth: '800px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <div style={{ color: '#007600', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '32px' }}>✓</span> Order placed, thanks!
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        Confirmation will be sent to your email.
      </div>

      <div style={{ padding: '20px', border: '1px solid #D5D9D9', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Order Details</h3>
        <p><strong>Order ID:</strong> #{order.id}</p>
        <p><strong>Total Amount:</strong> ${parseFloat(order.totalAmount).toFixed(2)}</p>
        <p><strong>Shipping to:</strong> {order.address}</p>
      </div>

      <div>
        <h4>Items ordered</h4>
        <ul style={{ listStyle: 'none', marginTop: '10px' }}>
          {order.OrderItems.map(item => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span>{item.quantity}x {item.Product.name}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/" className="btn btn-yellow">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
