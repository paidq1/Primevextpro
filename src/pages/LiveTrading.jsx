import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { createTrade, getTrades } from '../services/api';

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
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => { fetchTrades(); }, []);

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
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await createTrade({
        account, market, symbol,
        type: type.toLowerCase(),
        amount: parseFloat(amount),
        leverage, duration,
      });
      if (res.trade) {
        setTradeType(type);
        setShowSuccess(true);
        setShowModal(false);
        setTrades(prev => [res.trade, ...prev]);
        setPage(1);
        setAmount('');
        setAccount('---');
        setMarket('---');
        setDuration('---');
        setLeverage('2x');
      } else {
        setError(res.message || 'Failed to place trade.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(trades.length / perPage);
  const paginated = trades.slice((page - 1) * perPage, page * perPage);

  const statusStyle = (status) => {
    switch (status) {
      case 'active':    return { background: 'rgba(34,197,94,0.15)',   color: '#22c55e' };
      case 'closed':    return { background: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
      case 'cancelled': return { background: 'rgba(239,68,68,0.15)',   color: '#ef4444' };
      default:          return { background: 'rgba(99,102,241,0.2)',   color: '#818cf8' };
    }
  };

  const sel = {
    width: '100%', background: '#1e2538',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white', fontSize: '9px',
    padding: '8px 10px', outline: 'none',
    boxSizing: 'border-box',
  };

  const fieldError = (val) => !val || val === '---'
    ? { border: '1px solid rgba(239,68,68,0.4)' }
    : {};

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ Live Trading</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Trading</span>
          <button onClick={() => { setShowModal(true); setError(''); }} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '7px 14px', cursor: 'pointer' }}>
            + New Trade
          </button>
        </div>

        <div style={{ background: '#252d3d' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Symbol','Duration','Type','Amount','Status','Date'].map((h, i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', fontWeight: '700', padding: '8px 6px', borderRight: '1px solid #6366f1', borderBottom: '1px solid rgba(99,102,241,0.4)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>Loading trades...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No trades yet. Click "+ New Trade" to get started.</td></tr>
              ) : (
                paginated.map((t, i) => (
                  <tr key={t._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '7px 6px', color: 'white', fontSize: '8px', fontWeight: '700' }}>{t.symbol}</td>
                    <td style={{ padding: '7px 6px', color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{t.duration}</td>
                    <td style={{ padding: '7px 6px' }}>
                      <span style={{ color: t.type === 'buy' ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700', textTransform: 'capitalize' }}>{t.type}</span>
                    </td>
                    <td style={{ padding: '7px 6px', color: 'rgba(255,255,255,0.7)', fontSize: '7px' }}>${parseFloat(t.amount).toFixed(2)}</td>
                    <td style={{ padding: '7px 6px' }}>
                      <span style={{ ...statusStyle(t.status), fontSize: '7px', padding: '2px 6px', fontWeight: '600', textTransform: 'capitalize' }}>{t.status}</span>
                    </td>
                    <td style={{ padding: '7px 6px', color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>
              Showing {trades.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, trades.length)} of {trades.length} trades
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page === 1 ? 'default' : 'pointer' }}>&#8249;</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page >= totalPages ? 'default' : 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#252d3d', border: '1px solid rgba(99,102,241,0.3)', padding: '18px', width: '300px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Trade Assets</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Account <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={account} onChange={e => { setAccount(e.target.value); setError(''); }} style={{ ...sel, ...fieldError(account) }}>
                <option value='---'>--- Select Account ---</option>
                <option value='real'>Real Account</option>
                <option value='demo'>Demo Account</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Markets <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={market} onChange={e => { setMarket(e.target.value); setError(''); }} style={{ ...sel, ...fieldError(market) }}>
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
              <select value={duration} onChange={e => { setDuration(e.target.value); setError(''); }} style={{ ...sel, ...fieldError(duration) }}>
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
              <input
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                placeholder='Min $10 — Max $100,000'
                type='number'
                min='10'
                max='100000'
                style={{ ...sel, border: (!amount || Number(amount) < 10) && amount !== '' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }}
              />
              {amount && Number(amount) < 10 && (
                <span style={{ color: '#ef4444', fontSize: '7px' }}>Minimum is $10.00</span>
              )}
              {amount && Number(amount) > 100000 && (
                <span style={{ color: '#ef4444', fontSize: '7px' }}>Maximum is $100,000</span>
              )}
            </div>

            {error ? (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 10px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ef4444', fontSize: '12px' }}>⚠</span>
                <span style={{ color: '#ef4444', fontSize: '8px' }}>{error}</span>
              </div>
            ) : (
              <div style={{ marginBottom: '10px' }} />
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleTrade('buy')} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#374151' : '#22c55e', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {submitting ? 'Placing...' : '▲ Buy'}
              </button>
              <button onClick={() => handleTrade('sell')} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#374151' : '#ef4444', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {submitting ? 'Placing...' : '▼ Sell'}
              </button>
            </div>
          </div>
        </>
      )}

      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Placed!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>
              {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} order for {symbol} submitted successfully.
            </div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </div>
  );
}
