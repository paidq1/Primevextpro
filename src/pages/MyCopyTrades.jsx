import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, X, BarChart2, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const MOCK_TRADES = [
  { _id: '1', traderName: 'Ross Cameron', traderImg: 'https://ui-avatars.com/api/?name=Ross+Cameron&background=6366f1&color=fff&size=96', amount: 500, totalEarned: 87.50, profitShare: 20.5, status: 'active', createdAt: '2026-02-10T00:00:00Z', lastProfitAt: '2026-03-28T00:00:00Z' },
  { _id: '2', traderName: 'Rayner Teo', traderImg: 'https://ui-avatars.com/api/?name=Rayner+Teo&background=22c55e&color=fff&size=96', amount: 300, totalEarned: 54.60, profitShare: 18.0, status: 'active', createdAt: '2026-02-20T00:00:00Z', lastProfitAt: '2026-03-27T00:00:00Z' },
  { _id: '3', traderName: 'Kathy Lien', traderImg: 'https://ui-avatars.com/api/?name=Kathy+Lien&background=ec4899&color=fff&size=96', amount: 200, totalEarned: -12.40, profitShare: 15.2, status: 'active', createdAt: '2026-03-01T00:00:00Z', lastProfitAt: null },
  { _id: '4', traderName: 'Anton Kreil', traderImg: 'https://ui-avatars.com/api/?name=Anton+Kreil&background=3b82f6&color=fff&size=96', amount: 400, totalEarned: 96.00, profitShare: 12.5, status: 'stopped', createdAt: '2026-01-15T00:00:00Z', lastProfitAt: '2026-02-28T00:00:00Z' },
  { _id: '5', traderName: 'Nial Fuller', traderImg: 'https://ui-avatars.com/api/?name=Nial+Fuller&background=8b5cf6&color=fff&size=96', amount: 150, totalEarned: 22.80, profitShare: 22.3, status: 'stopped', createdAt: '2026-01-05T00:00:00Z', lastProfitAt: '2026-02-10T00:00:00Z' },
];

export default function MyCopyTrades() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [show, setShow] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCopyTrades(); }, []);

  const fetchCopyTrades = async () => {
    try {
      const res = await fetch('https://vertextrades.onrender.com/api/copy-trade', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCopyTrades(Array.isArray(data) && data.length > 0 ? data : MOCK_TRADES);
    } catch {
      setCopyTrades(MOCK_TRADES);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCopy = async () => {
    if (!selectedTrade) return;
    try {
      await fetch(`https://vertextrades.onrender.com/api/copy-trade/${selectedTrade._id}/stop`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      setCopyTrades(prev => prev.map(t => t._id === selectedTrade._id ? { ...t, status: 'stopped' } : t));
    } catch {}
    setShowStopModal(false);
    setSelectedTrade(null);
  };

  const activeTrades = copyTrades.filter(t => t.status === 'active');
  const stoppedTrades = copyTrades.filter(t => t.status === 'stopped');
  const totalInvested = activeTrades.reduce((s, t) => s + (t.amount || 0), 0);
  const totalEarned = activeTrades.reduce((s, t) => s + (t.totalEarned || 0), 0);
  const totalROI = totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : '0.00';

  const filtered = copyTrades.filter(t => t.traderName?.toLowerCase().includes(search.toLowerCase())).slice(0, show);

  if (loading) return (
    <div style={{ background: '#0e1628', minHeight: '100vh' }}>
      <PageHeader title="My Copy Trades" />
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white', paddingBottom: '40px' }}>
      <PageHeader title="My Copy Trades" />
      <div style={{ padding: '14px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '16px', background: '#6366f1', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>My Copy Trades</span>
            </div>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 10px' }}>Track your copied trader strategies</p>
          </div>
          <button onClick={() => navigate('/dashboard/copy-trading')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer' }}>+ Copy Trader</button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {[
            { icon: <Users size={12} color="#6366f1" />, label: 'Active', value: activeTrades.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
            { icon: <DollarSign size={12} color="#22c55e" />, label: 'Invested', value: '$' + totalInvested.toFixed(0), color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
            { icon: <TrendingUp size={12} color="#f59e0b" />, label: 'Earned', value: '$' + totalEarned.toFixed(2), color: totalEarned >= 0 ? '#22c55e' : '#ef4444', bg: 'rgba(245,158,11,0.1)' },
            { icon: <BarChart2 size={12} color="#ec4899" />, label: 'ROI', value: totalROI + '%', color: parseFloat(totalROI) >= 0 ? '#22c55e' : '#ef4444', bg: 'rgba(236,72,153,0.1)' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>{s.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Trades */}
        {activeTrades.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '9px', fontWeight: '700', color: '#22c55e' }}>ACTIVE COPY TRADES</span>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>({activeTrades.length})</span>
            </div>
            {activeTrades.map(trade => {
              const roi = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100) : 0;
              const isProfit = (trade.totalEarned || 0) >= 0;
              const progress = Math.min(Math.abs(roi), 100);
              return (
                <div key={trade._id} style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={trade.traderImg || `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff&size=96`}
                        style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.5)' }}
                        onError={e => e.target.src = `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff`} />
                      <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #1a2e4a' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700' }}>{trade.traderName}</div>
                      <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                        {trade.profitShare}% profit share • Since {new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <button onClick={() => { setSelectedTrade(trade); setShowStopModal(true); }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '6px 10px', borderRadius: '6px', color: '#ef4444', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <X size={10} /> Stop
                    </button>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
                    {[
                      { label: 'Invested', value: '$' + trade.amount.toFixed(2), color: 'white' },
                      { label: 'Earned', value: (isProfit ? '+' : '') + '$' + (trade.totalEarned || 0).toFixed(2), color: isProfit ? '#22c55e' : '#ef4444' },
                      { label: 'ROI', value: (isProfit ? '+' : '') + roi.toFixed(2) + '%', color: isProfit ? '#22c55e' : '#ef4444' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: '#0e1628', borderRadius: '8px', padding: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{s.label}</div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>
                      <span>Profit Progress</span>
                      <span style={{ color: isProfit ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{roi.toFixed(2)}% of investment</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: progress + '%', height: '100%', background: isProfit ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #b91c1c, #ef4444)', borderRadius: '10px', transition: 'width 0.5s ease' }} />
                    </div>
                    {trade.lastProfitAt && (
                      <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                        Last profit: {new Date(trade.lastProfitAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTrades.length === 0 && (
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '16px' }}>
            <TrendingUp size={28} color="rgba(255,255,255,0.15)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>No active copy trades</div>
            <button onClick={() => navigate('/dashboard/copy-trading')} style={{ padding: '8px 16px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Browse Traders</button>
          </div>
        )}

        {/* History Table */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.5)' }}>COPY TRADE HISTORY</span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>({copyTrades.length})</span>
          </div>
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Table controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>Show</span>
                <select value={show} onChange={e => setShow(Number(e.target.value))} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '4px' }}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trader..." style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '4px 8px', borderRadius: '4px', width: '110px', outline: 'none' }} />
            </div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.7fr 0.8fr 0.7fr', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Trader', 'Invested', 'Earned', 'ROI', 'Started', 'Status'].map(h => (
                <span key={h} style={{ fontSize: '7.5px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {filtered.map((trade, i) => {
              const roi = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100).toFixed(2) : '0.00';
              const isProfit = (trade.totalEarned || 0) >= 0;
              return (
                <div key={trade._id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.7fr 0.8fr 0.7fr', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={trade.traderImg || `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff&size=64`}
                      style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                      onError={e => e.target.src = `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff`} />
                    <span style={{ fontSize: '8px', fontWeight: '600', color: '#a5b4fc' }}>{trade.traderName}</span>
                  </div>
                  <span style={{ fontSize: '8px', color: 'white' }}>${trade.amount.toFixed(2)}</span>
                  <span style={{ fontSize: '8px', color: isProfit ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{isProfit ? '+' : ''}${(trade.totalEarned || 0).toFixed(2)}</span>
                  <span style={{ fontSize: '8px', color: isProfit ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{roi}%</span>
                  <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)' }}>{new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span style={{ background: trade.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)', color: trade.status === 'active' ? '#22c55e' : '#94a3b8', fontSize: '7px', padding: '2px 6px', borderRadius: '10px', width: 'fit-content', fontWeight: '600' }}>{trade.status}</span>
                </div>
              );
            })}
            <div style={{ padding: '8px 12px', fontSize: '7.5px', color: 'rgba(255,255,255,0.25)' }}>
              Showing {Math.min(show, filtered.length)} of {copyTrades.length} entries
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © VertexTrade Pro</div>
      </div>

      {/* Stop Modal */}
      {showStopModal && selectedTrade && (
        <div onClick={() => setShowStopModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a2e4a', borderRadius: '12px', padding: '20px', width: '85%', maxWidth: '300px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src={selectedTrade.traderImg} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700' }}>Stop Copying</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{selectedTrade.traderName}</div>
              </div>
            </div>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', lineHeight: '1.5' }}>Are you sure you want to stop copying this trader? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowStopModal(false)} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleStopCopy} style={{ flex: 1, padding: '9px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
