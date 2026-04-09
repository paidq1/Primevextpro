import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://quantyrexs.onrender.com/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  // token comes from URL path param
  const pathToken = window.location.pathname.split('/reset-password/')[1];
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password/${pathToken}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      }).then(r => r.json());
      if (res.message === 'Password reset successful') { setSuccess(true); setTimeout(() => navigate('/signin'), 3000); }
      else setError(res.message || 'Reset failed');
    } catch { setError('Network error'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif", padding: '16px' }}>
      <div style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '30px', width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto 12px' }}>
            <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
              <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
              <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
              <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginTop: '4px' }}>Reset Your Password</div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#22c55e', fontSize: '24px', marginBottom: '12px' }}><svg width='24' height='24' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg></div>
            <div style={{ color: 'white', fontSize: '10px', marginBottom: '8px' }}>Password reset successfully!</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Redirecting to login...</div>
          </div>
        ) : (
          <>
            {!pathToken ? (
              <div style={{ color: '#ef4444', fontSize: '9px', textAlign: 'center' }}>Invalid reset link. Please contact admin.</div>
            ) : (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '6px' }}>New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', padding: '9px 10px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', padding: '9px 10px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '10px' }}>{error}</div>}
                <button onClick={handleReset} disabled={loading} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
