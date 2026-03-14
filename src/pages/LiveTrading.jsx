import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { getTrades, createTrade } from '../services/api';

const SYMBOLS = [
  { label: 'BTC/USD', tv: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USD', tv: 'BINANCE:ETHUSDT' },
  { label: 'XRP/USD', tv: 'BINANCE:XRPUSDT' },
  { label: 'SOL/USD', tv: 'BINANCE:SOLUSDT' },
  { label: 'BNB/USD', tv: 'BINANCE:BNBUSDT' },
  { label: 'ADA/USD', tv: 'BINANCE:ADAUSDT' },
];

const DURATIONS = ['30 seconds','1 minute','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 hour'];

export default function LiveTrading() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [direction, setDirection] = useState('buy');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('5 min');
  const [leverage, setLeverage] = useState('1x');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('open');
  const [showSheet, setShowSheet] = useState(false);
  const [sheetDir, setSheetDir] = useState('buy');
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [page, setPage] = useState(1);
  const chartRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: symbol.tv, interval: '15', timezone: 'Etc/UTC',
      theme: 'dark', style: '1', locale: 'en', backgroundColor: '#0a0f1e',
      hide_top_toolbar: false, save_image: false,
    });
    chartRef.current.appendChild(script);
  }, [symbol]);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://vertextrades.onrender.com/api/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBalance(data.user?.balance ?? data.balance ?? 0);
    } catch {}
    try {
      const data = await getTrades();
      setTrades(Array.isArray(data) ? data : (data.trades || []));
    } catch {}
    try {
      const token = localStorage.getItem('token');
      const sres = await fetch('https://vertextrades.onrender.com/api/trade/stats', { headers: { Authorization: `Bearer ${token}` } });
      const sdata = await sres.json();
      setStats(sdata);
    } catch {}
  };

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (parseFloat(amount) < 10) { setError('Minimum trade amount is $10'); return; }
    if (balance !== null && parseFloat(amount) > parseFloat(balance)) { setError(`Insufficient balance. Your balance is $${parseFloat(balance).toFixed(2)}`); return; }
    setSubmitting(true); setError(''); setMsg('');
    try {
      const res = await createTrade({ symbol: symbol.label, type: sheetDir, direction: sheetDir, account: 'real', amount: parseFloat(amount), duration, leverage });
      console.log('Trade response:', res);
      setMsg('Trade placed successfully!');
      setAmount('');
      setTimeout(() => {
        setShowSheet(false);
        setMsg('');
        fetchAll();
      }, 1500);
    } catch (e) {
      console.error('Trade error:', e);
      setError(e.message || 'Failed to place trade');
    }
    setSubmitting(false);
  };

  const openTrades = trades.filter(t => t.status === 'pending' || t.status === 'active');
  const closedTrades = trades.filter(t => t.status === 'closed' || t.status === 'cancelled');

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Segoe UI', sans-serif", color: 'white', display: 'flex', flexDirection: 'column', paddingBottom: '52px' }}>
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Top Nav */}
        <div style={{ background: '#0d1426', borderBottom: '1px solid rgba(99,102,241,0.2)', padding: '0 12px', display: 'flex', alignItems: 'center', height: '44px', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '16px', height: '16px', flexShrink: 0 }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
          </button>
          <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: '700' }}>${balance !== null ? parseFloat(balance).toFixed(2) : '...'}</span>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: '#0d1426', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'white', fontSize: '11px', fontWeight: '800' }}>{symbol.label}</span>
            <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '7px', padding: '2px 6px', fontWeight: '700' }}>LIVE</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }} />
          </div>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {SYMBOLS.map(s => (
              <button key={s.label} onClick={() => setSymbol(s)} style={{ background: symbol.label === s.label ? 'rgba(99,102,241,0.2)' : 'transparent', border: symbol.label === s.label ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)', color: symbol.label === s.label ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: '700', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{s.label}</button>
            ))}
          </div>
        </div>
        <div style={{ height: '500px', width: '100%', flexShrink: 0, position: 'relative' }}><div className='tradingview-widget-container' ref={chartRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /></div>

        {/* Stats Bar */}
        {stats && (
          <div style={{ background: '#0d1426', borderTop: '1px solid rgba(99,102,241,0.15)', padding: '8px 12px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', flexShrink: 0 }}>
            {[
              { label: 'Total Trades', value: stats.totalTrades ?? 0, color: 'white' },
              { label: 'Wins', value: stats.wins ?? 0, color: '#22c55e' },
              { label: 'Losses', value: stats.losses ?? 0, color: '#ef4444' },
              { label: 'Net P&L', value: formatAmount(parseFloat(stats.netProfitLoss ?? 0), user?.currency), color: parseFloat(stats.netProfitLoss) >= 0 ? '#22c55e' : '#ef4444' },
              { label: 'ROI', value: `${parseFloat(stats.roi ?? 0).toFixed(1)}%`, color: parseFloat(stats.roi) >= 0 ? '#22c55e' : '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '6px', marginBottom: '3px', whiteSpace: 'nowrap' }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: '10px', fontWeight: '800' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Orders Table */}
        <div style={{ background: '#0d1426', borderTop: '1px solid rgba(99,102,241,0.15)', flexShrink: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {[['open', `Open (${openTrades.length})`], ['closed', `Closed (${closedTrades.length})`]].map(([key, label]) => (
              <button key={key} onClick={() => { setTab(key); setPage(1); }} style={{ padding: '7px 14px', background: 'transparent', border: 'none', borderBottom: tab === key ? '2px solid #6366f1' : '2px solid transparent', color: tab === key ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>{label}</button>
            ))}
          </div>
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
                <select value={show} onChange={e => setShow(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
              </div>
            </div>
            {tab === 'open' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Symbol','Dir','Amount','Duration','Leverage','Status','Action'].map((h,i) => (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 6px', display: 'block' }}>{h}</span>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Symbol','Dir','Amount','Result','P&L %','Status'].map((h,i) => (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 6px', display: 'block' }}>{h}</span>
                ))}
              </div>
            )}
            {(() => {
              const list = (tab === 'open' ? openTrades : closedTrades).filter(t => !search || t.symbol?.toLowerCase().includes(search.toLowerCase()) || t.type?.toLowerCase().includes(search.toLowerCase()));
              const totalPages = Math.max(1, Math.ceil(list.length / show));
              const paged = list.slice((page-1)*show, page*show);
              return (
                <>
                  {paged.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No {tab} trades</div>
                  ) : paged.map((t, i) => (
                    tab === 'open' ? (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '7px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{t.symbol}</span>
                        <span style={{ color: t.type === 'buy' ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700', textTransform: 'uppercase' }}>{t.type || '—'}</span>
                        <span style={{ color: 'white', fontSize: '8px' }}>${parseFloat(t.amount).toLocaleString()}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{t.duration}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{t.leverage}</span>
                        <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '7px', padding: '2px 6px', textTransform: 'uppercase', display: 'inline-block' }}>{t.status}</span>
                        <button onClick={() => fetchAll()} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '6px', padding: '3px 6px', cursor: 'pointer', fontWeight: '700' }}>Close</button>
                      </div>
                    ) : (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '7px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{t.symbol}</span>
                        <span style={{ color: t.type === 'buy' ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700', textTransform: 'uppercase' }}>{t.type || '—'}</span>
                        <span style={{ color: 'white', fontSize: '8px' }}>${parseFloat(t.amount).toLocaleString()}</span>
                        <span style={{ color: t.result > 0 ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700' }}>{t.result != null ? `${t.result > 0 ? '+' : ''}$${parseFloat(t.result).toFixed(2)}` : '—'}</span>
                        <span style={{ color: t.result > 0 ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700' }}>{t.amount ? `${((t.result / t.amount) * 100).toFixed(1)}%` : '—'}</span>
                        <span style={{ background: 'rgba(107,114,128,0.1)', color: '#9ca3af', fontSize: '7px', padding: '2px 6px', textTransform: 'capitalize', display: 'inline-block' }}>{t.status}</span>
                      </div>
                    )
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {list.length === 0 ? 0 : (page-1)*show+1} to {Math.min(page*show, list.length)} of {list.length} entries</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page === 1 ? 'default' : 'pointer' }}>«</button>
                      <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page === 1 ? 'default' : 'pointer' }}>‹</button>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page >= totalPages ? 'default' : 'pointer' }}>›</button>
                      <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page >= totalPages ? 'default' : 'pointer' }}>»</button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

      </div>

      {/* Trade Sheet */}
      {showSheet && (
        <div style={{ position: 'fixed', bottom: '52px', left: 0, right: 0, background: '#0d1426', borderTop: '2px solid rgba(99,102,241,0.4)', padding: '14px 16px', zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: sheetDir === 'buy' ? '#22c55e' : '#ef4444', fontSize: '11px', fontWeight: '800' }}>{sheetDir === 'buy' ? 'BUY' : 'SELL'} {symbol.label}</span>
            <button onClick={() => setShowSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Amount (USD)</div>
              <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='0.00' style={{ width: '100%', background: '#0a0f1e', border: `1px solid ${sheetDir === 'buy' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: 'white', fontSize: '10px', fontWeight: '700', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Duration</div>
              <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' }}>
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>Leverage</div>
              <select value={leverage} onChange={e => setLeverage(e.target.value)} style={{ width: '100%', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' }}>
                {['1x','2x','5x','10x','20x','50x','100x'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          {msg && <div style={{ color: '#22c55e', fontSize: '7px', marginBottom: '6px' }}>{msg}</div>}
          {error && <div style={{ color: '#ef4444', fontSize: '7px', marginBottom: '6px' }}>{error}</div>}
          <button onClick={handleTrade} disabled={submitting} style={{ width: '100%', padding: '10px', background: sheetDir === 'buy' ? '#16a34a' : '#dc2626', border: 'none', color: 'white', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>
            {submitting ? 'Placing...' : `Confirm ${sheetDir === 'buy' ? 'Buy' : 'Sell'}`}
          </button>
        </div>
      )}

      {/* Fixed Bottom BUY/SELL */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', height: '52px', zIndex: 99 }}>
        <button onClick={() => { setSheetDir('buy'); setDirection('buy'); setShowSheet(true); }} style={{ flex: 1, background: '#16a34a', border: 'none', color: 'white', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>BUY</button>
        <button onClick={() => { setSheetDir('sell'); setDirection('sell'); setShowSheet(true); }} style={{ flex: 1, background: '#dc2626', border: 'none', color: 'white', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>SELL</button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </>
  );
}
