import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../i18n';

export default function Orders({ language = 'en', t }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    axios.get('http://localhost:5000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}/status`, { status });
      loadOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const statusColors = {
    pending: '#f9ca3d',
    processing: '#3498db',
    completed: '#27ae60',
    cancelled: '#e74c3c'
  };

  const statusIcons = {
    pending: '⏳',
    processing: '👨‍🍳',
    completed: '✅',
    cancelled: '❌'
  };
  const labels = t || {};

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#4a6741', fontSize: '2rem' }}>
        📦 {labels.ordersManagement || 'Orders Management'}
      </h2>
      
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#4a6741' }}>{labels.noOrdersYet || 'No orders yet'}</h3>
          <p style={{ color: '#666' }}>{language === 'ar' ? 'ستظهر الطلبات هنا عندما يطلب العملاء.' : 'Orders will appear here when customers place them'}</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingBottom: '1rem',
              marginBottom: '1rem',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <div>
                <h3 style={{ color: '#4a6741', fontSize: '1.5rem' }}>Order #{order.id}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {new Date(order.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>{labels.updateStatus || 'Update Status'}:</p>
                <select 
                  value={order.status} 
                  onChange={(e) => updateStatus(order.id, e.target.value)} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: statusColors[order.status],
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">⏳ {labels.pending || 'Pending'}</option>
                  <option value="processing">👨‍🍳 {labels.processing || 'Processing'}</option>
                  <option value="completed">✅ {labels.completed || 'Completed'}</option>
                  <option value="cancelled">❌ {labels.cancelled || 'Cancelled'}</option>
                </select>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                background: '#f9f9f9', 
                borderRadius: '8px',
                borderLeft: '4px solid #f9ca3d'
              }}>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>💰 {labels.totalAmount || 'Total Amount'}</p>
                <p style={{ color: '#4a6741', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {formatCurrency(order.total)}
                </p>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                background: '#f9f9f9', 
                borderRadius: '8px',
                borderLeft: '4px solid #5d7f51'
              }}>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {labels.deliveryAddress || 'Delivery Address'}</p>
                <p style={{ color: '#4a6741' }}>{order.deliveryAddress}</p>
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              background: 'linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ color: '#4a6741', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                🍽️ {labels.orderItems || 'Order Items'}:
              </p>
              <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ color: '#666' }}>
                    {item.name} <span style={{ color: '#f9ca3d', fontWeight: 'bold' }}>×{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
