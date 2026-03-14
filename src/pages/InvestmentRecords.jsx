import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { getInvestments } from '../services/api';

export default function InvestmentRecords() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [show, setShow] = useState(10);
  const [search, setSearch] = useState('');
  const [investments, setInvestments] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvestments().then(data => {
      if (Array.isArray(data)) setInvestments(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = investments.filter(inv =>
    inv.plan?.toLowerCase().includes(search.toLowerCase()) ||
    inv.status?.toLowerCase().includes(search.toLowerCase())
  );

  const totalInvested = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalReturns = investments.reduce((s, i) => s + (i.profit || 0), 0);
  const activeCount = investments.filter(i => i.status === 'active').length;
  const completedCount = investments.filter(i => i.status === 'completed').length;

  const totalPages = Math.ceil(filtered.length / perPage);
  const statusColor = s => s === 'active' ? '#22c55e' : s === 'completed' ? '#6366f1' : s === 'cancelled' ? '#ef4444' : '#f59e0b';

  const statCard = (icon, label, value, color) => (
    <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '3px' }}>{label}</div>
        <div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Investment Records</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Investment Records</span>
          <button onClick={() => navigate('/dashboard/packages')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', padding: '6px 12px', cursor: 'pointer' }}>+ New Investment</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {statCard(<TrendingUp size={16} color='#6366f1'/>, 'Total Invested', formatAmount(totalInvested, user?.currency), '#6366f1')}
          {statCard(<DollarSign size={16} color='#22c55e'/>, 'Total Returns', formatAmount(totalReturns, user?.currency), '#22c55e')}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {statCard(<Clock size={16} color='#f59e0b'/>, 'Active Investments', String(activeCount), '#f59e0b')}
          {statCard(<CheckCircle size={16} color='#94a3b8'/>, 'Completed', String(completedCount), '#94a3b8')}
        </div>

        {/* Table */}
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
              <input value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
            </div>
          </div>

          {/* Table Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Plan', 'Amount', 'ROI', 'Start Date', 'End Date', 'Status'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No investment records found</div>
          ) : filtered.slice(0, show).map((inv, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{inv.plan}</span>
              <span style={{ color: 'white', fontSize: '8px' }}>${inv.amount?.toFixed(2)}</span>
              <span style={{ color: '#22c55e', fontSize: '8px' }}>{inv.roi}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{new Date(inv.createdAt).toLocaleDateString()}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : '—'}</span>
              <span style={{ background: statusColor(inv.status) + '20', color: statusColor(inv.status), fontSize: '7px', padding: '2px 6px', textTransform: 'capitalize', display: 'inline-block' }}>{inv.status}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {Math.min(filtered.length, show) > 0 ? 1 : 0} to {Math.min(filtered.length, show)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page === 1 ? 'default' : 'pointer' }}>«</button>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page === 1 ? 'default' : 'pointer' }}>‹</button>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages || 1}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page >= totalPages ? 'default' : 'pointer' }}>›</button>
              <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page >= totalPages ? 'default' : 'pointer' }}>»</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; VertexTrade Pro</div>

    </div>
  );
}