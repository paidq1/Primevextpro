import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Users, FlaskConical, Heart, CheckCircle2, AlertTriangle, TrendingUp, Shield, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getDashboard, startCopyTrade } from '../services/api';
import { formatAmountWithCode, getCurrencySymbol } from '../utils/currency';

const DURATIONS = [
  { label: '30 Days', value: 30, desc: 'Short term' },
  { label: '60 Days', value: 60, desc: 'Medium term' },
  { label: '90 Days', value: 90, desc: 'Recommended' },
  { label: '180 Days', value: 180, desc: 'Long term' },
];

export default function CopyTradingSetup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trader = state?.trader;
  console.log("Received trader:", trader);

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(90);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trader) { navigate('/dashboard/copy-trading'); return; }
    console.log("No trader data, redirecting...");
    getDashboard().then(data => {
      setBalance(data?.user?.balance || 0);
      setCurrency(data?.user?.currency || 'USD');
    }).catch(() => {});
  }, []);

  const riskColor = r => r <= 4 ? '#22c55e' : r <= 7 ? '#f59e0b' : '#ef4444';
  const riskLabel = r => r <= 4 ? 'Low' : r <= 7 ? 'Medium' : 'High';

  const estimatedProfit = amount && !isNaN(amount)
    ? ((Number(amount) * (trader?.winRate / 100) * (trader?.profitShare / 100) * duration) / 30).toFixed(2)
    : '0.00';

  const traderCommission = amount && !isNaN(amount)
    ? (Number(amount) * (trader?.profitShare / 100)).toFixed(2)
    : '0.00';

  const handleConfirm = async () => {
    setError('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < 10) { setError('Minimum investment is $10.'); return; }
    if (Number(amount) > balance) { setError('Insufficient balance. Please deposit funds.'); return; }
    if (!agreed) { setError('Please agree to the terms before proceeding.'); return; }
    setLoading(true);
    try {
      const res = await startCopyTrade({ traderId: trader._id, traderName: trader.name, traderImg: trader.img, amount: parseFloat(amount), profitShare: trader.profitShare, duration });
      setLoading(false);
      if (res.success) setSuccess(true);
      else setError(res.message || 'Something went wrong.');
    } catch { setLoading(false); setError('Something went wrong. Try again.'); }
  };

  if (!trader) return null;

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '72px', height: '72px', background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '2px solid rgba(34,197,94,0.3)' }}>
        <CheckCircle2 size={36} color="#22c55e" />
      </div>
      <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>Strategy Copied!</div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '4px' }}>You are now copying <span style={{ color: '#6366f1', fontWeight: '700' }}>{trader.name}</span></div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '4px' }}>Investment: <span style={{ color: '#22c55e', fontWeight: '700' }}>{getCurrencySymbol(currency)}{Number(amount).toFixed(2)}</span></div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '24px' }}>Duration: <span style={{ color: 'white', fontWeight: '700' }}>{duration} days</span></div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/dashboard/copy-trading')} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Back to Traders</button>
        <button onClick={() => navigate('/dashboard/my-copy-trades')} style={{ padding: '10px 20px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>My Copy Trades</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Copy Trading Setup" />
      <div style={{ padding: '14px' }}>

        {/* Trader Profile */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.5)', flexShrink: 0 }}>
              <img src={trader.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + trader.name + '&background=6366f1&color=fff'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{trader.name}</span>
                {trader.verified && (
                  <svg width="16" height="16" viewBox="0 0 100 100"><path d="M 50,3 L 57,13 L 68,7 L 71,19 L 83,17 L 82,29 L 93,32 L 87,43 L 97,50 L 87,57 L 93,68 L 82,71 L 83,83 L 71,82 L 68,93 L 57,87 L 50,97 L 43,87 L 32,93 L 29,82 L 17,83 L 18,71 L 7,68 L 13,57 L 3,50 L 13,43 L 7,32 L 18,29 L 17,17 L 29,18 L 32,7 L 43,13 Z" fill="#3b82f6"/><path d="M32 51l12 12 24-26" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                )}
                <span style={{ fontSize: '18px' }}>{trader.flag}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={8} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{trader.location}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <Users size={9} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{trader.followers} followers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <FlaskConical size={9} color={riskColor(trader.risk)} />
              <span style={{ fontSize: '8px', color: riskColor(trader.risk) }}>{riskLabel(trader.risk)} Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <Heart size={9} color="#ef4444" fill="#ef4444" />
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{trader.favorite}</span>
            </div>
          </div>

          {/* Complete Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { label: 'Total Trades', value: trader.totalTrades, color: 'white' },
              { label: 'Total Loss', value: trader.totalLoss, color: '#ef4444' },
              { label: 'Win Rate', value: trader.winRate + '%', color: '#22c55e' },
              { label: 'Profit Share', value: trader.profitShare + '%', color: '#f59e0b' },
              { label: 'Risk Score', value: trader.risk + '/10', color: riskColor(trader.risk) },
              { label: 'ROI (Est.)', value: ((trader.winRate / 100) * trader.profitShare).toFixed(1) + '%', color: '#6366f1' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trader Bio */}
        {trader.bio && (
          <div style={{ background: "#1a2e4a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <TrendingUp size={12} color="#6366f1" /> About {trader.name}
            </div>
            <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5", textAlign: "justify" }}>
              {trader.bio}
            </div>
          </div>
        )}

        {/* Duration Selector */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} color="#6366f1" /> Select Duration
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {DURATIONS.map(d => (
              <button key={d.value} onClick={() => setDuration(d.value)} style={{ padding: '10px', background: duration === d.value ? 'rgba(99,102,241,0.2)' : '#0e1628', border: duration === d.value ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: duration === d.value ? '#6366f1' : 'white', marginBottom: '2px' }}>{d.label}</div>
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Investment Amount */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Investment Amount</span>
            <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: '600' }}>Balance: {formatAmountWithCode(balance, currency)}</span>
          </div>
          <div style={{ position: 'relative', marginBottom: '4px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>$</span>
            <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} placeholder="0.00" style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', fontWeight: '700', padding: '12px 12px 12px 26px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          {amount && Number(amount) > 0 && currency !== 'USD' && (
            <div style={{ fontSize: '8px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>≈</span>
              <span style={{ fontWeight: '700' }}>{formatAmountWithCode(Number(amount), currency)}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>in your local currency</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[25, 50, 100, 250].map(v => (
              <button key={v} onClick={() => setAmount(String(v))} style={{ flex: 1, padding: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '8px', cursor: 'pointer', borderRadius: '6px' }}>${v}</button>
            ))}
          </div>
        </div>

        {/* Investment Summary */}
        {amount && Number(amount) > 0 && (
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={12} color="#6366f1" /> Investment Summary
            </div>
            {[
              { label: 'Investment Amount', value: '$' + Number(amount).toFixed(2) + (currency !== 'USD' ? ' (' + formatAmountWithCode(Number(amount), currency) + ')' : ''), color: 'white' },
              { label: 'Duration', value: duration + ' days', color: 'white' },
              { label: 'Trader Commission', value: '$' + traderCommission + (currency !== 'USD' ? ' (' + formatAmountWithCode(Number(traderCommission), currency) + ')' : ''), color: '#f59e0b' },
              { label: 'Est. Profit (if wins)', value: '$' + estimatedProfit + (currency !== 'USD' ? ' (' + formatAmountWithCode(Number(estimatedProfit), currency) + ')' : ''), color: '#22c55e' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: s.color }}>{s.value}</span>
              </div>
            ))}
            <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>* Estimated profit is not guaranteed. Past performance does not guarantee future results.</div>
          </div>
        )}

        {/* Terms */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px' }}>
          <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px', accentColor: '#6366f1' }} />
          <label htmlFor="agree" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', cursor: 'pointer' }}>
            I understand the risks of copy trading and agree to the <span style={{ color: '#6366f1' }}>{trader.profitShare}% profit share</span> terms with <span style={{ color: '#6366f1' }}>{trader.name}</span>. I accept that both profits and losses will be mirrored.
          </label>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '9px', color: '#ef4444', marginBottom: '12px' }}>{error}</div>}

        <button onClick={handleConfirm} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
          {loading ? 'Processing...' : '🚀 Start Copying ' + trader.name}
        </button>
        <button onClick={() => navigate(-1)} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '9px', cursor: 'pointer', borderRadius: '10px' }}>
          Cancel
        </button>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px' }}>2020-2026 © Quantyrex Markets</div>
      </div>
    </div>
  );
}
