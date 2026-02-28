import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBots } from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';

export default function BotTransactionHistory() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    getBots().then(data => {
      if (data.bots) { setBots(data.bots); setTotalEarned(data.totalEarned || 0); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = bots.filter(b =>
    b.botName?.toLowerCase().includes(search.toLowerCase()) ||
    b.paymentMethod?.toLowerCase().includes(search.toLowerCase()) ||
    b.status?.toLowerCase().includes(search.toLowerCase())
  );
  const statusColor = s => s === 'active' ? '#22c55e' : s === 'completed' ? '#6366f1' : s === 'cancelled' ? '#ef4444' : '#f59e0b';

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div><div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontWeight: '600' }}>Total Bots Earned: </span><span style={{ color: '#22c55e', fontSize: '10px', fontWeight: '700' }}>USD {totalEarned.toFixed(2)}</span></div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Subscribed Bots</span></div>
          <button onClick={() => navigate('/dashboard/manage-bots')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><svg width='12' height='12' fill='none' stroke='white' viewBox='0 0 24 24' strokeWidth='2'><rect x='3' y='11' width='18' height='10' rx='2'/><circle cx='12' cy='5' r='2'/><path d='M12 7v4'/></svg> Subscribe Bot</button>
        </div>

        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)' }}>
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
              <input value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '100px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1fr 0.9fr 1fr 0.8fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Amount','Txn Date','Method','Txn Type','Status','Txn ID','Receipt'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '4px 6px' }}>{h} <span style={{ opacity: 0.4 }}>↕</span></span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
          ) : filtered.slice(0, show).map((b, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1fr 0.9fr 1fr 0.8fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
              <span style={{ color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>${b.amount?.toFixed(2)}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', textTransform: 'capitalize' }}>{b.paymentMethod}</span>
              <span style={{ color: '#6366f1', fontSize: '7px' }}>{b.botName}</span>
              <span style={{ background: statusColor(b.status)+'20', color: statusColor(b.status), fontSize: '6px', padding: '2px 5px', textTransform: 'capitalize', display: 'inline-block' }}>{b.status}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px', wordBreak: 'break-all' }}>{b._id?.slice(-8)}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>—</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {Math.min(filtered.length, show)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
