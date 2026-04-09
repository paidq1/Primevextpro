import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`https://quantyrexs.onrender.com/api/auth/verify-email/${token}`);
        const data = await res.json();
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => navigate('/signin'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Server error. Please try again.');
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '8px', padding: '40px 32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        {status === 'verifying' && (
          <>
            <div style={{ width: '52px', height: '52px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
            <h2 style={{ color: '#111827', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>Verifying your email...</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width='24' height='24' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2.5'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
            </div>
            <h2 style={{ color: '#111827', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>Email Verified! 🎉</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px', lineHeight: '1.6' }}>{message}</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 20px' }}>Redirecting to login...</p>
            <button onClick={() => navigate('/signin')} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 28px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Login Now</button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width='24' height='24' fill='none' stroke='#ef4444' viewBox='0 0 24 24' strokeWidth='2.5'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
            </div>
            <h2 style={{ color: '#111827', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>Verification Failed</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px', lineHeight: '1.6' }}>{message}</p>
            <button onClick={() => navigate('/signin')} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 28px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Go to Login</button>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
