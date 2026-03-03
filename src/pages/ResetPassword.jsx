import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.message === 'Password reset successful') {
        setSuccess(true);
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        setError(res.message || 'Reset failed. Link may have expired.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#151c27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#1e2538', padding: '32px 24px', width: '340px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '40px', height: '40px', margin: '0 auto 12px' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>Reset Password</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginTop: '4px' }}>Enter your new password below</div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Password Reset!</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginTop: '8px' }}>Redirecting to login...</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '6px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder='Enter new password'
                  style={{ width: '100%', background: '#374151', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '9px', color: 'white', fontSize: '9px', boxSizing: 'border-box', outline: 'none' }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '8px' }}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <input type='password' value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder='Confirm new password'
                style={{ width: '100%', background: '#374151', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '9px', color: 'white', fontSize: '9px', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '12px', minHeight: '14px' }}>{error}</div>

            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <span onClick={() => navigate('/signin')} style={{ color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Back to Login</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
