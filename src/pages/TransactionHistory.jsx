import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { getDeposits, getWithdrawals } from '../services/api';

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [deposits, withdrawals] = await Promise.all([getDeposits(), getWithdrawals()]);
        const deps = Array.isArray(deposits) ? deposits.map(d => ({ ...d, txnType: 'Deposit' })) : [];
        const with_ = Array.isArray(withdrawals) ? withdrawals.map(w => ({ ...w, txnType: 'Withdrawal' })) : [];
        // Merge and sort by date descending
        const all = [...deps, ...with_].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(all);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = transactions.filter(t => {
    const matchSearch =
      t._id?.toLowerCase().includes(search.toLowerCase()) ||
      t.method?.toLowerCase().includes(search.toLowerCase()) ||
      t.txnType?.toLowerCase().includes(search.toLowerCase()) ||
      t.status?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ||
      (filter === 'Deposit' && t.txnType === 'Deposit') ||
      (filter === 'Withdrawal' && t.txnType === 'Withdrawal') ||
      (filter === 'Completed' && t.status === 'approved') ||
      (filter === 'Pending' && t.status === 'pending') ||
      (filter === 'Failed' && t.status === 'rejected');
    return matchSearch && matchFilter;
  });

  const paginated = filtered.slice(0, show);

  const statusLabel = s => s === 'approved' ? 'Completed' : s === 'rejected' ? 'Failed' : 'Pending';
  const statusColor = s => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b';
  const typeColor = t => t === 'Deposit' ? '#22c55e' : '#ec4899';

  // Summary stats
  const totalDeposits = transactions.filter(t => t.txnType === 'Deposit' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.txnType === 'Withdrawal' && t.status === 'approved').reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', background: '#161f33', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#1a2236', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span>›</span>
          <span style={{ color: 'white' }}>Transaction History</span>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <div style={{ width: '4px', height: '16px', background: '#6366f1' }}/>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Transaction History</span>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <div style={{ flex: 1, background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px' }}>Total Deposits</div>
            <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: '700' }}>${totalDeposits.toFixed(2)}</div>
          </div>
          <div style={{ flex: 1, background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px' }}>Total Withdrawals</div>
            <div style={{ color: '#ec4899', fontSize: '11px', fontWeight: '700' }}>${totalWithdrawals.toFixed(2)}</div>
          </div>
          <div style={{ flex: 1, background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px' }}>Pending</div>
            <div style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '700' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['All', 'Deposit', 'Withdrawal', 'Completed', 'Pending', 'Failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '4px 10px',
              background: filter === f ? '#6366f1' : 'rgba(255,255,255,0.06)',
              border: 'none', color: filter === f ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: '8px', fontWeight: '600', cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)' }}>
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
              <input value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '90px' }} />
            </div>
          </div>

          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1.2fr 0.8fr 0.8fr 0.8fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Txn ID', 'Date', 'Method', 'Type', 'Amount', 'Status'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '700', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No transactions found</div>
          ) : paginated.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1.2fr 0.8fr 0.8fr 0.8fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: '#818cf8', fontSize: '7px' }}>#{t._id?.slice(-8).toUpperCase()}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{new Date(t.createdAt).toLocaleString()}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{t.method || '—'}</span>
              <span style={{ color: typeColor(t.txnType), fontSize: '7px', fontWeight: '600' }}>{t.txnType}</span>
              <span style={{ color: typeColor(t.txnType), fontSize: '7px', fontWeight: '700' }}>{t.txnType === 'Deposit' ? '+' : '-'}${t.amount?.toFixed(2)}</span>
              <span style={{ background: statusColor(t.status) + '20', color: statusColor(t.status), fontSize: '6px', fontWeight: '700', padding: '2px 5px', display: 'inline-block' }}>{statusLabel(t.status)}</span>
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>
              Showing {paginated.length > 0 ? 1 : 0} to {paginated.length} of {filtered.length} entries
            </span>
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
