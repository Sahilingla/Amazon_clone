import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
       .then(res => {
         setOrders(res.data);
         setLoading(false);
       })
       .catch(err => {
         console.error(err);
         setLoading(false);
       });
  }, []);

  if (loading) return <div className="container">Loading your orders...</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontWeight: 400 }}>Your Orders</h1>
      
      {orders.length === 0 ? (
        <p>You have not placed any orders yet. <Link to="/">Start shopping</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #D5D9D9', borderRadius: '8px', overflow: 'hidden' }}>
              
              {/* Order Header */}
              <div style={{ background: '#F0F2F2', padding: '15px 20px', borderBottom: '1px solid #D5D9D9', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#565959' }}>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div>
                    <div style={{ textTransform: 'uppercase' }}>Order Placed</div>
                    <div style={{ color: '#0F1111' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div style={{ textTransform: 'uppercase' }}>Total</div>
                    <div style={{ color: '#0F1111' }}>${parseFloat(order.totalAmount).toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ textTransform: 'uppercase' }}>Ship To</div>
                    <div style={{ color: '#007185', cursor: 'pointer' }}>{order.address.split(',')[0]}...</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ textTransform: 'uppercase' }}>Order # {order.id}</div>
                  <Link to={`/order-confirmation/${order.id}`}>View order details</Link>
                </div>
              </div>
              
              {/* Order Body Summary */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                  Status: <span style={{ color: order.status === 'Placed' ? '#B12704' : '#007600' }}>{order.status}</span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
