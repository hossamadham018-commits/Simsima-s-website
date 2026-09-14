import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FoodImage from '../components/FoodImage';
import PageHeading from '../components/PageHeading';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  }, []);

  const categoryIcons = {
    main: '🍛',
    appetizer: '🥗',
    beverage: '🥤',
    dessert: '🍰'
  };

  return (
    <>
      <Navbar />
      <div className="shop-page shop-menu">
        <PageHeading title={t('ourMenu')} subtitle={t('menuSubtitle')} />

        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2rem)' 
          }}>
            {menu.map(item => (
              <div key={item.id} className="card" style={{ 
                border: '1px solid rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: 'clamp(200px, 35vw, 240px)', 
                  background: item.image ? 'transparent' : '#294126',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {item.image ? (
                    <FoodImage
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                      alt={language === 'ar' && item.nameAr ? item.nameAr : item.name}
                    />
                  ) : (
                    <span style={{ 
                      fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', 
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      textAlign: 'center',
                      padding: '1rem',
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                    </span>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: language === 'ar' ? 'auto' : '15px',
                    left: language === 'ar' ? '15px' : 'auto',
                    background: '#f9ca3d',
                    color: '#294126',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '30px',
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 10
                  }}>
                    {t(item.category)}
                  </div>
                </div>
                <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                  <h3 style={{ 
                    color: '#294126', 
                    marginBottom: '0.75rem', 
                    fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                  </h3>
                  <p style={{ 
                    color: '#626c5c', 
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                    margin: '0.5rem 0 1.25rem', 
                    minHeight: '45px',
                    lineHeight: '1.6'
                  }}>
                    {language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    background: '#edf0e6',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}>
                    <span style={{ 
                      color: '#626c5c', 
                      fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                      fontWeight: '500'
                    }}>
                      {t('price')}
                    </span>
                    <span style={{ 
                      fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', 
                      fontWeight: '800', 
                      color: '#536d38'
                    }}>
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <button 
                    className="btn" 
                    style={{ 
                      width: '100%',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                      color: '#294126',
                      boxShadow: '0 4px 12px rgba(249, 202, 61, 0.3)'
                    }} 
                    onClick={() => addToCart(item)}
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
