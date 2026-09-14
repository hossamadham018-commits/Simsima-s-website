import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <AuthLayout title={t('joinUs')} subtitle={t('registerSubtitle')}>
          <form className="customer-auth-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                {t('fullName')}
              </label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                {t('email')}
              </label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                {t('phoneNumber')}
              </label>
              <input 
                type="tel" 
                placeholder="08123456789" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                {t('password')}
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)', 
                color: '#4a6741',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              🎉 {t('createAccount')}
            </button>
          </form>
          
          <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
            {t('haveAccount')}{' '}
            <Link to="/login" style={{ 
              color: '#4a6741', 
              fontWeight: 'bold',
              textDecoration: 'none'
            }}>
              {t('loginHere')}
            </Link>
          </p>
    </AuthLayout>
  );
}
