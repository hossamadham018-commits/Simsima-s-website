import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/menu');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <AuthLayout title={t('welcomeBack')} subtitle={t('loginSubtitle')}>
          <form
            className="customer-auth-form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                {t('email')}
              </label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
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
              {t('loginButton')}
            </button>
          </form>
          
          <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
            {t('noAccount')}{' '}
            <Link to="/register" style={{ 
              color: '#4a6741', 
              fontWeight: 'bold',
              textDecoration: 'none'
            }}>
              {t('registerNow')}
            </Link>
          </p>
    </AuthLayout>
  );
}
