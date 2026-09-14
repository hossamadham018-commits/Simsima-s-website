import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Orders from './components/Orders';
import Menu from './components/Menu';
import Deals from './components/Deals';
import Customers from './components/Customers';
import { dashboardTranslations } from './i18n';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState('orders');
  const [language, setLanguage] = useState(localStorage.getItem('adminLanguage') || 'en');
  const t = dashboardTranslations[language];

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('adminLanguage', language);
  }, [language]);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  const tabs = [
    { id: 'orders', label: t.orders, helper: t.ordersHelp },
    { id: 'customers', label: t.customers, helper: t.customersHelp },
    { id: 'menu', label: t.menu, helper: t.menuHelp },
    { id: 'deals', label: t.deals, helper: t.dealsHelp }
  ];

  return (
    <div className="admin-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div className="admin-brand">
            <img src="/Logo.jpeg" alt="Simsima's Kitchen" />
            <div>
              <p className="admin-eyebrow">{t.kitchen}</p>
              <h1>{t.adminDashboard}</h1>
            </div>
          </div>
          <div className="admin-actions">
            <button
              className="admin-language"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              {t.language}
            </button>
            <button
              className="admin-logout"
              onClick={() => { setToken(null); localStorage.removeItem('adminToken'); }}
            >
              {t.logout}
            </button>
          </div>
        </div>
      </nav>
      <main className="admin-main">
        <section className="admin-hero">
          <p className="admin-eyebrow">{t.controlRoom}</p>
          <h2>{t.hero}</h2>
        </section>

        <div className="admin-tabs" role="tablist" aria-label="Dashboard sections">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? 'admin-tab active' : 'admin-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <small>{tab.helper}</small>
            </button>
          ))}
        </div>
        {activeTab === 'orders' ? <Orders language={language} t={t} /> : activeTab === 'customers' ? <Customers language={language} t={t} /> : activeTab === 'menu' ? <Menu language={language} /> : <Deals language={language} />}
      </main>
    </div>
  );
}
