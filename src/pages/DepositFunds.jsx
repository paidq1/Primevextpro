import { useState } from 'react';
import { createDeposit } from '../services/api';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function DepositFunds() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100.00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [fileData, setFileData] = useState(null);

  const address = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';
  const network = 'TRC20 (Tron)';
  const qrUrl = '/qr-usdt.jpg';

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < 10) { setError('Minimum deposit amount is $10.00'); return; }
    if (!fileData) { setError('Please upload payment proof.'); return; }
    setError('');
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('method', 'crypto');
      formData.append('proof', fileData);
      const res = await createDeposit(formData);
      if (res.transaction) { setShowSuccess(true); }
      else { setError(res.message || 'Deposit failed. Try again.'); }
    } catch { setError('Server error. Please try again.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Deposit Funds" />

      <div style={{ padding: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Deposit Funds:</div>

          {/* Payment Method */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Method</div>
            <select style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Select Payment Method</option>
              <option selected>Crypto</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Amount to deposit</div>
            <input value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Payment Proof */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Proof</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', fontSize: '9px', color: 'white', whiteSpace: 'nowrap' }}>Choose File</span>
              <span style={{ color: fileData ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{fileName}</span>
              <input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setFileName(e.target.files[0].name); setFileData(e.target.files[0]); } }} />
            </label>
          </div>

          {/* Address */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '4px' }}>USDT Address:</div>
            <div style={{ color: '#6366f1', fontSize: '9px', wordBreak: 'break-all', fontWeight: '600' }}>{address}</div>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '9px' }}>{error}</div>}

                    {/* QR Image */}
          <img src="/qr-usdt.jpg" alt="USDT QR Code" style={{ width: '100%', display: 'block' }} />
            <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700' }}>✦ VertexTrade Pro</div>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: '#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
            Submit Payment
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Deposit Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your deposit has been submitted successfully. It will reflect in your account once confirmed.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowSuccess(false)} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '10px', cursor: 'pointer', borderRadius: '4px' }}>New Deposit</button>
              <button onClick={() => navigate('/dashboard/deposit')} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>View History</button>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © VertexTrade Pro</div>
    </div>
  );
}
