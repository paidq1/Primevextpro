import { useState, useEffect, useRef } from 'react';
import { formatAmount } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { createTrade } from '../services/api';

const SYMBOLS = [
  { label: 'BTC/USD', tv: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USD', tv: 'BINANCE:ETHUSDT' },
  { label: 'XRP/USD', tv: 'BINANCE:XRPUSDT' },
  { label: 'SOL/USD', tv: 'BINANCE:SOLUSDT' },
  { label: 'BNB/USD', tv: 'BINANCE:BNBUSDT' },
  { label: 'ADA/USD', tv: 'BINANCE:ADAUSDT' },
];

const DURATIONS = ['30 seconds','1 minute','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 hour'];

export default function NewTrade() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [direction, setDirection] = useState('buy');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('5 minutes');
  const [leverage, setLeverage] = useState('1x');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://quantyrexs.onrender.com/api/user/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setBalance(d.user?.balance ?? d.balance ?? 0)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: symbol.tv, interval: '15', timezone: 'Etc/UTC',
      theme: 'dark', style: '1', locale: 'en', backgroundColor: '#0a0f1e',
    });
    chartRef.current.appendChild(script);
  }, [symbol]);

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (parseFloat(amount) < 10) { setError('Minimum trade amount is $10'); return; }
    if (balance !== null && parseFloat(amount) > parseFloat(balance)) { setError('Insufficient balance'); setShowError(true); return; }
    setSubmitting(true); setError(''); setMsg('');
    try {
      await createTrade({ symbol: symbol.label, type: direction, direction, account: 'real', amount: parseFloat(amount), duration, leverage });
      setMsg('Trade placed successfully!');
      setAmount('');
      setTimeout(() => navigate('/dashboard/live-trading'), 1500);
    } catch (e) {
      setError(e.message || 'Failed to place trade');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Segoe UI', sans-serif", color: 'white', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="New Trade" />

      {/* Chart */}
      <div style={{ height: '80vh', width: '100%', flexShrink: 0, position: 'relative' }}>
        <div className='tradingview-widget-container' ref={chartRef} style={{ position: 'absolute', inset: 0 }} />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Symbol selector */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {SYMBOLS.map(s => (
            <button key={s.label} onClick={() => setSymbol(s)}
              style={{ background: symbol.label === s.label ? 'rgba(99,102,241,0.2)' : 'transparent', border: symbol.label === s.label ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)', color: symbol.label === s.label ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: '700', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* BUY/SELL */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setDirection('buy')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', background: direction === 'buy' ? '#16a34a' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
            BUY
          </button>
          <button onClick={() => setDirection('sell')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', background: direction === 'sell' ? '#dc2626' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
            SELL
          </button>
        </div>

        {/* Balance */}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>
          Available: <span style={{ color: '#22c55e', fontWeight: '700' }}>{formatAmount(balance || 0, user?.currency)}</span>
        </div>

        {/* Amount */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '6px' }}>Amount (USD)</div>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='Min. $10.00'
            style={{ width: '100%', background: '#0d1426', border: `1px solid ${direction === 'buy' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, color: 'white', fontSize: '11px', fontWeight: '700', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Quick amounts */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[10, 50, 100, 500].map(a => (
            <button key={a} onClick={() => setAmount(String(a))}
              style={{ flex: 1, padding: '6px', borderRadius: '6px', background: amount === String(a) ? '#6366f1' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', cursor: 'pointer' }}>
              ${a}
            </button>
          ))}
        </div>

        {/* Duration & Leverage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '6px' }}>Duration</div>
            <select value={duration} onChange={e => setDuration(e.target.value)}
              style={{ width: '100%', background: '#0d1426', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', padding: '8px', outline: 'none', boxSizing: 'border-box', borderRadius: '8px' }}>
              {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '6px' }}>Leverage</div>
            <select value={leverage} onChange={e => setLeverage(e.target.value)}
              style={{ width: '100%', background: '#0d1426', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', padding: '8px', outline: 'none', boxSizing: 'border-box', borderRadius: '8px' }}>
              {['1x','2x','5x','10x','20x','50x','100x'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {msg && <div style={{ color: '#22c55e', fontSize: '9px' }}>{msg}</div>}
        {error && !showError && <div style={{ color: '#ef4444', fontSize: '9px' }}>{error}</div>}

        <button onClick={handleTrade} disabled={submitting}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: submitting ? '#4b4e9b' : direction === 'buy' ? '#16a34a' : '#dc2626', border: 'none', color: 'white', fontSize: '11px', fontWeight: '800', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Placing...' : `Confirm ${direction === 'buy' ? 'Buy' : 'Sell'}`}
        </button>
      </div>

      {/* Error Popup */}
      {showError && (
        <>
          <div onClick={() => setShowError(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Trade Error</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Hello <strong style={{ color: '#111' }}>{user?.name || user?.email?.split('@')[0] || 'there'}</strong>, your balance is too low to place this trade. Please make a deposit and try again.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowError(false)} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              {error === 'Insufficient balance' && (
                <button onClick={() => { setShowError(false); navigate('/dashboard/deposit'); }} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Deposit Now</button>
              )}
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
