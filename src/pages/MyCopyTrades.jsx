import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, CheckCircle, Copy, X, TrendingDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function MyCopyTrades() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [show, setShow] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCopyTrades();
  }, []);

  const fetchCopyTrades = async () => {
    try {
      const response = await fetch('https://vertextrades.onrender.com/api/copy-trade', {
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) setCopyTrades(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCopy = async () => {
    if (!selectedTrade) return;
    try {
      await fetch(`https://vertextrades.onrender.com/api/copy-trade/${selectedTrade._id}/stop`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('token')}` }
      });
      alert(`Stopped copying ${selectedTrade.traderName}`);
      setShowStopModal(false);
      setSelectedTrade(null);
      fetchCopyTrades();
    } catch (error) {
      alert('Failed to stop');
    }
  };

  const totalInvested = copyTrades.reduce((s, i) => s + (i.amount || 0), 0);
  const totalReturns = copyTrades.reduce((s, i) => s + (i.totalEarned || 0), 0);
  const activeCount = copyTrades.filter(i => i.status === 'active').length;
  const stoppedCount = copyTrades.filter(i => i.status === 'stopped').length;
  const activeTrades = copyTrades.filter(i => i.status === 'active');

  const statCard = (icon, label, value, color) => (
    <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '8px', flex: 1, textAlign: 'center' }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
        {icon}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '7px' }}>{label}</div>
      <div style={{ color, fontSize: '10px', fontWeight: '700' }}>{value}</div>
    </div>
  );

  if (loading) return <div style={{ background: '#0e1628', minHeight: '100vh' }}><PageHeader title="My Copy Trades" /><div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628' }}>
      <PageHeader title="My Copy Trades" />
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>My Copy Trades</span>
          <button onClick={() => navigate('/dashboard/copy-trading')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>+ Copy New Trader</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {statCard(<TrendingUp size={12} color='#6366f1'/>, 'Total Invested', `$${totalInvested.toFixed(2)}`, '#6366f1')}
          {statCard(<DollarSign size={12} color='#22c55e'/>, 'Total Returns', `$${totalReturns.toFixed(2)}`, totalReturns >= 0 ? '#22c55e' : '#ef4444')}
          {statCard(<Clock size={12} color='#f59e0b'/>, 'Active', String(activeCount), '#f59e0b')}
          {statCard(<CheckCircle size={12} color='#94a3b8'/>, 'Stopped', String(stoppedCount), '#94a3b8')}
        </div>

        {/* Active Trades Cards */}
        {activeTrades.length > 0 && (
          <>
            <div style={{ marginBottom: '12px' }}><span style={{ fontSize: '10px', fontWeight: '600', color: '#f59e0b' }}>● ACTIVE COPY TRADES</span></div>
            {activeTrades.map((trade) => {
              const profitPercent = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100).toFixed(2) : 0;
              const isProfit = (trade.totalEarned || 0) >= 0;
              const progress = Math.min(Math.abs(profitPercent), 100);
              return (
                <div key={trade._id} style={{ background: '#1a2e4a', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={trade.traderImg || `https://ui-avatars.com/api/?name=${trade.traderName}&background=6366f1&color=fff&size=96`} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(99,102,241,0.5)" }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{trade.traderName}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Profit Share: {trade.profitShare || 20}% • Started: {new Date(trade.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedTrade(trade); setShowStopModal(true); }} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 12px', borderRadius: '6px', color: '#ef4444', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><X size={12} /> Stop</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div><div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Amount Invested</div><div style={{ fontSize: '16px', fontWeight: '700' }}>${trade.amount.toFixed(2)}</div></div>
                    <div><div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Total Earned</div><div style={{ fontSize: '16px', fontWeight: '700', color: isProfit ? '#22c55e' : '#ef4444' }}>{isProfit ? '+' : ''}${(trade.totalEarned || 0).toFixed(2)}</div></div>
                    <div><div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>ROI</div><div style={{ fontSize: '16px', fontWeight: '700', color: isProfit ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>{isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{profitPercent}%</div></div>
                    <div><div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Last Profit</div><div style={{ fontSize: '12px', fontWeight: '500' }}>{trade.lastProfitAt ? new Date(trade.lastProfitAt).toLocaleDateString() : '—'}</div></div>
                  </div>
                  {trade.totalEarned > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}><span>Profit Progress</span><span>{profitPercent}% of investment</span></div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px' }}><div style={{ width: `${progress}%`, height: '100%', background: isProfit ? '#22c55e' : '#ef4444', borderRadius: '10px' }} /></div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* History Table */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '12px' }}><span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>● COPY TRADE HISTORY</span></div>
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>Show</span>
                <select value={show} onChange={e => setShow(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px' }}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>entries</span>
              </div>
              <div><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trader..." style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', width: '100px' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Trader</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Amount</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Total Earned</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>ROI</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Start Date</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Status</span>
            </div>
            {copyTrades.filter(t => t.traderName?.toLowerCase().includes(search.toLowerCase())).slice(0, show).map((trade, i) => {
              const profitPercent = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100).toFixed(2) : 0;
              return (
                <div key={trade._id} style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{trade.traderName}</span>
                  <span style={{ fontSize: '8px' }}>${trade.amount.toFixed(2)}</span>
                  <span style={{ color: trade.totalEarned >= 0 ? '#22c55e' : '#ef4444', fontSize: '8px' }}>${(trade.totalEarned || 0).toFixed(2)}</span>
                  <span style={{ color: trade.totalEarned >= 0 ? '#22c55e' : '#ef4444', fontSize: '8px' }}>{profitPercent}%</span>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>{new Date(trade.createdAt).toLocaleDateString()}</span>
                  <span style={{ background: trade.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.2)', color: trade.status === 'active' ? '#22c55e' : '#94a3b8', fontSize: '7px', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', width: 'fit-content' }}>{trade.status}</span>
                </div>
              );
            })}
            <div style={{ padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '8px', color: 'rgba(255,255,255,0.35)' }}>
              Showing 1 to {Math.min(show, copyTrades.length)} of {copyTrades.length} entries
            </div>
          </div>
        </div>
      </div>

      {showStopModal && selectedTrade && (
        <div onClick={() => setShowStopModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1a2e4a", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "320px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "12px" }}>Stop Copy Trading</h3>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>Stop copying <strong>{selectedTrade.traderName}</strong>?</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowStopModal(false)} style={{ flex: 1, padding: "8px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleStopCopy} style={{ flex: 1, padding: "8px", background: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer" }}>Stop</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; VertexTrade Pro</div>
    </div>
  );
}
// force deploy Mon Mar 30 20:36:14 WAT 2026
