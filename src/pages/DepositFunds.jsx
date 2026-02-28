import { useState } from 'react';
import { createDeposit } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function DepositFunds() {
  const navigate = useNavigate();
  const [depositMethod, setDepositMethod] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [coin, setCoin] = useState('BTC');
  const [network, setNetwork] = useState('TRC20');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [fileData, setFileData] = useState(null);

  const walletAddress = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';
  const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'SOL'];

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {
      const el = document.createElement('textarea');
      el.value = walletAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = { width: '100%', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Deposit Funds</span>
        <button onClick={() => navigate('/dashboard/deposit')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Deposit Funds:</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Left Form */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Payment Method</label>
              <select value={depositMethod} onChange={e => setDepositMethod(e.target.value)}
                style={{ width: '100%', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }}>
                <option value='crypto'>Crypto</option>
                <option value='bank'>Bank Transfer</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Amount to deposit</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='100.00' style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Payment Proof</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px' }}>
                <label style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Choose File<input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setFileName(e.target.files[0].name); setFileData(e.target.files[0]); } }} />
                </label>
                <span style={{ color: fileData ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '8px' }}>{fileName}</span>
              </div>
            </div>

           <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>
             <button onClick={async () => {
            if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
            if (Number(amount) < 10) { setError('Minimum deposit amount is $10.00'); return; }
            if (!fileData) { setError('Please upload payment proof.'); return; }
            setError('');
            try {
              const formData = new FormData();
              formData.append('amount', amount);
              formData.append('method', depositMethod || 'crypto');
              formData.append('proof', fileData);
              const res = await createDeposit(formData);
              if (res.transaction) {
                setShowSuccess(true);
              } else {
                setError(res.message || 'Deposit failed. Try again.');
              }
            } catch(err) {
              setError('Server error. Please try again.');
            }
          }} style={{ padding: '9px 24px', background: '#22c55e', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
                Submit Payment
                    </button>
                </div>

        {depositMethod === 'crypto' ? (
          <div style={{ width: '180px', flexShrink: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px', textAlign: 'left' }}>USDT Address:</div>
              <div style={{ color: '#6366f1', fontSize: '7px', wordBreak: 'break-all', marginBottom: '6px', textAlign: 'left' }}>{walletAddress}</div>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: copied ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '7px', padding: '4px 10px', cursor: 'pointer', marginBottom: '8px', width: '100%', justifyContent: 'center' }}>{copied ? 'Copied!' : 'Copy Address'}</button>
            <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '8px' }}>Deposit USDT to PrimeVest Pro</div>
             <img src='/qrcode.jpg' alt='QR' style={{ width: '110px', height: '110px', margin: '0 auto 10px', display: 'block' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Address</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', wordBreak: 'break-all', maxWidth: '100px', textAlign: 'right' }}>TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Network</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px' }}>TRC20 (Tron)</span>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px', marginBottom: '8px' }}>*Do not deposit assets other than USDT.</div>
    <div style={{ color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>✦ PrimeVest Pro</div>
  </div>
) : (
  <div style={{ width: '180px', flexShrink: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '14px' }}>
    <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>Bank Details</div>
    {[['Bank Name','PrimeVest Bank'],['Account Name','PrimeVest Pro Ltd'],['Account Number','0123456789'],['Routing No.','021000021'],['SWIFT Code','PRVSTUS33']].map(([k,v]) => (
      <div key={k} style={{ marginBottom: '10px' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '2px' }}>{k}</div>
        <div style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{v}</div>
      </div>
    ))}
    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px', marginTop: '8px' }}>* Transfer exact amount and upload proof of payment.</div>
      </div>
        )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Success!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Deposit submitted! Check history for details.</div>
            <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>
            <button onClick={() => { setShowSuccess(false); navigate('/dashboard/deposit'); }} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </div>
  );
}
