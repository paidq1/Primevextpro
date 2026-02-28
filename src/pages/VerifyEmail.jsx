import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.message && data.message.includes('verified')) setStatus('success');
        else setStatus('invalid');
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const icons = {
    verifying: { color: '#6366f1', icon: <svg width='28' height='28' fill='none' stroke='#6366f1' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6l4 2'/><circle cx='12' cy='12' r='10'/></svg>, title: 'Verifying...', text: 'Please wait while we verify your email.' },
    success: { color: '#22c55e', icon: <svg width='28' height='28' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>, title: 'Email Verified!', text: 'Your account is now active. You can log in.' },
    invalid: { color: '#ef4444', icon: <svg width='28' height='28' fill='none' stroke='#ef4444' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>, title: 'Invalid Link', text: 'This verification link is invalid or has expired.' },
  };

  const s = icons[status];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8899aa' }}>
      <div style={{ background: '#2d3748', width: '320px', padding: '40px 24px', textAlign: 'center', borderRadius: '4px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          {s.icon}
        </div>
        <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{s.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '9px', marginBottom: '24px', lineHeight: '1.6' }}>{s.text}</p>
        {status === 'success' && (
          <button onClick={() => navigate('/signin')} style={{ padding: '10px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>Go to Login</button>
        )}
        {status === 'invalid' && (
          <button onClick={() => navigate('/signup')} style={{ padding: '10px 28px', background: '#ef4444', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>Register Again</button>
        )}
      </div>
    </div>
  );
}
