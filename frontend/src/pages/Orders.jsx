import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PageHeading from '../components/PageHeading';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const statusColors = {
    pending: '#8a6a17',
    processing: '#486b74',
    completed: '#45653c',
    cancelled: '#9a493b'
  };

  const statusIcons = {
    pending: '⏳',
    processing: '👨‍🍳',
    completed: '✅',
    cancelled: '❌'
  };

  return (
    <>
      <Navbar />
      <div className="shop-page shop-orders">
        <PageHeading title={t('myOrdersTitle')} />

        <div className="container" style={{ padding: '0 2rem' }}>
          {orders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <div className="shop-empty-mark" aria-hidden="true"><img src="/Logo.jpeg" alt="" /></div>
              <h3 style={{ color: '#294126', marginBottom: '1rem' }}>{t('noOrders')}</h3>
              <p style={{ color: '#626c5c', marginBottom: '2rem' }}>{t('startOrdering')}</p>
              <a href="/menu">
                <button className="btn btn-primary">{t('browseMenu')}</button>
              </a>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="card" style={{ 
                marginBottom: '1.5rem', 
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                border: '2px solid #f0f0f0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <h3 style={{ color: '#294126', fontSize: '1.5rem' }}>
                    {t('order')} #{order.id}
                  </h3>
                  <span style={{ 
                    padding: '0.5rem 1.5rem', 
                    borderRadius: '25px', 
                    background: statusColors[order.status], 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    {statusIcons[order.status]} {t(order.status).toUpperCase()}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: '#edf0e6', 
                    borderRadius: '8px',
                    borderLeft: language === 'ar' ? 'none' : '4px solid #f9ca3d',
                    borderRight: language === 'ar' ? '4px solid #f9ca3d' : 'none'
                  }}>
                    <p style={{ color: '#626c5c', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('totalAmount')}</p>
                    <p style={{ color: '#294126', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem', 
                    background: '#edf0e6', 
                    borderRadius: '8px',
                    borderLeft: language === 'ar' ? 'none' : '4px solid #5d7f51',
                    borderRight: language === 'ar' ? '4px solid #5d7f51' : 'none'
                  }}>
                    <p style={{ color: '#626c5c', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('orderDate')}</p>
                    <p style={{ color: '#294126', fontWeight: 'bold' }}>
                      {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: '#edf0e6', 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#626c5c', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('deliveryAddress')}</p>
                  <p style={{ color: '#294126' }}>{order.deliveryAddress}</p>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: '#edf0e6', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p style={{ color: '#294126', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    {t('orderItems')}:
                  </p>
                  <ul style={{ marginLeft: language === 'ar' ? '0' : '1.5rem', marginRight: language === 'ar' ? '1.5rem' : '0', lineHeight: '2' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ color: '#626c5c' }}>
                        {language === 'ar' && item.nameAr ? item.nameAr : item.name} <span style={{ color: '#536d38', fontWeight: 'bold' }}>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
