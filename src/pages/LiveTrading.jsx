import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { createTrade, getTrades, getTradeStats, getDashboard } from '../services/api';

const symbols = ['BTC/USD','ETH/USD','XRP/USD','SOL/USD','BNB/USD','ADA/USD','DOGE/USD','AVAX/USD','EUR/USD','GBP/USD','USD/JPY','AAPL','TSLA','NVDA','MSFT','AMZN'];
const markets = ['Crypto','Forex','Stocks','Commodities'];
const durations = ['30 seconds','1 minute','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 hour'];
const leverages = ['1x','2x','5x','10x','20x','50x','100x'];

export default function LiveTrading() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [account, setAccount] = useState('---');
  const [market, setMarket] = useState('---');
  const [symbol, setSymbol] = useState('BTC/USD');
  const [duration, setDuration] = useState('---');
  const [leverage, setLeverage] = useState('2x');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradeType, setTradeType] = useState('');
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingType, setSubmittingType] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState(null);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [livePrices, setLivePrices] = useState({});
  const perPage = 10;

  useEffect(() => { fetchTrades(); fetchStats(); fetchBalance(); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        trades.filter(t => t.status === 'active').forEach(t => {
          const base = prev[t._id] || t.openPrice || 100;
          const change = base * (Math.random() * 0.006 - 0.003);
          next[t._id] = parseFloat((base + change).toFixed(4));
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [trades]);

  useEffect(() => {
    const interval = setInterval(() => { fetchTrades(); fetchStats(); fetchBalance(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const data = await getTrades();
      if (Array.isArray(data)) setTrades(data);
    } catch (err) {
      console.error('Failed to load trades:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getTradeStats();
      if (data && data.totalTrades !== undefined) setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const fetchBalance = async () => {
    try {
      const data = await getDashboard();
      if (data && data.user) setBalance(data.user.balance);
    } catch (err) {
      console.error('Failed to load balance:', err);
    }
  };

  const validate = () => {
    if (account === '---') { setError('Please select an account.'); return false; }
    if (market === '---') { setError('Please select a market.'); return false; }
    if (!symbol) { setError('Please select a symbol.'); return false; }
    if (duration === '---') { setError('Please select a duration.'); return false; }
    if (!leverage) { setError('Please select a leverage.'); return false; }
    if (!amount || amount.toString().trim() === '') { setError('Please enter an amount.'); return false; }
    if (isNaN(amount)) { setError('Amount must be a number.'); return false; }
    if (Number(amount) <= 0) { setError('Amount must be greater than zero.'); return false; }
    if (Number(amount) < 10) { setError('Minimum trade amount is $10.00.'); return false; }
    if (Number(amount) > 100000) { setError('Maximum trade amount is $100,000.'); return false; }
    setError('');
    return true;
  };

  const handleTrade = async (type) => {
    if (submittingType !== null) return;
    if (!validate()) return;
    setSubmittingType(type);
    try {
      const res = await createTrade({
        account, market, symbol, type,
        amount: parseFloat(amount),
        leverage, duration,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      });
      if (res.trade) {
        setTradeType(type);
        setShowSuccess(true);
        setShowModal(false);
        setTrades(prev => [res.trade, ...prev]);
        fetchStats();
        setPage(1);
        setAmount('');
        setAccount('---');
        setMarket('---');
        setDuration('---');
        setLeverage('2x');
        setStopLoss('');
        setTakeProfit('');
        setError('');
      } else {
        setErrorMessage(res.message || 'Failed to place trade.');
        setShowError(true);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmittingType(null);
    }
  };

  const filtered = filter === 'all' ? trades : trades.filter(t => {
    if (filter === 'buy' || filter === 'sell') return t.type === filter;
    return t.status === filter;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const statusStyle = (status) => {
    switch (status) {
      case 'active':    return { background: 'rgba(34,197,94,0.15)',   color: '#22c55e' };
      case 'closed':    return { background: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
      case 'cancelled': return { background: 'rgba(239,68,68,0.15)',   color: '#ef4444' };
      default:          return { background: 'rgba(99,102,241,0.2)',   color: '#818cf8' };
    }
  };

  const sel = {
    width: '100%', background: '#0e1628',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white', fontSize: '9px',
    padding: '8px 10px', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '16px', height: '16px' }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/>
            </svg>
          </button>
          <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ Live Trading</span>
          <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
        </div>

        <div style={{ background: '#132035', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Available Balance</span>
          </div>
          <span style={{ color: balance !== null && balance < 50 ? '#ef4444' : '#22c55e', fontSize: '11px', fontWeight: '700' }}>
            {balance !== null ? `$${parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...'}
          </span>
        </div>

        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'white', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Live Trading
            </span>
            <button onClick={() => { setShowModal(true); setError(''); }} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '7px 14px', cursor: 'pointer' }}>+ New Trade</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
            {/* Total Trades */}
            <div style={{ background: '#1a2e4a', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '0px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '500' }}>Total Trades</span>
              </div>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: '700', lineHeight: 1 }}>{stats ? stats.totalTrades : '—'}</div>
              <div style={{ color: 'rgba(99,102,241,0.7)', fontSize: '7px', marginTop: '4px' }}>{stats ? `${stats.closedTrades} closed` : ''}</div>
            </div>

            {/* Win / Loss */}
            <div style={{ background: '#1a2e4a', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '0px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '500' }}>Win / Loss</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', lineHeight: 1 }}>
                <span style={{ color: '#22c55e' }}>{stats ? stats.wins : '—'}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}> / </span>
                <span style={{ color: '#ef4444' }}>{stats ? stats.losses : '—'}</span>
              </div>
              <div style={{ color: 'rgba(34,197,94,0.7)', fontSize: '7px', marginTop: '4px' }}>closed trades</div>
            </div>

            {/* Net P&L */}
            <div style={{ background: '#1a2e4a', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '0px', background: stats && parseFloat(stats.netProfitLoss)>=0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={stats && parseFloat(stats.netProfitLoss)>=0 ? '#22c55e' : '#ef4444'} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '500' }}>Net P&L</span>
              </div>
              <div style={{ color: stats && parseFloat(stats.netProfitLoss)>=0 ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: '700', lineHeight: 1 }}>
                {stats ? `${parseFloat(stats.netProfitLoss)>=0?'+':''}$${stats.netProfitLoss}` : '—'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginTop: '4px' }}>{stats ? `profit: $${stats.totalProfit}` : ''}</div>
            </div>

            {/* ROI */}
            <div style={{ background: '#1a2e4a', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '0px', background: stats && parseFloat(stats.roi)>=0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={stats && parseFloat(stats.roi)>=0 ? '#22c55e' : '#ef4444'} strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '500' }}>ROI</span>
              </div>
              <div style={{ color: stats && parseFloat(stats.roi)>=0 ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: '700', lineHeight: 1 }}>
                {stats ? `${parseFloat(stats.roi)>=0?'+':''}${stats.roi}%` : '—'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginTop: '4px' }}>return on investment</div>
            </div>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['all','buy','sell','active','closed'].map(f => (
                  <button key={f} onClick={() => { setFilter(f); setPage(1); }} style={{ padding: '3px 8px', background: filter===f?'#6366f1':'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                ))}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>{filtered.length} trades</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.6fr 0.8fr 0.8fr 0.8fr 0.7fr 0.8fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Symbol','Duration','Type','Amount','Live P&L','Result','Status','Date'].map((h, i) => (
                <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '700', borderRight: '1px solid rgba(99,102,241,0.4)', borderBottom: '1px solid rgba(99,102,241,0.4)', padding: '7px 6px', display: 'block' }}>{h}</span>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '28px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
            ) : paginated.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No trades yet. Click "+ New Trade" to get started.</div>
            ) : paginated.map((t, i) => (
              <div key={t._id || i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.6fr 0.8fr 0.8fr 0.8fr 0.7fr 0.8fr', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                <span style={{ color: 'white', fontSize: '8px', fontWeight: '700', padding: '0 6px' }}>{t.symbol}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', padding: '0 6px' }}>{t.duration}</span>
                <span style={{ color: t.type==='buy'?'#22c55e':'#ef4444', fontSize: '8px', fontWeight: '700', textTransform: 'capitalize', padding: '0 6px' }}>{t.type}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', padding: '0 6px' }}>${parseFloat(t.amount).toFixed(2)}</span>
                <span style={{ padding: '0 6px' }}>
                  {t.status==='active' ? (() => {
                    const livePrice = livePrices[t._id] || t.openPrice;
                    const priceDiff = livePrice - (t.openPrice || livePrice);
                    const pnl = t.type==='buy' ? priceDiff*(t.amount/(t.openPrice||1)) : -priceDiff*(t.amount/(t.openPrice||1));
                    return <span style={{ color: pnl>=0?'#22c55e':'#ef4444', fontSize: '8px', fontWeight: '700' }}>{pnl>=0?'+':''}${pnl.toFixed(2)}</span>;
                  })() : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>—</span>}
                </span>
                <span style={{ padding: '0 6px' }}>
                  {t.result!==0 ? <span style={{ color: t.result>0?'#22c55e':'#ef4444', fontSize: '8px', fontWeight: '700' }}>{t.result>0?'+':''}${Math.abs(t.result).toFixed(2)}</span> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>—</span>}
                </span>
                <span style={{ padding: '0 6px' }}>
                  <span style={{ ...statusStyle(t.status), fontSize: '7px', padding: '2px 6px', fontWeight: '600', textTransform: 'capitalize' }}>{t.status}</span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', padding: '0 6px' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length===0?0:(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length} trades</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button onClick={() => setPage(1)} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page===1?'default':'pointer' }}>«</button>
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page===1?'default':'pointer' }}>‹</button>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages||1}</span>
                <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page>=totalPages?'default':'pointer' }}>›</button>
                <button onClick={() => setPage(totalPages)} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page>=totalPages?'default':'pointer' }}>»</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div onClick={() => { setShowModal(false); setError(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '18px', width: '300px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Trade Assets</span>
              <button onClick={() => { setShowModal(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px' }}>×</button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Account <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={account} onChange={e => { setAccount(e.target.value); setError(''); }} style={{ ...sel, border: account==='---'&&error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                <option value='---'>--- Select Account ---</option>
                <option value='real'>Real Account</option>
                <option value='demo'>Demo Account</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Markets <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={market} onChange={e => { setMarket(e.target.value); setError(''); }} style={{ ...sel, border: market==='---'&&error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                <option value='---'>--- Select Market ---</option>
                {markets.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Symbol <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={symbol} onChange={e => { setSymbol(e.target.value); setError(''); }} style={sel}>
                {symbols.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Duration <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={duration} onChange={e => { setDuration(e.target.value); setError(''); }} style={{ ...sel, border: duration==='---'&&error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                <option value='---'>--- Select Duration ---</option>
                {durations.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Leverage <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={leverage} onChange={e => { setLeverage(e.target.value); setError(''); }} style={sel}>
                {leverages.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Amount ($) <span style={{ color: '#ef4444' }}>*</span></label>
              <input value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} placeholder='Min $10 — Max $100,000' type='number' min='10' max='100000'
                style={{ ...sel, border: amount&&(Number(amount)<10||Number(amount)>100000) ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }} />
              {amount && Number(amount) < 10 && <span style={{ color: '#ef4444', fontSize: '7px' }}>Minimum is $10.00</span>}
              {amount && Number(amount) > 100000 && <span style={{ color: '#ef4444', fontSize: '7px' }}>Maximum is $100,000</span>}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Stop Loss ($)</label>
                <input value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder='Optional' type='number' style={sel} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Take Profit ($)</label>
                <input value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder='Optional' type='number' style={sel} />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 10px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span style={{ color: '#ef4444', fontSize: '8px' }}>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: error ? '0' : '10px' }}>
              <button onClick={() => handleTrade('buy')} disabled={submittingType !== null}
                style={{ flex: 1, padding: '10px', background: submittingType==='buy'?'#15803d':submittingType==='sell'?'#374151':'#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: submittingType!==null?'not-allowed':'pointer', opacity: submittingType==='sell'?0.5:1 }}>
                {submittingType === 'buy' ? 'Placing...' : '▲ Buy'}
              </button>
              <button onClick={() => handleTrade('sell')} disabled={submittingType !== null}
                style={{ flex: 1, padding: '10px', background: submittingType==='sell'?'#b91c1c':submittingType==='buy'?'#374151':'#ef4444', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: submittingType!==null?'not-allowed':'pointer', opacity: submittingType==='buy'?0.5:1 }}>
                {submittingType === 'sell' ? 'Placing...' : '▼ Sell'}
              </button>
            </div>
          </div>
        </>
      )}

      {showError && (
        <>
          <div onClick={() => setShowError(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2.5'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Failed</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>{errorMessage}</div>
            <button onClick={() => setShowError(false)} style={{ padding: '8px 28px', background: '#ef4444', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}

      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${tradeType==='buy'?'#22c55e':'#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke={tradeType==='buy'?'#22c55e':'#ef4444'} strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Placed!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>
              <span style={{ color: tradeType==='buy'?'#22c55e':'#ef4444', fontWeight: '700', textTransform: 'capitalize' }}>{tradeType}</span> order for <strong>{symbol}</strong> submitted successfully.
            </div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </>
  );
}