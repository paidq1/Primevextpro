import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import DashboardSidebar from '../components/DashboardSidebar';

const cryptoPlans = [
  { name: 'Bitcoin',     symbol: 'BTC',  roi: '28.75%', minRoi: 28.75, color: '#f97316', bg: '#f9731620', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { name: 'Ethereum',    symbol: 'ETH',  roi: '30%',    minRoi: 30,    color: '#6366f1', bg: '#6366f120', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { name: 'Litecoin',    symbol: 'LTC',  roi: '24.75%', minRoi: 24.75, color: '#94a3b8', bg: '#94a3b820', logo: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
  { name: 'BNB',         symbol: 'BNB',  roi: '28%',    minRoi: 28,    color: '#f59e0b', bg: '#f59e0b20', logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { name: 'Tether USD',  symbol: 'USDT', roi: '24.75%', minRoi: 24.75, color: '#22c55e', bg: '#22c55e20', logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
  { name: 'Solana',      symbol: 'SOL',  roi: '32%',    minRoi: 32,    color: '#a855f7', bg: '#a855f720', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { name: 'XRP',         symbol: 'XRP',  roi: '22.5%',  minRoi: 22.5,  color: '#22d3ee', bg: '#22d3ee20', logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  { name: 'Cardano',     symbol: 'ADA',  roi: '20%',    minRoi: 20,    color: '#3b82f6', bg: '#3b82f620', logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
];

export default function NewStake() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStake = async () => {
    if (!amount || isNaN(amount) || Number(amount) < 100) { setError('Minimum stake is $100'); return; }
    if (Number(amount) > (user?.balance || 0)) { setError('Insufficient balance'); return; }
    setError(''); setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://vertextrades.onrender.com/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: selected.symbol, amount: Number(amount), apy: selected.roi, duration: '30' })
      }).then(r => r.json());
      if (res.success || res._id || res.stake) {
        setShowSuccess(true);
      } else {
        setError(res.message || 'Stake failed. Try again.');
      }
    } catch { setError('Network error.'); }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#132035', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '10px', height: '44px', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ New Stake</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>{formatAmount(user?.balance || 0, user?.currency)}</span>
        <button onClick={() => navigate('/dashboard/stake')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Stake Submitted!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Your {selected?.name} stake is pending approval.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowSuccess(false); setSelected(null); setAmount(''); }} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', cursor: 'pointer' }}>New Stake</button>
              <button onClick={() => navigate('/dashboard/stake')} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>View History</button>
            </div>
          </div>
        </>
      )}

      <div style={{ padding: '16px' }}>

        {/* Coin list */}
        {!selected ? (
          <>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginBottom: '12px' }}>Select a crypto asset to stake</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cryptoPlans.map((c, i) => (
                <div key={i} onClick={() => setSelected(c)}
                  style={{ background: '#132035', border: '1px solid rgba(99,102,241,0.2)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                  {/* Coin icon */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: c.bg, border: `2px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={c.logo} alt={c.symbol} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{c.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px' }}>{c.symbol}</div>
                    <div style={{ color: '#22c55e', fontSize: '10px', fontWeight: '600' }}>Minimum ROI: {c.roi}</div>
                  </div>
                  {/* Button */}
                  <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '9px', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Stake {c.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Stake Form */
          <div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '9px', cursor: 'pointer', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Back to coins
            </button>

            <div style={{ background: '#132035', border: `1px solid ${selected.color}30`, padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: selected.bg, border: `2px solid ${selected.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={selected.logo} alt={selected.symbol} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>{selected.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{selected.symbol}</div>
                <div style={{ color: '#22c55e', fontSize: '10px', fontWeight: '600' }}>Minimum ROI: {selected.roi}</div>
              </div>
            </div>

            <div style={{ background: '#132035', border: '1px solid rgba(99,102,241,0.2)', padding: '16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '4px' }}>
                Available Balance: <span style={{ color: '#22c55e', fontWeight: '700' }}>{formatAmount(user?.balance || 0, user?.currency)}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', marginBottom: '6px' }}>Amount to Stake (USD)</div>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Min. $100.00"
                style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '10px 12px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
              />

              {/* Quick amounts */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[100, 500, 1000, 5000].map(a => (
                  <button key={a} onClick={() => setAmount(String(a))}
                    style={{ flex: 1, padding: '5px', background: amount === String(a) ? '#6366f1' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', cursor: 'pointer' }}>
                    ${a.toLocaleString()}
                  </button>
                ))}
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '10px' }}>{error}</div>}

              <button onClick={handleStake} disabled={submitting}
                style={{ width: '100%', padding: '11px', background: submitting ? '#4b4e9b' : selected.color, border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Processing...' : `Stake ${selected.name}`}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © VertexTrade Pro</div>
    </div>
  );
}
