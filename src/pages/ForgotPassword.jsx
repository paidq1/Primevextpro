import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) { setMsg('Please enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      setMsg('Reset link sent! Check your email.');
    } catch(e) {
      setMsg('Failed to send reset link. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#131b2e', padding: '16px' }}>
      <div style={{ background: '#1e2538', padding: '40px 20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg viewBox="0 0 40 40" fill="none" width="48" height="48">
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>Forgot your password?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>Enter your email and we'll send you a reset link.</p>

        {!success ? (
          <>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter email"
              style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '13px', padding: '8px 16px', outline: 'none', borderRadius: '6px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            {msg && <div style={{ color: msg.includes('sent') ? '#22c55e' : '#ef4444', fontSize: '11px', marginBottom: '12px' }}>{msg}</div>}
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '9px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#22c55e', fontSize: '40px', marginBottom: '12px' }}>✓</div>
            <div style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>Reset link sent!</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Check your email inbox.</div>
          </div>
        )}

        <div onClick={() => navigate('/dashboard')} style={{ textAlign: 'center', marginTop: '20px', color: '#6366f1', fontSize: '12px', cursor: 'pointer' }}>← Back to Dashboard</div>
      </div>
    </div>
  );
}
