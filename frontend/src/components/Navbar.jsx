import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

function Icon({ name }) {
  const paths = {
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => { setIsOpen(false); }, [pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const dismiss = (event) => {
      if (event.key === 'Escape') { setIsOpen(false); toggleRef.current?.focus(); }
    };
    const outside = (event) => { if (!navRef.current?.contains(event.target)) setIsOpen(false); };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', outside); };
  }, [isOpen]);
  const close = () => setIsOpen(false);
  return (
    <nav className="kitchen-nav" ref={navRef} aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
      <div className="kitchen-nav-inner">
        <Link to="/" className="kitchen-brand" onClick={close} aria-label="Simsima's Kitchen">
          <img src="/Logo.jpeg" alt="" width="48" height="48" />
          <span className="kitchen-wordmark"><span>Simsima's</span><small>{language === 'ar' ? 'مطبخ طازج' : 'Fresh Kitchen'}</small></span>
        </Link>
        <button type="button" className="kitchen-menu-toggle" ref={toggleRef} aria-expanded={isOpen} aria-controls="kitchen-navigation" aria-label={language === 'ar' ? (isOpen ? 'إغلاق القائمة' : 'فتح القائمة') : (isOpen ? 'Close navigation' : 'Open navigation')} onClick={() => setIsOpen(!isOpen)}>
          <Icon name={isOpen ? 'close' : 'menu'} />
        </button>
        <ul id="kitchen-navigation" className={`kitchen-links${isOpen ? ' is-open' : ''}`}>
          <li><NavLink to="/menu" onClick={close} className="kitchen-link">{t('menu')}</NavLink></li>
          <li><NavLink to="/deals" onClick={close} className="kitchen-link kitchen-deals"><Icon name="star" />{t('dealOfTheDay')}</NavLink></li>
          <li><NavLink to="/cart" onClick={close} className="kitchen-link"><Icon name="bag" />{t('cart')}{cart.length > 0 && <span className="kitchen-cart-count">{cart.length}</span>}</NavLink></li>
          {user ? <>
            <li><NavLink to="/orders" onClick={close} className="kitchen-link">{t('myOrders')}</NavLink></li>
            <li><button type="button" className="kitchen-link kitchen-account" onClick={() => { logout(); close(); }}>{t('logout')}</button></li>
          </> : <li><NavLink to="/login" onClick={close} className="kitchen-link kitchen-account">{t('login')}</NavLink></li>}
          <li className="kitchen-language-item"><button type="button" className="kitchen-language" onClick={() => { toggleLanguage(); close(); }} aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}><Icon name="globe" /><span>{language === 'en' ? 'العربية' : 'English'}</span></button></li>
        </ul>
      </div>
    </nav>
  );
}
