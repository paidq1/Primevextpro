import { useState } from 'react';
import { createDeposit } from '../services/api';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function DepositFunds() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100.00');
  const [method, setMethod] = useState('crypto');
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [fileData, setFileData] = useState(null);

  const address = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';
  const network = 'TRC20 (Tron)';

  const handleCopy = () => {
    navigator.clipboard.writeText(address).catch(() => {
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    });
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < 10) { setError('Minimum deposit amount is $10.00'); return; }
    if (!fileData) { setError('Please upload payment proof.'); return; }
    setError('');
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('method', method);
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
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Deposit Funds:</div>

          {/* Payment Method */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Method</div>
            <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }}>
              <option value='crypto'>Crypto</option>
              <option value='bank'>Bank Transfer</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Amount to deposit</div>
            <input value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Payment Proof */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Proof</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.15)', padding: '10px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', fontSize: '9px', color: 'white', whiteSpace: 'nowrap' }}>Choose File</span>
              <span style={{ color: fileData ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{fileName}</span>
              <input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setFileName(e.target.files[0].name); setFileData(e.target.files[0]); } }} />
            </label>
          </div>

          {/* Bank Transfer Details */}
          {method === 'bank' && (
            <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.15)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: 'white', fontSize: '10px', fontWeight: '700', marginBottom: '4px' }}>Bank Transfer Details</div>
              {[
                ['Bank Name', 'VertexTrade Bank'],
                ['Account Name', 'Quantyrex Markets Ltd'],
                ['Account Number', '0123456789'],
                ['Routing Number', '021000021'],
                ['SWIFT/BIC', 'VTPROUS33'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>{l}</span>
                  <span style={{ color: 'white', fontSize: '9px', fontWeight: '600' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Crypto Address */}
          {method === 'crypto' && (
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>USDT Address:</div>
              <div onClick={handleCopy} style={{ color: '#6366f1', fontSize: '13px', wordBreak: 'break-all', fontWeight: '700', lineHeight: '1.5', cursor: 'pointer' }}>
                {address}
              </div>
            </div>
          )}

          {error && <div style={{ color: '#ef4444', fontSize: '9px' }}>{error}</div>}

          {/* Crypto QR Card */}
          {method === 'crypto' && (
            <div style={{ background: '#000', borderRadius: '16px', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}>Deposit USDT to Bitget</div>
              <img src="/qr-usdt.jpg" alt="USDT QR" style={{ width: '180px', height: '180px', borderRadius: '12px', objectFit: 'contain' }} />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Address</span>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: '600', textAlign: 'right', maxWidth: '200px', wordBreak: 'break-all' }}>{address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Network</span>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{network}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Minimum deposit amount</span>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>0.01</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>* Do not deposit any assets other than USDT to the address.</div>
              </div>
              <img src='/bitget-logo.png' alt='Bitget' style={{ width: '160px', height: '55px', objectFit: 'contain' }} />
              <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: '#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                Submit Payment
              </button>
            </div>
          )}

          {/* Bank Submit */}
          {method === 'bank' && (
            <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: '#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
              Submit Payment
            </button>
          )}

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

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
    </div>
  );
}
