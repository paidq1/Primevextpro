import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import PageHeader from '../components/PageHeader';

const cryptoPlans = [
  { name: 'Bitcoin',    symbol: 'BTC',  roi: '28.75%', color: '#f7931a', bg: '#f7931a', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { name: 'Ethereum',   symbol: 'ETH',  roi: '30%',    color: '#627eea', bg: '#627eea', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { name: 'BNB',        symbol: 'BNB',  roi: '28%',    color: '#f3ba2f', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { name: 'Solana',     symbol: 'SOL',  roi: '32%',    color: '#9945ff', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { name: 'XRP',        symbol: 'XRP',  roi: '22.5%',  color: '#00aae4', bg: '#00aae4', logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  { name: 'Cardano',    symbol: 'ADA',  roi: '20%',    color: '#3cc8c8', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
  { name: 'Avalanche',  symbol: 'AVAX', roi: '26%',    color: '#e84142', bg: '#e84142', logo: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
  { name: 'Polkadot',   symbol: 'DOT',  roi: '22%',    color: '#e6007a', bg: '#e6007a', logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
  { name: 'Chainlink',  symbol: 'LINK', roi: '21%',    color: '#375bd2', bg: '#375bd2', logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
  { name: 'Polygon',    symbol: 'MATIC',roi: '23.5%',  color: '#8247e5', bg: '#8247e5', logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
  { name: 'Litecoin',   symbol: 'LTC',  roi: '24.75%', color: '#bfbbbb', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
  { name: 'Tether USD', symbol: 'USDT', roi: '24.75%', color: '#26a17b', bg: '#26a17b', logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
  { name: 'Dogecoin',   symbol: 'DOGE', roi: '18%',    color: '#c2a633', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
  { name: 'Uniswap',    symbol: 'UNI',  roi: '19.5%',  color: '#ff007a', bg: '#ff007a', logo: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg' },
  { name: 'TRON',       symbol: 'TRX',  roi: '17.5%',  color: '#eb0029', bg: '#eb0029', logo: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
  { name: 'Shiba Inu',  symbol: 'SHIB', roi: '15%',    color: '#e44d26', bg: '#1a1a2e', logo: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png' },
];

export default function NewStake() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInsufficient, setShowInsufficient] = useState(false);

  const handleStake = async () => {
    if (!amount || isNaN(amount) || Number(amount) < 100) { setError('Minimum stake is $100'); return; }
    if (Number(amount) > (user?.balance || 0)) { setShowInsufficient(true); return; }
    setError(''); setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://quantyrexs.onrender.com/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: selected.symbol, amount: Number(amount), apy: selected.roi, duration: String(duration) })
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

      {/* Header */}
      <PageHeader title="New Stake" />

      

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Stake Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your {selected?.name} stake is pending approval.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowSuccess(false); setSelected(null); setAmount(''); }} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', cursor: 'pointer' }}>New Stake</button>
              <button onClick={() => navigate('/dashboard/stake')} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>View History</button>
            </div>
          </div>
        </>
      )}

      {/* Insufficient Balance Popup */}
      {showInsufficient && (
        <>
          <div onClick={() => setShowInsufficient(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/><circle cx='12' cy='12' r='10'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Insufficient Balance</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '6px', lineHeight: '1.6' }}>You don't have enough balance to stake <strong>${amount}</strong>.</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px' }}>Available: <strong style={{ color: '#22c55e' }}>{formatAmount(user?.balance || 0, user?.currency)}</strong></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowInsufficient(false)} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowInsufficient(false); navigate('/dashboard/deposit'); }} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Deposit Now</button>
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
                  <img src={c.logo} alt={c.symbol} style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }} />
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
              <img src={selected.logo} alt={selected.symbol} style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }} />
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
                style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '10px 12px', outline: 'none', boxSizing: 'border-box', marginBottom: '6px' }}
              />
              {amount && Number(amount) >= 100 && user?.currency && user.currency !== 'USD' && (
                <div style={{ fontSize: '7px', color: '#f59e0b', marginBottom: '12px' }}>≈ {formatAmount(Number(amount), user.currency)} in your currency</div>
              )}

              {/* Quick amounts */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[100, 500, 1000, 5000].map(a => (
                  <button key={a} onClick={() => setAmount(String(a))}
                    style={{ flex: 1, padding: '5px', background: amount === String(a) ? '#6366f1' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', cursor: 'pointer' }}>
                    ${a.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Duration */}
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', marginBottom: '6px' }}>Lock Duration</div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[7, 14, 30, 60, 90].map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    style={{ flex: 1, padding: '7px 2px', background: duration === d ? selected.color : 'rgba(255,255,255,0.06)', border: `1px solid ${duration === d ? selected.color : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: '8px', fontWeight: duration === d ? '700' : '400', cursor: 'pointer' }}>
                    {d}d
                  </button>
                ))}
              </div>

              {/* Profit Preview */}
              {amount && Number(amount) >= 100 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', marginBottom: '14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '8px', letterSpacing: '1px' }}>ESTIMATED RETURNS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Daily Profit</div>
                      <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: '800' }}>+${(Number(amount) * parseFloat(selected.roi) / 100 / 30).toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Total Profit ({duration}d)</div>
                      <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '800' }}>+${(Number(amount) * parseFloat(selected.roi) / 100 / 30 * duration).toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Total Return</div>
                      <div style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>${(Number(amount) + Number(amount) * parseFloat(selected.roi) / 100 / 30 * duration).toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>ROI Rate</div>
                      <div style={{ color: '#6366f1', fontSize: '11px', fontWeight: '700' }}>{selected.roi}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lock Warning */}
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 12px', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px' }}>🔒</span>
                <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '8px', lineHeight: '1.6' }}>
                  Funds will be locked for <strong style={{ color: 'white' }}>{duration} days</strong>. Early withdrawal is not permitted. Profits are credited daily.
                </div>
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

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
    </div>
  );
}
