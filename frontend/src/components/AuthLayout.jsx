import Navbar from './Navbar';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <>
      <Navbar />
      <div style={{ 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 72px)', 
        padding: 'clamp(1rem, 4vw, 2rem)',
        background: `
          radial-gradient(1100px 520px at 8% 0%, rgba(249, 202, 61, 0.28) 0%, transparent 52%),
          radial-gradient(900px 480px at 100% 100%, rgba(249, 202, 61, 0.18) 0%, transparent 48%),
          radial-gradient(640px 360px at 82% 12%, rgba(255, 255, 255, 0.14) 0%, transparent 42%),
          linear-gradient(165deg, #2c4127 0%, #4a6741 42%, #638a56 68%, #354d30 100%)
        `
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.4,
          backgroundImage: 'radial-gradient(rgba(249, 202, 61, 0.45) 1.2px, transparent 1.2px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)'
        }} />
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 202, 61, 0.45) 0%, rgba(249, 202, 61, 0) 70%)',
          filter: 'blur(8px)',
          animation: 'login-orb 10s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-40px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(93, 127, 81, 0) 70%)',
          filter: 'blur(10px)',
          animation: 'login-orb-alt 12s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '18%',
          right: '12%',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 202, 61, 0.28) 0%, transparent 70%)',
          animation: 'login-orb 14s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(20, 32, 18, 0.28) 100%)'
        }} />
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.96)', 
          padding: 'clamp(1.5rem, 6vw, 3rem)', 
          borderRadius: '18px', 
          width: '100%', 
          maxWidth: '450px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28), 0 0 40px rgba(249, 202, 61, 0.12)',
          border: '3px solid #f9ca3d',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/Logo.jpeg"
              alt="Simsima's Kitchen"
              style={{
                display: 'block',
                width: '110px',
                height: 'auto',
                borderRadius: '16px',
                margin: '0 auto 1rem',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)'
              }}
            />
            <h2 style={{ 
              color: '#4a6741', 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
              {title}
            </h2>
            <p style={{ color: '#666' }}>{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </>
  );
}
