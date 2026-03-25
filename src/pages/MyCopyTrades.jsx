import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, StopCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getCopyTrades, stopCopyTrade } from '../services/api';
import { formatAmountWithCode } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

export default function MyCopyTrades() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopping, setStopping] = useState(null);
  const [confirmStop, setConfirmStop] = useState(null);

  useEffect(() => {
    getCopyTrades().then(data => {
      setTrades(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStop = async (id) => {
    setStopping(id);
    try {
      await stopCopyTrade(id);
      setTrades(prev => prev.map(t => t._id === id ? { ...t, status: 'stopped' } : t));
    } catch {}
    setStopping(null);
    setConfirmStop(null);
  };

  const active = trades.filter(t => t.status === 'active');
  const stopped = trades.filter(t => t.status === 'stopped');

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="My Copy Trades" />
      <div style={{ padding: '14px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'Active Copies', value: active.length, color: '#22c55e', icon: <CheckCircle2 size={14} color="#22c55e" /> },
            { label: 'Total Invested', value: '$' + trades.filter(t => t.status === 'active').reduce((s, t) => s + t.amount, 0).toFixed(2), color: '#6366f1', icon: <DollarSign size={14} color="#6366f1" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {s.icon}
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Active Trades */}
        <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '4px', height: '14px', background: '#22c55e', borderRadius: '2px' }} />
          Active Copy Trades
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Loading...</div>}

        {!loading && active.length === 0 && (
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '16px' }}>
            <TrendingUp size={28} color="rgba(255,255,255,0.15)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>No active copy trades</div>
            <button onClick={() => navigate('/dashboard/copy-trading')} style={{ padding: '8px 16px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>
              Browse Traders
            </button>
          </div>
        )}

        {active.map(t => (
          <div key={t._id} style={{ background: '#1a2e4a', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.5)', flexShrink: 0 }}>
                <img src={t.traderImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + t.traderName + '&background=6366f1&color=fff'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>{t.traderName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '8px', color: '#22c55e' }}>Active</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>${t.amount.toFixed(2)}</div>
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>invested</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              <div style={{ background: '#0e1628', borderRadius: '6px', padding: '7px 10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>Profit Share</span>
                <span style={{ fontSize: '8px', fontWeight: '700', color: '#f59e0b' }}>{t.profitShare}%</span>
              </div>
              <div style={{ background: '#0e1628', borderRadius: '6px', padding: '7px 10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>Started</span>
                <span style={{ fontSize: '8px', fontWeight: '700', color: 'white' }}>{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
            {confirmStop === t._id ? (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px', marginBottom: '6px' }}>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textAlign: 'center' }}>Are you sure you want to stop copying {t.traderName}?</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setConfirmStop(null)} style={{ flex: 1, padding: '7px', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', fontSize: '8px', cursor: 'pointer', borderRadius: '6px' }}>Cancel</button>
                  <button onClick={() => handleStop(t._id)} disabled={stopping === t._id} style={{ flex: 1, padding: '7px', background: '#ef4444', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer', borderRadius: '6px' }}>
                    {stopping === t._id ? 'Stopping...' : 'Yes, Stop'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmStop(t._id)} style={{ width: '100%', padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <StopCircle size={12} /> Stop Copying
              </button>
            )}
          </div>
        ))}

        {/* Stopped Trades */}
        {stopped.length > 0 && (
          <>
            <div style={{ fontSize: '10px', fontWeight: '700', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '14px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
              Stopped
            </div>
            {stopped.map(t => (
              <div key={t._id} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', marginBottom: '10px', opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                    <img src={t.traderImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + t.traderName + '&background=6366f1&color=fff'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '2px' }}>{t.traderName}</div>
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>Stopped • ${t.amount.toFixed(2)} invested</div>
                  </div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>{new Date(t.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </>
        )}

        <button onClick={() => navigate('/dashboard/copy-trading')} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '10px', marginTop: '8px' }}>
          + Copy Another Trader
        </button>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px' }}>2020-2026 © VertexTrade Pro</div>
      </div>
    </div>
  );
}
