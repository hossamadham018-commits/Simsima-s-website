import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FoodImage from '../components/FoodImage';
import PageHeading from '../components/PageHeading';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Fetch deals from backend
    axios.get('http://localhost:5000/api/deals')
      .then(res => {
        const dealsData = res.data.map(deal => ({
          id: deal.menuItem.id,
          name: deal.menuItem.name,
          nameAr: deal.menuItem.nameAr,
          description: deal.menuItem.description,
          descriptionAr: deal.menuItem.descriptionAr,
          category: deal.menuItem.category || 'custom',
          price: deal.menuItem.price,
          discountPercent: deal.discountPercent,
          originalPrice: deal.menuItem.originalPrice,
          dealPrice: deal.menuItem.dealPrice,
          dayOfWeek: deal.dayOfWeek,
          image: deal.menuItem.image
        }));
        setDeals(dealsData);
      })
      .catch(err => console.error(err));
  }, []);

  // Countdown timer - counts down to midnight (end of current day)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Set to midnight tonight
      
      const diff = midnight - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      <div className="shop-page shop-deals">
        <PageHeading title={t('dealsTitle')} subtitle={t('dealsSubtitle')}>
          <div className="shop-countdown">
            <span>{t('offerEndsIn')}</span>
            <div className="shop-clock" dir="ltr">{[
              [timeLeft.hours, t('hours')], [timeLeft.minutes, t('minutes')], [timeLeft.seconds, t('seconds')]
            ].map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
          </div>
        </PageHeading>

        <div className="container">
          {deals.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <div className="shop-empty-mark" aria-hidden="true"><img src="/Logo.jpeg" alt="" /></div>
              <h3 style={{ color: '#294126', marginBottom: '1rem' }}>{t('noDeals')}</h3>
              <p style={{ color: '#626c5c', marginBottom: '2rem' }}>{t('checkBackLater')}</p>
              <a href="/menu">
                <button className="btn btn-primary">{t('browseMenu')}</button>
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
              {deals.map(item => (
                <div key={item.id} className="card" style={{ 
                  border: '1px solid #dce1d6',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Discount Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: language === 'ar' ? 'auto' : '15px',
                    left: language === 'ar' ? '15px' : 'auto',
                    background: '#294126',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)',
                    zIndex: 10,
                    transform: 'none'
                  }}>
                    {item.discountPercent}% {t('discount')}
                  </div>

                  <div style={{ 
                    height: '240px', 
                    background: item.image ? 'transparent' : 'linear-gradient(135deg, #5d7f51 0%, #4a6741 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#536d38',
                    fontSize: '3.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {item.image ? (
                      <FoodImage
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                      alt={language === 'ar' && item.nameAr ? item.nameAr : item.name}
                    />
                    ) : (
                      <>
                        {/* Animated sparkles */}
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          left: '20px',
                          fontSize: '2rem',
                          animation: 'twinkle 1.5s infinite'
                        }}>✨</div>
                        <div style={{
                          position: 'absolute',
                          top: '30px',
                          right: '30px',
                          fontSize: '1.5rem',
                          animation: 'twinkle 2s infinite'
                        }}>⭐</div>
                        
                        <span style={{ 
                          fontSize: '1.8rem', 
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                          textAlign: 'center',
                          padding: '1rem'
                        }}>
                          {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                        </span>
                      </>
                    )}
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: '#294126', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                      {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                    </h3>
                    <p style={{ color: '#626c5c', fontSize: '0.95rem', margin: '0.5rem 0 1rem', minHeight: '40px' }}>
                      {language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}
                    </p>

                    {/* Limited Time Badge */}
                    <div style={{
                      background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#294126'
                    }}>
                      {t('limitedTime')}
                    </div>

                    {/* Pricing */}
                    <div style={{ 
                      marginBottom: '1rem',
                      padding: '1rem',
                      background: '#edf0e6',
                      borderRadius: '8px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#626c5c', fontSize: '0.9rem', textDecoration: 'line-through' }}>
                          {t('originalPrice')}: {formatCurrency(item.originalPrice)}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#294126', fontWeight: '600' }}>{t('dealPrice')}:</span>
                        <span style={{ 
                          fontSize: '1.8rem', 
                          fontWeight: 'bold', 
                          color: '#e74c3c'
                        }}>
                          {formatCurrency(item.dealPrice)}
                        </span>
                      </div>
                      <div style={{ 
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#d4edda',
                        borderRadius: '5px',
                        textAlign: 'center',
                        color: '#155724',
                        fontWeight: 'bold'
                      }}>
                        {t('youSave')}: {formatCurrency(item.originalPrice - item.dealPrice)}
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary" 
                      style={{ 
                        width: '100%',
                        fontSize: '1.1rem',
                        padding: '1rem',
                        background: '#294126',
                        color: 'white'
                      }} 
                      onClick={() => addToCart({...item, price: item.dealPrice})}
                    >
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </>
  );
}
