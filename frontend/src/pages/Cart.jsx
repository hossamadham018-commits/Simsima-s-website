import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PageHeading from '../components/PageHeading';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        total,
        deliveryAddress: address
      });
      alert('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  return (
    <>
      <Navbar />
      <div className="shop-page shop-cart">
        <PageHeading title={t('shoppingCart')} />

        <div className="container">
          {cart.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0, 0, 0, 0.04)'
            }}>
              <div className="shop-empty-mark" aria-hidden="true"><img src="/Logo.jpeg" alt="" /></div>
              <h3 style={{ 
                color: '#294126', 
                marginBottom: '1rem',
                fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
                fontWeight: '700',
                fontFamily: "'Playfair Display', serif"
              }}>
                {t('yourCartEmpty')}
              </h3>
              <p style={{ 
                color: '#626c5c', 
                marginBottom: '2rem',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                lineHeight: '1.6'
              }}>
                {t('addItems')}
              </p>
              <a href="/menu">
                <button className="btn" style={{
                  background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                  color: '#294126',
                  fontWeight: '700'
                }}>{t('browseMenu')}</button>
              </a>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)', 
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#294126', 
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
                      fontWeight: '700',
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                    </h3>
                    <p style={{ 
                      color: '#536d38',
                      fontWeight: 'bold', 
                      fontSize: 'clamp(1.1rem, 3vw, 1.3rem)' 
                    }}>
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 'clamp(0.75rem, 2vw, 1rem)', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      alignItems: 'center',
                      background: '#edf0e6',
                      padding: '0.5rem',
                      borderRadius: '12px'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: 'clamp(38px, 9vw, 44px)',
                          height: 'clamp(38px, 9vw, 44px)',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'white',
                          color: '#294126',
                          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                          transition: 'all 0.3s'
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', 
                        fontWeight: 'bold',
                        minWidth: 'clamp(35px, 9vw, 45px)',
                        textAlign: 'center',
                        color: '#294126'
                      }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: 'clamp(38px, 9vw, 44px)',
                          height: 'clamp(38px, 9vw, 44px)',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#294126',
                          color: '#536d38',
                          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(74, 103, 65, 0.3)',
                          transition: 'all 0.3s'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      style={{ 
                        background: '#9a493b',
                        color: 'white',
                        border: 'none',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                        transition: 'all 0.3s'
                      }}
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
              <div className="card" style={{ 
                marginTop: 'clamp(2rem, 4vw, 2.5rem)', 
                padding: 'clamp(1.75rem, 4vw, 2.5rem)',
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'clamp(1.75rem, 4vw, 2.5rem)',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  background: '#edf0e6',
                  borderRadius: '16px',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  border: '1px solid rgba(0, 0, 0, 0.04)'
                }}>
                  <h3 style={{ 
                    color: '#294126', 
                    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {t('total')}
                  </h3>
                  <h3 style={{ 
                    fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
                    fontWeight: '800',
                    color: '#536d38'
                  }}>
                    {formatCurrency(total)}
                  </h3>
                </div>
                <textarea 
                  placeholder={`📍 ${t('deliveryPlaceholder')}`}
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ 
                    marginTop: '1rem',
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  rows="4"
                />
                <button 
                  className="btn" 
                  onClick={handleCheckout} 
                  style={{ 
                    width: '100%', 
                    marginTop: '1.5rem', 
                    fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', 
                    padding: 'clamp(1rem, 3vw, 1.25rem)',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                    color: '#294126'
                  }}
                >
                  {t('placeOrder')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
