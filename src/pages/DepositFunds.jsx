import { useState } from 'react';
import { createDeposit } from '../services/api';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function DepositFunds() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('100.00');
  const [coin, setCoin] = useState('BTC');
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [fileData, setFileData] = useState(null);

  const coinData = {
    USDT: { address: 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS', network: 'TRC20 (Tron)', qr: 'USDT' },
    ETH:  { address: '0xc6b676d4595687ac100dcb3f350fb6845df2daa8', network: 'Ethereum (ERC20)', qr: 'ETH' },
    USDC: { address: '0xc6b676d4595687ac100dcb3f350fb6845df2daa8', network: 'BEP20 (BSC)', qr: 'USDC' },
    BNB:  { address: '0xc6b676d4595687ac100dcb3f350fb6845df2daa8', network: 'BEP20 (BSC)', qr: 'BNB' },
    SOL:  { address: 'EZT8kz4psrz7rTkbs8kN8ARbzQfkhzmutRRBefJLCiAN', network: 'Solana (SOL)', qr: 'SOL' },
    BTC:  { address: '1B587SJUL5RSNjr41iU2e8eGencRRjUU8d', network: 'Bitcoin (BTC)', qr: 'BTC' },
  };

  const coins = ['USDT', 'ETH', 'USDC', 'BNB', 'SOL', 'BTC'];
  const walletAddress = coinData[coin]?.address;
  const walletNetwork = coinData[coin]?.network;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {
      const el = document.createElement('textarea');
      el.value = walletAddress;
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

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Deposit Funds:</div>

        {/* Payment Method */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Method</div>
          <select style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }}>
            <option>Crypto</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Amount to deposit</div>
          <input value={amount} onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '10px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Payment Proof */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>Payment Proof</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', fontSize: '9px', color: 'white' }}>Choose File</span>
            <span style={{ color: fileData ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{fileName}</span>
            <input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) { setFileName(e.target.files[0].name); setFileData(e.target.files[0]); } }} />
          </label>
        </div>

        {/* Coin Address */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '6px' }}>{coin} Address:</div>
          <div style={{ color: '#6366f1', fontSize: '9px', wordBreak: 'break-all', marginBottom: '10px' }}>{walletAddress}</div>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '9px' }}>{error}</div>}

        {/* QR Section */}
        <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginBottom: '8px', textAlign: 'center' }}>Select Coin:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
            {coins.map(c => (
              <button key={c} onClick={() => setCoin(c)} style={{ padding: '5px 14px', background: coin === c ? '#6366f1' : 'rgba(255,255,255,0.06)', border: coin === c ? 'none' : '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', fontWeight: coin === c ? '700' : '400', cursor: 'pointer' }}>{c}</button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <img src={qrUrl} alt="QR Code" style={{ width: '200px', height: '200px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>Address</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', wordBreak: 'break-all', maxWidth: '200px', textAlign: 'right' }}>{walletAddress}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>Network</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>{walletNetwork}</span>
          </div>

          <button onClick={handleCopy} style={{ width: '100%', marginTop: '12px', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy Address'}
          </button>

          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', textAlign: 'center', marginTop: '10px' }}>*Do not deposit assets other than {coin}.</div>
          <div style={{ color: '#6366f1', fontSize: '8px', textAlign: 'center', marginTop: '6px', fontWeight: '700' }}>✦ VertexTrade Pro</div>
        </div>

        <button onClick={handleSubmit} style={{ padding: '12px', background: '#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
          Submit Payment
        </button>
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
              <button onClick={() => { setShowSuccess(false); }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '10px', cursor: 'pointer', borderRadius: '4px' }}>New Deposit</button>
              <button onClick={() => navigate('/dashboard/deposit')} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>View History</button>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © VertexTrade Pro</div>
    </div>
  );
}
