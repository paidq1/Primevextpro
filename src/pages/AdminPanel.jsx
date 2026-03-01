import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://primevextpro.onrender.com/api';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [trades, setTrades] = useState([]);
  const [kyc, setKyc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBalance, setEditBalance] = useState({});
  const [msg, setMsg] = useState('');

  const api = (path, method = 'GET', body) =>
    fetch(`${BASE_URL}/admin${path}`, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined }).then(r => r.json());

  useEffect(() => {
    api('/stats').then(setStats);
  }, []);

  useEffect(() => {
    if (tab === 'users') api('/users').then(setUsers);
    if (tab === 'deposits') api('/deposits').then(setDeposits);
    if (tab === 'withdrawals') api('/withdrawals').then(setWithdrawals);
    if (tab === 'kyc') api('/kyc').then(setKyc);
    if (tab === 'trades') api('/trades').then(setTrades);
  }, [tab]);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const approveDeposit = async (id, status) => {
    await api(`/deposits/${id}`, 'PUT', { status });
    api('/deposits').then(setDeposits);
    api('/stats').then(setStats);
    showMsg(`Deposit ${status}`);
  };

  const approveWithdrawal = async (id, status) => {
    await api(`/withdrawals/${id}`, 'PUT', { status });
    api('/withdrawals').then(setWithdrawals);
    api('/stats').then(setStats);
    showMsg(`Withdrawal ${status}`);
  };

  const approveKyc = async (id, status) => {
    await api(`/kyc/${id}`, 'PUT', { status });
    api('/kyc').then(setKyc);
    api('/stats').then(setStats);
    showMsg(`KYC ${status}`);
  };


  const [tradeEdit, setTradeEdit] = useState({});
  const updateTrade = async (id) => {
    const t = tradeEdit[id];
    if (!t) return;
    await api(`/trades/${id}`, 'PUT', { result: parseFloat(t.result || 0), status: t.status || 'closed' });
    api('/trades').then(setTrades);
    showMsg('Trade updated');
  };
  const updateBalance = async (id) => {
    if (!editBalance[id]) return;
    await api(`/users/${id}/balance`, 'PUT', { balance: parseFloat(editBalance[id]) });
    api('/users').then(setUsers);
    showMsg('Balance updated');
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await api(`/users/${id}`, 'DELETE');
    api('/users').then(setUsers);
    showMsg('User deleted');
  };

  const [msgInput, setMsgInput] = useState({});
  const sendMessage = async (id) => {
    if (!msgInput[id]) return;
    await api(`/users/${id}/message`, 'POST', { message: msgInput[id] });
    setMsgInput(m => ({ ...m, [id]: '' }));
    showMsg('Message sent to user');
  };

  const toggleBlock = async (id) => {
    await api(`/users/${id}/block`, 'PUT');
    api('/users').then(setUsers);
    showMsg('User status updated');
  };

  const tabs = ['stats', 'users', 'deposits', 'withdrawals', 'kyc', 'trades'];
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, color: '#6366f1' },
    { label: 'Pending Deposits', value: stats.pendingDeposits || 0, color: '#f59e0b' },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals || 0, color: '#ec4899' },
    { label: 'Pending KYC', value: stats.pendingKyc || 0, color: '#22c55e' },
  ];

  const thStyle = { padding: '8px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '8px', fontSize: '7px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' };
  const btnStyle = (color) => ({ padding: '3px 8px', background: color, border: 'none', color: 'white', fontSize: '7px', cursor: 'pointer', borderRadius: '2px', marginRight: '4px' });

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ Admin Panel</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={logout} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg && <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{msg}</div>}

      {/* Tabs */}
      <div style={{ background: '#141824', padding: '0 16px', display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', background: 'none', border: 'none', color: tab === t ? '#6366f1' : 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '700', cursor: 'pointer', borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', textTransform: 'uppercase' }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Stats */}
        {tab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {statCards.map((s, i) => (
                <div key={i} style={{ background: '#252d3d', border: `1px solid ${s.color}40`, padding: '14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '6px' }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: '22px', fontWeight: '700' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#252d3d', padding: '12px', fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>
              Total Deposits: {stats.totalDeposits || 0} · Total Withdrawals: {stats.totalWithdrawals || 0}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Balance', 'KYC', 'Status', 'Msg', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{u.firstName} {u.lastName}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input value={editBalance[u._id] ?? u.balance?.toFixed(2) ?? '0'} onChange={e => setEditBalance(b => ({ ...b, [u._id]: e.target.value }))} style={{ width: '70px', background: '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px 5px' }} />
                        <button onClick={() => updateBalance(u._id)} style={btnStyle('#6366f1')}>Set</button>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: u.kycStatus === 'approved' ? '#22c55e' : u.kycStatus === 'pending' ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}>{u.kycStatus || 'none'}</td>
                    <td style={{ ...tdStyle, color: u.isBlocked ? '#ef4444' : '#22c55e' }}>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <input value={msgInput[u._id] || ''} onChange={e => setMsgInput(m => ({ ...m, [u._id]: e.target.value }))} placeholder="Message..." style={{ width: '60px', background: '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px 4px' }} />
                        <button onClick={() => sendMessage(u._id)} style={btnStyle('#f59e0b')}>✓</button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleBlock(u._id)} style={btnStyle(u.isBlocked ? '#22c55e' : '#ef4444')}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
                      <button onClick={() => deleteUser(u._id)} style={btnStyle('#ef4444')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Deposits */}
        {tab === 'deposits' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {deposits.map((d, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{d.user?.firstName} {d.user?.lastName}<br/><span style={{ color: 'rgba(255,255,255,0.4)' }}>{d.user?.email}</span></td>
                    <td style={{ ...tdStyle, color: '#22c55e' }}>${d.amount?.toFixed(2)}</td>
                    <td style={tdStyle}>{d.method || d.paymentMethod}</td>
                    <td style={{ ...tdStyle, color: d.status === 'approved' ? '#22c55e' : d.status === 'pending' ? '#f59e0b' : '#ef4444' }}>{d.status}</td>
                    <td style={tdStyle}>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {d.status === 'pending' && <>
                        <button onClick={() => approveDeposit(d._id, 'approved')} style={btnStyle('#22c55e')}>Approve</button>
                        <button onClick={() => approveDeposit(d._id, 'rejected')} style={btnStyle('#ef4444')}>Reject</button>
                      </>}
                      {d.proof && <a href={'https://primevextpro.onrender.com' + d.proof} target="_blank" style={{ ...btnStyle('#6366f1'), textDecoration: 'none', display: 'inline-block' }}>Proof</a>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Withdrawals */}
        {tab === 'withdrawals' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Amount', 'Wallet', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {withdrawals.map((w, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{w.user?.firstName} {w.user?.lastName}<br/><span style={{ color: 'rgba(255,255,255,0.4)' }}>{w.user?.email}</span></td>
                    <td style={{ ...tdStyle, color: '#ec4899' }}>${w.amount?.toFixed(2)}</td>
                    <td style={{ ...tdStyle, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.walletAddress}</td>
                    <td style={{ ...tdStyle, color: w.status === 'approved' ? '#22c55e' : w.status === 'pending' ? '#f59e0b' : '#ef4444' }}>{w.status}</td>
                    <td style={tdStyle}>{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {w.status === 'pending' && <>
                        <button onClick={() => approveWithdrawal(w._id, 'approved')} style={btnStyle('#22c55e')}>Approve</button>
                        <button onClick={() => approveWithdrawal(w._id, 'rejected')} style={btnStyle('#ef4444')}>Reject</button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* KYC */}
        {tab === 'kyc' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {kyc.map((k, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{k.firstName} {k.lastName}</td>
                    <td style={tdStyle}>{k.email}</td>
                    <td style={{ ...tdStyle, color: k.kycStatus === 'approved' ? '#22c55e' : k.kycStatus === 'pending' ? '#f59e0b' : '#ef4444' }}>{k.kycStatus}</td>
                    <td style={tdStyle}>{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {k.kycStatus === 'pending' && <>
                        <button onClick={() => approveKyc(k._id, 'approved')} style={btnStyle('#22c55e')}>Approve</button>
                        <button onClick={() => approveKyc(k._id, 'rejected')} style={btnStyle('#ef4444')}>Reject</button>
                      </>}
