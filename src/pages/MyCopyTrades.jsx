import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getCopyTrades, stopCopyTrade } from '../services/api';
import { formatAmountWithCode } from '../utils/currency';
import { getDashboard } from '../services/api';

const MOCK_TRADES = [
  { _id: '1', traderName: 'Ross Cameron', traderImg: 'https://ui-avatars.com/api/?name=Ross+Cameron&background=6366f1&color=fff&size=96', amount: 500, totalEarned: 87.50, profitShare: 20.5, status: 'active', createdAt: '2026-02-10T00:00:00Z' },
  { _id: '2', traderName: 'Rayner Teo', traderImg: 'https://ui-avatars.com/api/?name=Rayner+Teo&background=22c55e&color=fff&size=96', amount: 300, totalEarned: 54.60, profitShare: 18.0, status: 'active', createdAt: '2026-02-20T00:00:00Z' },
  { _id: '3', traderName: 'Kathy Lien', traderImg: 'https://ui-avatars.com/api/?name=Kathy+Lien&background=ec4899&color=fff&size=96', amount: 200, totalEarned: -12.40, profitShare: 15.2, status: 'active', createdAt: '2026-03-01T00:00:00Z' },
  { _id: '4', traderName: 'Anton Kreil', traderImg: 'https://ui-avatars.com/api/?name=Anton+Kreil&background=3b82f6&color=fff&size=96', amount: 400, totalEarned: 96.00, profitShare: 12.5, status: 'stopped', createdAt: '2026-01-15T00:00:00Z' },
  { _id: '5', traderName: 'Nial Fuller', traderImg: 'https://ui-avatars.com/api/?name=Nial+Fuller&background=8b5cf6&color=fff&size=96', amount: 150, totalEarned: 22.80, profitShare: 22.3, status: 'stopped', createdAt: '2026-01-05T00:00:00Z' },
];

export default function MyCopyTrades() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [show, setShow] = useState(10);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => { 
    fetchCopyTrades(); 
    getDashboard().then(data => {
      setCurrency(data?.user?.currency || 'USD');
    }).catch(() => {});
  }, []);

  const fetchCopyTrades = async () => {
    try {
      const res = await fetch('https://quantyrexs.onrender.com/api/copy-trade', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCopyTrades(Array.isArray(data) && data.length > 0 ? data : MOCK_TRADES);
    } catch { setCopyTrades(MOCK_TRADES); }
    finally { setLoading(false); }
  };

  const handleStop = async () => {
    if (!selectedTrade) return;
    try {
      await fetch(`https://quantyrexs.onrender.com/api/copy-trade/${selectedTrade._id}/stop`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      setCopyTrades(prev => prev.map(t => t._id === selectedTrade._id ? { ...t, status: 'stopped' } : t));
    } catch {}
    setShowStopModal(false);
    setSelectedTrade(null);
  };

  const totalInvested = copyTrades.reduce((s, t) => s + (t.amount || 0), 0);
  const totalReturns = copyTrades.reduce((s, t) => s + (t.totalEarned || 0), 0);
  const activeCount = copyTrades.filter(t => t.status === 'active').length;
  const stoppedCount = copyTrades.filter(t => t.status === 'stopped').length;

  const filtered = copyTrades.filter(t => t.traderName?.toLowerCase().includes(search.toLowerCase()) || t.status?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / show));
  const paginated = filtered.slice((page - 1) * show, page * show);

  const statusColor = s => s === 'active' ? '#22c55e' : s === 'stopped' ? '#ef4444' : '#f59e0b';

  const statCard = (icon, label, value, color) => (
    <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '8px', flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: '0 4px 24px rgba(99,102,241,0.1)' }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '7px' }}>{label}</div>
      <div style={{ color, fontSize: '10px', fontWeight: '700' }}>{value}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="My Copy Trades" />
      <div style={{ padding: '16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>My Copy Trades</span>
          <button onClick={() => navigate('/dashboard/copy-trading')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', padding: '6px 12px', cursor: 'pointer' }}>+ Copy Trader</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {statCard(<TrendingUp size={12} color='#6366f1'/>, 'Total Invested', formatAmountWithCode(totalInvested, currency), '#6366f1')}
          {statCard(<DollarSign size={12} color='#22c55e'/>, 'Total Returns', formatAmountWithCode(Math.abs(totalReturns), currency), totalReturns >= 0 ? '#22c55e' : '#ef4444')}
          {statCard(<Clock size={12} color='#f59e0b'/>, 'Active', String(activeCount), '#f59e0b')}
          {statCard(<CheckCircle size={12} color='#94a3b8'/>, 'Stopped', String(stoppedCount), '#94a3b8')}
        </div>


        {/* Active Trades */}
        {copyTrades.filter(t => t.status === 'active').length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: "10px" }}>
        <div style={{ marginBottom: "24px" }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: '9px', fontWeight: '700', color: '#6366f1' }}>ACTIVE COPY TRADES</span>
            </div>
            {copyTrades.filter(t => t.status === 'active').map(trade => {
              const roi = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100) : 0;
              const isProfit = (trade.totalEarned || 0) >= 0;
              const progress = Math.min(Math.abs(roi), 100);
              return (
                <div key={trade._id} style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={trade.traderImg || `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff&size=96`} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.5)' }} onError={e => e.target.src = `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff`} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #1a2e4a' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700' }}>{trade.traderName}</div>
                      <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{trade.profitShare}% profit share • Since {new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <button onClick={() => { setSelectedTrade(trade); setShowStopModal(true); }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '6px 10px', borderRadius: '6px', color: '#ef4444', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>✕ Stop</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
                    {[{ label: 'Invested', value: formatAmountWithCode(trade.amount, currency), color: 'white' }, { label: 'Earned', value: (isProfit ? '+' : '-') + formatAmountWithCode(Math.abs(trade.totalEarned || 0), currency), color: isProfit ? '#22c55e' : '#ef4444' }, { label: 'ROI', value: (isProfit ? '+' : '') + roi.toFixed(2) + '%', color: isProfit ? '#22c55e' : '#ef4444' }].map((s, i) => (
                      <div key={i} style={{ background: '#0e1628', borderRadius: '8px', padding: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{s.label}</div>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Profit Progress</span><span style={{ color: isProfit ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{roi.toFixed(2)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: progress + '%', height: '100%', background: isProfit ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #b91c1c, #ef4444)', borderRadius: '10px' }} />
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div style={{ marginTop: "28px" }} />
        {/* Table */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
              <select value={show} onChange={e => { setShow(Number(e.target.value)); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
            </div>
          </div>

          {/* Table Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Trader', 'Invested', 'Earned', 'ROI', 'Start Date', 'Status'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No copy trades found</div>
          ) : paginated.map((trade, i) => {
            const roi = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100).toFixed(2) : '0.00';
            const isProfit = (trade.totalEarned || 0) >= 0;
            return (
              <div key={trade._id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={trade.traderImg || `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff&size=64`}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 }}
                    onError={e => e.target.src = `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff`} />
                  <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{trade.traderName}</span>
                </div>
                <span style={{ color: 'white', fontSize: '8px' }}>${trade.amount.toFixed(2)}</span>
                <span style={{ color: isProfit ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '600' }}>{isProfit ? '+' : ''}${(trade.totalEarned || 0).toFixed(2)}</span>
                <span style={{ color: isProfit ? '#22c55e' : '#ef4444', fontSize: '8px', fontWeight: '600' }}>{roi}%</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{new Date(trade.createdAt).toLocaleDateString()}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: statusColor(trade.status) + '20', color: statusColor(trade.status), fontSize: '7px', padding: '2px 6px', textTransform: 'capitalize', display: 'inline-block' }}>{trade.status}</span>
                  {trade.status === 'active' && (
                    <button onClick={() => { setSelectedTrade(trade); setShowStopModal(true); }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '7px', padding: '2px 6px', cursor: 'pointer' }}>Stop</button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length === 0 ? 0 : (page-1)*show+1} to {Math.min(page*show, filtered.length)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[['«', () => setPage(1), page===1], ['‹', () => setPage(p=>Math.max(1,p-1)), page===1]].map(([l,a,d],i) => (
                <button key={i} onClick={a} disabled={d} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: d?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: d?'default':'pointer' }}>{l}</button>
              ))}
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages}</span>
              {[['›', () => setPage(p=>Math.min(totalPages,p+1)), page>=totalPages], ['»', () => setPage(totalPages), page>=totalPages]].map(([l,a,d],i) => (
                <button key={i} onClick={a} disabled={d} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: d?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: d?'default':'pointer' }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
      </div>

      {/* Stop Modal */}
      {showStopModal && selectedTrade && (
        <div onClick={() => setShowStopModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a2e4a', borderRadius: '12px', padding: '20px', width: '85%', maxWidth: '300px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', marginBottom: '10px' }}>Stop Copy Trading</h3>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Stop copying <strong>{selectedTrade.traderName}</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowStopModal(false)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleStop} style={{ flex: 1, padding: '8px', background: '#ef4444', border: 'none', borderRadius: '6px', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
