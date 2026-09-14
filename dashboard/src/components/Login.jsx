import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        onLogin(res.data.token);
      } else {
        alert('Admin access required');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/Logo.jpeg" alt="Simsima's Kitchen" />
          <p>Simsima's Kitchen</p>
          <h2>
            Admin Login
          </h2>
          <span>Welcome to your dashboard</span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Email
            </label>
            <input 
              type="email" 
              placeholder="admin@simsima.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Password
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
              padding: '1rem'
            }}
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
