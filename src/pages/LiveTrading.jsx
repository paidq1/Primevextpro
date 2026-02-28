import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const symbols = ['BTC/USD','ETH/USD','XRP/USD','SOL/USD','BNB/USD','ADA/USD','DOGE/USD','AVAX/USD','EUR/USD','GBP/USD','USD/JPY','AAPL','TSLA','NVDA','MSFT','AMZN'];
const markets = ['Crypto','Forex','Stocks','Commodities'];
const durations = ['30 seconds','1 minute','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 hour'];
const leverages = ['1x','2x','5x','10x','20x','50x','100x'];

export default function LiveTrading() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [market, setMarket] = useState('---');
  const [symbol, setSymbol] = useState('BTC/USD');
  const [duration, setDuration] = useState('---');
  const [leverage, setLeverage] = useState('2x');
  const [amount, setAmount] = useState('100.00');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradeType, setTradeType] = useState('');
  const [trades, setTrades] = useState([]);

  const validate = () => {
    if (market === '---') { setError('Please select a market.'); return false; }
    if (duration === '---') { setError('Please select a duration.'); return false; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return false; }
    if (Number(amount) < 10) { setError('Minimum trade amount is $10.00'); return false; }
    setError('');
    return true;
  };

  const handleTrade = (type) => {
    if (!validate()) return;
    setTradeType(type);
    setShowSuccess(true);
    setShowModal(false);
    setTrades(prev => [{
      id: prev.length + 1,
      symbol,
      type,
      amount,
      leverage,
      duration,
      result: '---',
      status: 'Pending',
      date: new Date().toLocaleString(),
    }, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ Live Trading</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '14px 16px' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Trading</span>
          <button onClick={() => setShowModal(true)} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '7px 14px', cursor: 'pointer' }}>+ New Trade</button>
        </div>

        {/* Table */}
        <div style={{ background: '#252d3d' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Symbol','Duration','Type','Trade Result','Status'].map((h, i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', fontWeight: '700', padding: '8px 6px', borderRight: '1px solid #6366f1', borderBottom: '1px solid rgba(99,102,241,0.4)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</td>
                </tr>
              ) : (
                trades.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '7px 6px', color: 'white', fontSize: '8px', fontWeight: '700' }}>{t.symbol}</td>
                    <td style={{ padding: '7px 6px', color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{t.duration}</td>
                    <td style={{ padding: '7px 6px' }}>
                      <span style={{ color: t.type === 'Buy' ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '700' }}>{t.type}</span>
                    </td>
                    <td style={{ padding: '7px 6px', color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>{t.result}</td>
                    <td style={{ padding: '7px 6px' }}>
                      <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '7px', padding: '2px 6px', fontWeight: '600' }}>{t.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {trades.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#252d3d', border: '1px solid rgba(99,102,241,0.3)', padding: '18px', width: '300px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Trade Assets</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            {[
              { label: 'Account', content: <select style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '9px', padding: '8px 10px', outline: 'none' }}><option value='---'>---</option><option value='real'>Real Account</option><option value='demo'>Demo Account</option></select> },
              { label: 'Markets', content: <select value={market} onChange={e => setMarket(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none' }}><option>---</option>{markets.map(m => <option key={m}>{m}</option>)}</select> },
              { label: 'Symbol', content: <select value={symbol} onChange={e => setSymbol(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none' }}>{symbols.map(s => <option key={s}>{s}</option>)}</select> },
              { label: 'Duration', content: <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none' }}><option>---</option>{durations.map(d => <option key={d}>{d}</option>)}</select> },
              { label: 'Leverage', content: <select value={leverage} onChange={e => setLeverage(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none' }}>{leverages.map(l => <option key={l}>{l}</option>)}</select> },
              { label: 'Amount', content: <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='100.00' style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} /> },
            ].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>{label}</label>
                {content}
              </div>
            ))}

            <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleTrade('Buy')} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>Buy</button>
              <button onClick={() => handleTrade('Sell')} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>Sell</button>
            </div>
          </div>
        </>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${tradeType === 'Buy' ? '#6366f1' : '#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke={tradeType === 'Buy' ? '#6366f1' : '#ef4444'} strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Placed!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>{tradeType} order for {symbol} submitted successfully.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </div>
  );
}
