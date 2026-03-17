import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { createWithdrawal } from '../services/api';

export default function WithdrawVerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const withdrawalData = location.state;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!withdrawalData) {
    navigate('/dashboard/withdraw');
    return null;
  }

  const handleSubmit = async () => {
    if (!code) { setError('Please enter your withdrawal code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await createWithdrawal({ ...withdrawalData, withdrawalCode: code });
      if (res.transaction) {
        navigate('/dashboard/withdraw', { state: { success: true } });
      } else {
        setError(res.message || 'Invalid withdrawal code. Please try again.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0d' }}>
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, padding: '24px', maxWidth: '600px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => navigate('/dashboard/withdraw')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Back to Withdraw
          </button>
        </div>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Withdrawal Verification</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 24px' }}>Enter your withdrawal code to complete this transaction</p>
        <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '32px 24px', width: '100%', textAlign: 'center' }}>
          
          {/* Icon */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width='28' height='28' fill='none' stroke='#6366f1' viewBox='0 0 24 24' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/>
            </svg>
          </div>

          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>Withdrawal Code Required</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 8px', lineHeight: '1.6' }}>
            Enter your withdrawal code to complete this transaction.
          </p>
          <p style={{ color: '#6366f1', fontSize: '12px', margin: '0 0 24px' }}>
            Amount: <strong style={{ color: 'white' }}>${withdrawalData.amount}</strong>
          </p>

          {/* Code Input */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', display: 'block', marginBottom: '6px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Withdrawal Code</label>
            <input
              type='text'
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder='Enter your withdrawal code'
              style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', padding: '12px', outline: 'none', boxSizing: 'border-box', borderRadius: '4px', textAlign: 'center', letterSpacing: '4px', fontWeight: '700' }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', marginBottom: '16px' }}>
              <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '4px', marginBottom: '12px' }}
          >
            {loading ? 'Verifying...' : 'Verify & Withdraw'}
          </button>

          <button
            onClick={() => navigate('/dashboard/withdraw')}
            style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', cursor: 'pointer', borderRadius: '4px' }}
          >
            Cancel
          </button>

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', margin: '16px 0 0', lineHeight: '1.6' }}>
            Do not share your withdrawal code with anyone including support staff.
          </p>
        </div>
      </div>
    </div>
  );
}
