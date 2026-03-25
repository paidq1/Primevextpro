import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Users, FlaskConical, Heart, CheckCircle2, AlertTriangle, TrendingUp, Percent, Shield } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import { formatAmountWithCode, getCurrencySymbol } from '../utils/currency';

export default function CopyTradingSetup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trader = state?.trader;

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trader) { navigate('/dashboard/copy-trading'); return; }
    getDashboard().then(data => {
      setBalance(data?.user?.balance || 0);
      setCurrency(data?.user?.currency || 'USD');
    }).catch(() => {});
  }, []);

  const riskColor = r => r <= 4 ? '#22c55e' : r <= 7 ? '#f59e0b' : '#ef4444';
  const riskLabel = r => r <= 4 ? 'Low' : r <= 7 ? 'Medium' : 'High';

  const handleConfirm = async () => {
    setError('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < 10) { setError('Minimum investment is $10.'); return; }
    if (Number(amount) > balance) { setError('Insufficient balance. Please deposit funds.'); return; }
    if (!agreed) { setError('Please agree to the terms before proceeding.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  if (!trader) return null;

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <CheckCircle2 size={32} color="#22c55e" />
      </div>
      <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Strategy Copied!</div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '4px' }}>You are now copying <span style={{ color: '#6366f1', fontWeight: '700' }}>{trader.name}</span></div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '24px' }}>Investment: <span style={{ color: '#22c55e', fontWeight: '700' }}>{getCurrencySymbol(currency)}{Number(amount).toFixed(2)}</span></div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/dashboard/copy-trading')} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Back to Traders</button>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Copy Trading Setup" />
      <div style={{ padding: '14px' }}>
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.5)', flexShrink: 0 }}>
              <img src={trader.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + trader.name + '&background=6366f1&color=fff'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{trader.name}</span>
                {trader.verified && (
                  <svg width="16" height="16" viewBox="0 0 100 100"><path d="M 50,3 L 57,13 L 68,7 L 71,19 L 83,17 L 82,29 L 93,32 L 87,43 L 97,50 L 87,57 L 93,68 L 82,71 L 83,83 L 71,82 L 68,93 L 57,87 L 50,97 L 43,87 L 32,93 L 29,82 L 17,83 L 18,71 L 7,68 L 13,57 L 3,50 L 13,43 L 7,32 L 18,29 L 17,17 L 29,18 L 32,7 L 43,13 Z" fill="#3b82f6"/><path d="M32 51l12 12 24-26" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                )}
                <span style={{ fontSize: '16px' }}>{trader.flag}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={8} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{trader.location}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <Users size={9} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{trader.followers} followers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <FlaskConical size={9} color={riskColor(trader.risk)} />
              <span style={{ fontSize: '8px', color: riskColor(trader.risk) }}>{riskLabel(trader.risk)} Risk ({trader.risk})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
              <Heart size={9} color="#ef4444" fill="#ef4444" />
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{trader.favorite}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[{ label: 'Total trades', value: trader.totalTrades, color: 'white' }, { label: 'Total loss', value: trader.totalLoss, color: '#ef4444' }, { label: 'Profit share', value: trader.profitShare + '%', color: '#22c55e' }, { label: 'Win rate', value: trader.winRate + '%', color: '#22c55e' }].map((s, i) => (
              <div key={i} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={12} color="#6366f1" /> Terms & Conditions
          </div>
          {[
            { icon: <Percent size={10} color="#22c55e" />, text: 'Profit share: ' + trader.profitShare + '% of profits go to ' + trader.name },
            { icon: <TrendingUp size={10} color="#f59e0b" />, text: 'Your trades mirror the trader proportionally to your investment.' },
            { icon: <AlertTriangle size={10} color="#ef4444" />, text: 'You share in both profits and losses. Past performance is not a guarantee.' },
            { icon: <Shield size={10} color="#6366f1" />, text: 'You can stop copying and withdraw your funds at any time.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <div style={{ marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Available Balance</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e' }}>{formatAmountWithCode(balance, currency)}</span>
          </div>
          <label style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Investment Amount (min $10)</label>
          <input
            type="number"
            value={amount}
            onChange={e => { setAmount(e.target.value); setError(''); }}
            placeholder="Enter amount"
            style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '10px 12px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box' }}
          />
          {amount && Number(amount) > 0 && (
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              Trader commission: <span style={{ color: '#f59e0b' }}>{getCurrencySymbol(currency)}{(Number(amount) * trader.profitShare / 100).toFixed(2)}</span> per profitable cycle
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px' }}>
          <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px', accentColor: '#6366f1' }} />
          <label htmlFor="agree" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', cursor: 'pointer' }}>
            I understand the risks involved in copy trading and agree to the profit sharing terms with <span style={{ color: '#6366f1' }}>{trader.name}</span>.
          </label>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '9px', color: '#ef4444', marginBottom: '12px' }}>{error}</div>}

        <button onClick={handleConfirm} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '10px', marginBottom: '10px' }}>
          {loading ? 'Processing...' : 'Confirm & Start Copying'}
        </button>
        <button onClick={() => navigate(-1)} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '9px', cursor: 'pointer', borderRadius: '10px' }}>
          Cancel
        </button>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px' }}>2020-2026 © VertexTrade Pro</div>
      </div>
    </div>
  );
}
