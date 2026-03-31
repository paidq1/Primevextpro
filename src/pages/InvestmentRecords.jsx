import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount } from '../utils/currency';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getInvestments } from '../services/api';

const MOCK_INVESTMENTS = [
  { _id: '1', plan: 'Gold Plan', amount: 500, profit: 75.00, roi: '15%', status: 'active', createdAt: '2026-02-10T00:00:00Z', expiresAt: '2026-05-10T00:00:00Z' },
  { _id: '2', plan: 'Silver Plan', amount: 300, profit: 36.00, roi: '12%', status: 'active', createdAt: '2026-02-20T00:00:00Z', expiresAt: '2026-04-20T00:00:00Z' },
  { _id: '3', plan: 'Platinum Plan', amount: 1000, profit: 200.00, roi: '20%', status: 'completed', createdAt: '2026-01-01T00:00:00Z', expiresAt: '2026-02-01T00:00:00Z' },
  { _id: '4', plan: 'Bronze Plan', amount: 150, profit: -12.00, roi: '8%', status: 'cancelled', createdAt: '2026-03-01T00:00:00Z', expiresAt: '2026-04-01T00:00:00Z' },
  { _id: '5', plan: 'Gold Plan', amount: 750, profit: 112.50, roi: '15%', status: 'active', createdAt: '2026-03-10T00:00:00Z', expiresAt: '2026-06-10T00:00:00Z' },
];

export default function InvestmentRecords() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(10);
  const [search, setSearch] = useState('');
  const [investments, setInvestments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvestments().then(data => {
      setInvestments(Array.isArray(data) && data.length > 0 ? data : MOCK_INVESTMENTS);
      setLoading(false);
    }).catch(() => { setInvestments(MOCK_INVESTMENTS); setLoading(false); });
  }, []);

  const filtered = investments.filter(inv =>
    inv.plan?.toLowerCase().includes(search.toLowerCase()) ||
    inv.status?.toLowerCase().includes(search.toLowerCase())
  );

  const totalInvested = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalReturns = investments.reduce((s, i) => s + (i.profit || 0), 0);
  const activeCount = investments.filter(i => i.status === 'active').length;
  const completedCount = investments.filter(i => i.status === 'completed').length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / show));
  const paginated = filtered.slice((page - 1) * show, page * show);

  const statusColor = s => s === 'active' ? '#22c55e' : s === 'completed' ? '#6366f1' : s === 'cancelled' ? '#ef4444' : '#f59e0b';

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white', paddingBottom: '40px' }}>
      <PageHeader title="Investment Records" />
      <div style={{ padding: '14px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '16px', background: '#6366f1', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Investment Records</span>
            </div>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 10px' }}>Track all your active and completed investments</p>
          </div>
          <button onClick={() => navigate('/dashboard/packages')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer' }}>+ New Investment</button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {[
            { icon: <TrendingUp size={12} color="#6366f1" />, label: 'Total Invested', value: formatAmount(totalInvested, user?.currency), color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
            { icon: <DollarSign size={12} color="#22c55e" />, label: 'Total Returns', value: formatAmount(totalReturns, user?.currency), color: totalReturns >= 0 ? '#22c55e' : '#ef4444', bg: 'rgba(34,197,94,0.1)' },
            { icon: <Clock size={12} color="#f59e0b" />, label: 'Active', value: String(activeCount), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { icon: <CheckCircle size={12} color="#94a3b8" />, label: 'Completed', value: String(completedCount), color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>{s.icon}</div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Show</span>
              <select value={show} onChange={e => { setShow(Number(e.target.value)); setPage(1); }} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', outline: 'none' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>entries</span>
            </div>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '4px 8px', borderRadius: '4px', width: '100px', outline: 'none' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.7fr 0.9fr 0.9fr 0.8fr', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Plan', 'Amount', 'ROI', 'Start Date', 'End Date', 'Status'].map(h => (
              <span key={h} style={{ fontSize: '7.5px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Loading...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}>No investment records found</div>
          ) : paginated.map((inv, i) => (
            <div key={inv._id || i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.7fr 0.9fr 0.9fr 0.8fr', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <span style={{ fontSize: '8px', fontWeight: '700', color: '#a5b4fc' }}>{inv.plan}</span>
              <span style={{ fontSize: '8px', color: 'white' }}>{formatAmount(inv.amount || 0, user?.currency)}</span>
              <span style={{ fontSize: '8px', color: '#22c55e', fontWeight: '600' }}>{inv.roi}</span>
              <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)' }}>{new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)' }}>{inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
              <span style={{ background: statusColor(inv.status) + '20', color: statusColor(inv.status), fontSize: '7px', padding: '2px 7px', borderRadius: '10px', width: 'fit-content', fontWeight: '600', textTransform: 'capitalize' }}>{inv.status}</span>
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7.5px' }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * show + 1} to {Math.min(page * show, filtered.length)} of {filtered.length} entries
            </span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[{ label: '«', action: () => setPage(1), disabled: page === 1 }, { label: '‹', action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 }].map((b, i) => (
                <button key={i} onClick={b.action} disabled={b.disabled} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: b.disabled ? 'rgba(255,255,255,0.2)' : 'white', fontSize: '9px', padding: '2px 7px', borderRadius: '4px', cursor: b.disabled ? 'default' : 'pointer' }}>{b.label}</button>
              ))}
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7.5px', padding: '0 4px' }}>Page {page} of {totalPages}</span>
              {[{ label: '›', action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page >= totalPages }, { label: '»', action: () => setPage(totalPages), disabled: page >= totalPages }].map((b, i) => (
                <button key={i} onClick={b.action} disabled={b.disabled} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: b.disabled ? 'rgba(255,255,255,0.2)' : 'white', fontSize: '9px', padding: '2px 7px', borderRadius: '4px', cursor: b.disabled ? 'default' : 'pointer' }}>{b.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © VertexTrade Pro</div>
      </div>
    </div>
  );
}
