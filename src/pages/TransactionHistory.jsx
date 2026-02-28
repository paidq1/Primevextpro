import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

const allTransactions = [
  { id: '#TXN001', date: '2026-01-15 10:23', method: 'USDT (TRC20)', type: 'Deposit', amount: '+$500.00', status: 'Completed' },
  { id: '#TXN002', date: '2026-01-18 14:05', method: 'Bank Transfer', type: 'Withdrawal', amount: '-$200.00', status: 'Pending' },
  { id: '#TXN003', date: '2026-01-20 09:11', method: 'BTC', type: 'Deposit', amount: '+$1,000.00', status: 'Completed' },
  { id: '#TXN004', date: '2026-01-22 16:45', method: 'USDT (ERC20)', type: 'Withdrawal', amount: '-$350.00', status: 'Failed' },
  { id: '#TXN005', date: '2026-01-25 11:30', method: 'ETH', type: 'Deposit', amount: '+$750.00', status: 'Completed' },
  { id: '#TXN006', date: '2026-01-28 08:20', method: 'Bank Transfer', type: 'Withdrawal', amount: '-$100.00', status: 'Completed' },
];

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [filter, setFilter] = useState('All');

  const filtered = allTransactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.method.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.type === filter || t.status === filter;
    return matchSearch && matchFilter;
  }).slice(0, show);

  const statusColor = (s) => s === 'Completed' ? '#22c55e' : s === 'Pending' ? '#f59e0b' : '#ef4444';
  const typeColor = (t) => t === 'Deposit' ? '#22c55e' : '#ec4899';

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
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

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['All', 'Deposit', 'Withdrawal', 'Completed', 'Pending', 'Failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '4px 10px', background: filter === f ? '#6366f1' : 'rgba(255,255,255,0.06)',
              border: 'none', color: filter === f ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: '8px', fontWeight: '600', cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>

        {/* Table Container */}
        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Table Controls */}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.2fr 0.8fr 0.8fr 0.8fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Txn ID', 'Date', 'Method', 'Type', 'Amount', 'Status'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '700', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '4px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>

          {/* Table Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
          ) : (
            filtered.map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.2fr 0.8fr 0.8fr 0.8fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: '#818cf8', fontSize: '7px' }}>{t.id}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{t.date}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{t.method}</span>
                <span style={{ color: typeColor(t.type), fontSize: '7px', fontWeight: '600' }}>{t.type}</span>
                <span style={{ color: typeColor(t.type), fontSize: '7px', fontWeight: '700' }}>{t.amount}</span>
                <span style={{ background: statusColor(t.status) + '20', color: statusColor(t.status), fontSize: '6px', fontWeight: '700', padding: '2px 5px', display: 'inline-block' }}>{t.status}</span>
              </div>
            ))
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length === 0 ? '0 to 0 of 0' : '1 to ' + filtered.length + ' of ' + allTransactions.length} entries</span>
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
