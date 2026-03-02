import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://vertextradepro.onrender.com/api';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [proofImage, setProofImage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailTarget, setEmailTarget] = useState(null); // null = bulk
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [depositFilter, setDepositFilter] = useState('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState('all');
  const [depositSearch, setDepositSearch] = useState('');
  const [withdrawalSearch, setWithdrawalSearch] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [kyc, setKyc] = useState([]);
  const [trades, setTrades] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [editBalance, setEditBalance] = useState({});
  const [tradeEdit, setTradeEdit] = useState({});
  const [msgInput, setMsgInput] = useState({});
  const [msg, setMsg] = useState('');

  const api = (path, method = 'GET', body) =>
    fetch(`${BASE_URL}/admin${path}`, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined }).then(r => r.json());

  useEffect(() => { api('/stats').then(setStats); }, []);

  useEffect(() => {
    if (tab === 'users') api('/users').then(setUsers);
    if (tab === 'deposits') api('/deposits').then(setDeposits);
    if (tab === 'withdrawals') api('/withdrawals').then(setWithdrawals);
    if (tab === 'kyc') api('/kyc').then(setKyc);
    if (tab === 'trades') api('/trades').then(setTrades);
  }, [tab]);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const approveDeposit = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this deposit?`)) return;
    await api(`/deposits/${id}`, 'PUT', { status });
    api('/deposits').then(setDeposits);
    api('/stats').then(setStats);
    showMsg(`Deposit ${status}`);
  };

  const approveWithdrawal = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this withdrawal?`)) return;
    await api(`/withdrawals/${id}`, 'PUT', { status });
    api('/withdrawals').then(setWithdrawals);
    api('/stats').then(setStats);
    showMsg(`Withdrawal ${status}`);
  };

  const approveKyc = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this KYC?`)) return;
    await api(`/kyc/${id}`, 'PUT', { status });
    api('/kyc').then(setKyc);
    api('/stats').then(setStats);
    showMsg(`KYC ${status}`);
  };

  const updateBalance = async (id) => {
    if (!editBalance[id]) return;
    await api(`/users/${id}/balance`, 'PUT', { balance: parseFloat(editBalance[id]) });
    api('/users').then(setUsers);
    showMsg('Balance updated');
  };

  const [editStats, setEditStats] = useState({});
  const updateUserStats = async (id) => {
    const s = editStats[id];
    if (!s) return;
    await api(`/users/${id}/stats`, 'PUT', {
      totalDeposits: parseFloat(s.totalDeposits || 0),
      totalWithdrawals: parseFloat(s.totalWithdrawals || 0),
      totalProfit: parseFloat(s.totalProfit || 0),
      totalReferrals: parseFloat(s.totalReferrals || 0),
      totalPackages: parseFloat(s.totalPackages || 0),
    });
    api('/users').then(setUsers);
    showMsg('User stats updated');
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await api(`/users/${id}`, 'DELETE');
    api('/users').then(setUsers);
    showMsg('User deleted');
  };

  const sendMessage = async (id) => {
    if (!msgInput[id]) return;
    await api(`/users/${id}/message`, 'POST', { message: msgInput[id] });
    setMsgInput(m => ({ ...m, [id]: '' }));
    showMsg('Message sent to user');
  };

  const deleteMessage = async (id) => {
    await api(`/users/${id}/message`, 'DELETE');
    api('/users').then(setUsers);
    showMsg('Message deleted');
  };

  const toggleBlock = async (id) => {
    await api(`/users/${id}/block`, 'PUT');
    api('/users').then(setUsers);
    showMsg('User status updated');
  };

  const updateTrade = async (id) => {
    const t = tradeEdit[id];
    if (!t) return;
    await api(`/trades/${id}`, 'PUT', { result: parseFloat(t.result || 0), status: t.status || 'closed' });
    api('/trades').then(setTrades);
    showMsg('Trade updated');
  };

  const tabs = ['stats', 'users', 'deposits', 'withdrawals', 'kyc', 'trades'];
  const pendingCount = (arr) => arr.filter(x => x.status === 'pending' || x.kycStatus === 'submitted').length;
  const tabLabel = (t) => {
    if (t === 'deposits') return `Deposits${deposits.filter(d => d.status === 'pending').length ? ' (' + deposits.filter(d => d.status === 'pending').length + ')' : ''}`;
    if (t === 'withdrawals') return `Withdrawals${withdrawals.filter(w => w.status === 'pending').length ? ' (' + withdrawals.filter(w => w.status === 'pending').length + ')' : ''}`;
    if (t === 'kyc') return `KYC${kyc.filter(k => k.kycStatus === 'submitted').length ? ' (' + kyc.filter(k => k.kycStatus === 'submitted').length + ')' : ''}`;
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, color: '#6366f1' },
    { label: 'Pending Deposits', value: stats.pendingDeposits || 0, color: '#f59e0b' },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals || 0, color: '#ec4899' },
    { label: 'Pending KYC', value: stats.pendingKyc || 0, color: '#22c55e' },
  ];

  const thStyle = { padding: '8px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '8px', fontSize: '7px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' };
  const btnStyle = (color) => ({ padding: '3px 8px', background: color, border: 'none', color: 'white', fontSize: '7px', cursor: 'pointer', borderRadius: '2px', marginRight: '4px' });

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) { setMsg('Please fill subject and message'); return; }
    setEmailSending(true);
    try {
      let res;
      if (emailTarget) {
        res = await fetch(`${BASE_URL}/admin/users/${emailTarget._id}/email`, {
          method: 'POST', headers: headers(),
          body: JSON.stringify({ subject: emailSubject, message: emailMessage })
        }).then(r => r.json());
      } else {
        res = await fetch(`${BASE_URL}/admin/email/bulk`, {
          method: 'POST', headers: headers(),
          body: JSON.stringify({ subject: emailSubject, message: emailMessage })
        }).then(r => r.json());
      }
      if (res.message) {
        setEmailSuccess(res.message);
        setEmailSubject('');
        setEmailMessage('');
      } else {
        setEmailSuccess('Failed: ' + (res.message || 'Unknown error'));
      }
    } catch(e) {
      setEmailSuccess('Failed to send email');
    }
    setEmailSending(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>/ Admin Panel</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={logout} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg && <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{msg}</div>}

      {/* Tabs */}
      <div style={{ background: '#141824', padding: '0 16px', display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', background: 'none', border: 'none', color: tab === t ? '#6366f1' : 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '700', cursor: 'pointer', borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t}</button>
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

            {/* Deposits by status chart */}
            <div style={{ background: '#252d3d', padding: '14px', marginBottom: '12px' }}>
              <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', marginBottom: '12px' }}>Deposits Overview</div>
              {(() => {
                const pending = deposits.filter(d => d.status === 'pending').length;
                const approved = deposits.filter(d => d.status === 'approved').length;
                const rejected = deposits.filter(d => d.status === 'rejected').length;
                const total = deposits.length || 1;
                const totalAmount = deposits.filter(d => d.status === 'approved').reduce((a, d) => a + d.amount, 0);
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      {[['Pending', pending, '#f59e0b'], ['Approved', approved, '#22c55e'], ['Rejected', rejected, '#ef4444']].map(([l,v,col]) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                          <div style={{ color: col, fontSize: '18px', fontWeight: '700' }}>{v}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#6366f1', fontSize: '18px', fontWeight: '700' }}>${totalAmount.toFixed(0)}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Approved $</div>
                      </div>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: (approved/total*100) + '%', background: '#22c55e' }} />
                      <div style={{ width: (pending/total*100) + '%', background: '#f59e0b' }} />
                      <div style={{ width: (rejected/total*100) + '%', background: '#ef4444' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      {[['Approved', '#22c55e'], ['Pending', '#f59e0b'], ['Rejected', '#ef4444']].map(([l,c]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '8px', height: '8px', background: c, borderRadius: '2px' }} />
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Withdrawals by status chart */}
            <div style={{ background: '#252d3d', padding: '14px', marginBottom: '12px' }}>
              <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', marginBottom: '12px' }}>Withdrawals Overview</div>
              {(() => {
                const pending = withdrawals.filter(w => w.status === 'pending').length;
                const approved = withdrawals.filter(w => w.status === 'approved').length;
                const rejected = withdrawals.filter(w => w.status === 'rejected').length;
                const total = withdrawals.length || 1;
                const totalAmount = withdrawals.filter(w => w.status === 'approved').reduce((a, w) => a + w.amount, 0);
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      {[['Pending', pending, '#f59e0b'], ['Approved', approved, '#22c55e'], ['Rejected', rejected, '#ef4444']].map(([l,v,col]) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                          <div style={{ color: col, fontSize: '18px', fontWeight: '700' }}>{v}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ec4899', fontSize: '18px', fontWeight: '700' }}>${totalAmount.toFixed(0)}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Approved $</div>
                      </div>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: (approved/total*100) + '%', background: '#22c55e' }} />
                      <div style={{ width: (pending/total*100) + '%', background: '#f59e0b' }} />
                      <div style={{ width: (rejected/total*100) + '%', background: '#ef4444' }} />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Users overview */}
            <div style={{ background: '#252d3d', padding: '14px' }}>
              <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', marginBottom: '12px' }}>Users Overview</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[
                  ['Total', users.length, '#6366f1'],
                  ['Active', users.filter(u => !u.isBlocked).length, '#22c55e'],
                  ['Blocked', users.filter(u => u.isBlocked).length, '#ef4444'],
                  ['KYC Done', users.filter(u => u.kycStatus === 'approved').length, '#f59e0b'],
                ].map(([l,v,col]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ color: col, fontSize: '18px', fontWeight: '700' }}>{v}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "80vh" }}>
            <div style={{ padding: "8px 0", marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, background: "#374151", border: "none", color: "white", fontSize: "8px", padding: "6px 10px", outline: "none" }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "7px" }}>{users.filter(u => (u.firstName + " " + u.lastName + " " + u.email).toLowerCase().includes(userSearch.toLowerCase())).length} users</span>
              <button onClick={() => { setEmailTarget(null); setEmailModal(true); setEmailSuccess(''); }} style={{ ...btnStyle('#6366f1'), whiteSpace: 'nowrap' }}>📧 Email All</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'Balance', 'Stats', 'KYC', 'Status', 'Msg', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.filter(u => (u.firstName + " " + u.lastName + " " + u.email).toLowerCase().includes(userSearch.toLowerCase())).map((u, i) => (
                  <tr key={i} style={{ verticalAlign: "top" }}>
                    <td style={tdStyle}>{u.firstName} {u.lastName}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input value={editBalance[u._id] ?? u.balance?.toFixed(2) ?? '0'} onChange={e => setEditBalance(b => ({ ...b, [u._id]: e.target.value }))} style={{ width: '70px', background: '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px 5px' }} />
                        <button onClick={() => updateBalance(u._id)} style={btnStyle('#6366f1')}>Set</button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {[["totalDeposits","Deposits"],["totalWithdrawals","Withdrawals"],["totalProfit","Profit"],["totalReferrals","Referrals"],["totalPackages","Packages"]].map(([field, label]) => (
                          <div key={field} style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "6px", width: "55px" }}>{label}:</span>
                            <input type="number" placeholder={u[field]?.toFixed(2) ?? "0"} value={editStats[u._id]?.[field] ?? ""} onChange={e => setEditStats(p => ({ ...p, [u._id]: { ...p[u._id], [field]: e.target.value } }))} style={{ width: "55px", background: "#374151", border: "none", color: "white", fontSize: "6px", padding: "2px 4px" }} />
                          </div>
                        ))}
                        <button onClick={() => updateUserStats(u._id)} style={{ ...btnStyle("#22c55e"), marginTop: "3px" }}>Update</button>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: u.kycStatus === 'approved' ? '#22c55e' : u.kycStatus === 'submitted' ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}>{u.kycStatus || 'none'}</td>
                    <td style={{ ...tdStyle, color: u.isBlocked ? '#ef4444' : '#22c55e' }}>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>{u.adminMessage && <span style={{ color: "#f59e0b", fontSize: "6px", maxWidth: "140px", wordBreak: "break-word", whiteSpace: "normal" }}>Current: {u.adminMessage}</span>}<div style={{ display: "flex", gap: "2px" }}>
                        <input value={msgInput[u._id] || ''} onChange={e => setMsgInput(m => ({ ...m, [u._id]: e.target.value }))} placeholder="Message..." style={{ width: '140px', background: '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px 4px' }} />
                        <button onClick={() => sendMessage(u._id)} style={btnStyle('#f59e0b')}>Send</button>
                        <button onClick={() => deleteMessage(u._id)} style={btnStyle("#ef4444")}>Del Msg</button>
                      </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => setSelectedUser(u)} style={btnStyle('#818cf8')}>View</button>
                      <button onClick={() => { setEmailTarget(u); setEmailModal(true); setEmailSuccess(''); }} style={btnStyle('#6366f1')}>Email</button>
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
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Search user or method..." style={{ background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '6px 10px', outline: 'none', flex: 1, minWidth: '150px' }} />
              {['all','pending','approved','rejected'].map(f => (
                <button key={f} onClick={() => setDepositFilter(f)} style={{ padding: '6px 12px', background: depositFilter === f ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {deposits.filter(d => {
                  const matchFilter = depositFilter === 'all' || d.status === depositFilter;
                  const matchSearch = !depositSearch || (d.user?.firstName + ' ' + d.user?.lastName + ' ' + d.user?.email + ' ' + d.method).toLowerCase().includes(depositSearch.toLowerCase());
                  return matchFilter && matchSearch;
                }).map((d, i) => (
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
                      {d.proofImage && <button onClick={() => setProofImage('https://vertextradepro.onrender.com' + d.proofImage)} style={btnStyle('#6366f1')}>View Proof</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Withdrawals */}
        {tab === 'withdrawals' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input value={withdrawalSearch} onChange={e => setWithdrawalSearch(e.target.value)} placeholder="Search user or method..." style={{ background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '6px 10px', outline: 'none', flex: 1, minWidth: '150px' }} />
              {['all','pending','approved','rejected'].map(f => (
                <button key={f} onClick={() => setWithdrawalFilter(f)} style={{ padding: '6px 12px', background: withdrawalFilter === f ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {withdrawals.filter(w => {
                  const matchFilter = withdrawalFilter === 'all' || w.status === withdrawalFilter;
                  const matchSearch = !withdrawalSearch || (w.user?.firstName + ' ' + w.user?.lastName + ' ' + w.user?.email + ' ' + w.method).toLowerCase().includes(withdrawalSearch.toLowerCase());
                  return matchFilter && matchSearch;
                }).map((w, i) => (
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
          </div>
        )}

        {/* KYC */}
        {tab === 'kyc' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'ID Type', 'Status', 'Date', 'Docs', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {kyc.map((k, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{k.firstName} {k.lastName}</td>
                    <td style={tdStyle}>{k.email}</td>
                    <td style={tdStyle}>{k.kycData?.idType || '---'}</td>
                    <td style={{ ...tdStyle, color: k.kycStatus === 'approved' ? '#22c55e' : k.kycStatus === 'submitted' ? '#f59e0b' : '#ef4444' }}>{k.kycStatus}</td>
                    <td style={tdStyle}>{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {k.kycData?.idFront && <a href={'https://vertextradepro.onrender.com' + k.kycData.idFront} target="_blank" style={{ ...btnStyle('#6366f1'), textDecoration: 'none', display: 'inline-block' }}>Front</a>}
                      {k.kycData?.idBack && <a href={'https://vertextradepro.onrender.com' + k.kycData.idBack} target="_blank" style={{ ...btnStyle('#6366f1'), textDecoration: 'none', display: 'inline-block' }}>Back</a>}
                      {k.kycData?.selfie && <a href={'https://vertextradepro.onrender.com' + k.kycData.selfie} target="_blank" style={{ ...btnStyle('#818cf8'), textDecoration: 'none', display: 'inline-block' }}>Selfie</a>}
                    </td>
                    <td style={tdStyle}>
                      {(k.kycStatus === 'submitted' || k.kycStatus === 'pending') && <>
                        <button onClick={() => approveKyc(k._id, 'approved')} style={btnStyle('#22c55e')}>Approve</button>
                        <button onClick={() => approveKyc(k._id, 'rejected')} style={btnStyle('#ef4444')}>Reject</button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Trades */}
        {tab === 'trades' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Symbol', 'Type', 'Amount', 'Duration', 'Result', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{t.user?.firstName} {t.user?.lastName}<br/><span style={{ color: 'rgba(255,255,255,0.4)' }}>{t.user?.email}</span></td>
                    <td style={tdStyle}>{t.symbol}</td>
                    <td style={{ ...tdStyle, color: t.type === 'buy' ? '#22c55e' : '#ef4444', textTransform: 'capitalize' }}>{t.type}</td>
                    <td style={tdStyle}>${t.amount?.toFixed(2)}</td>
                    <td style={tdStyle}>{t.duration}</td>
                    <td style={{ ...tdStyle, color: t.result > 0 ? '#22c55e' : t.result < 0 ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{t.result > 0 ? '+' : ''}${Math.abs(t.result || 0).toFixed(2)}</td>
                    <td style={{ ...tdStyle, color: t.status === 'closed' ? '#9ca3af' : t.status === 'active' ? '#22c55e' : '#818cf8', textTransform: 'capitalize' }}>{t.status}</td>
                    <td style={tdStyle}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <select value={tradeEdit[t._id]?.outcome ?? ''} onChange={e => {
                            const outcome = e.target.value;
                            const profit = outcome === 'win' ? Math.abs(t.amount) : outcome === 'loss' ? -Math.abs(t.amount) : 0;
                            setTradeEdit(p => ({ ...p, [t._id]: { ...p[t._id], outcome, result: profit, status: outcome ? "closed" : p[t._id]?.status } }));
                          }} style={{ background: tradeEdit[t._id]?.outcome === 'win' ? '#166534' : tradeEdit[t._id]?.outcome === 'loss' ? '#7f1d1d' : '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px', cursor: 'pointer' }}>
                            <option value="">Outcome</option>
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                          </select>
                          <input placeholder="$ profit/loss" type="number" value={tradeEdit[t._id]?.result ?? ''} onChange={e => setTradeEdit(p => ({ ...p, [t._id]: { ...p[t._id], result: e.target.value } }))} style={{ width: '65px', background: '#374151', border: 'none', color: tradeEdit[t._id]?.outcome === 'win' ? '#22c55e' : '#ef4444', fontSize: '7px', padding: '3px 5px' }} />
                          <select value={tradeEdit[t._id]?.status ?? t.status} onChange={e => setTradeEdit(p => ({ ...p, [t._id]: { ...p[t._id], status: e.target.value } }))} style={{ background: '#374151', border: 'none', color: 'white', fontSize: '7px', padding: '3px' }}>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => updateTrade(t._id)} style={btnStyle('#6366f1')}>Save</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div onClick={() => setEmailModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e2538', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '380px', borderRadius: '4px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>
                {emailTarget ? `Email to ${emailTarget.firstName} ${emailTarget.lastName}` : 'Bulk Email - All Users'}
              </span>
              <button onClick={() => setEmailModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            {emailTarget && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginBottom: '12px' }}>To: {emailTarget.email}</div>}
            {!emailTarget && <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', padding: '8px', marginBottom: '12px', color: '#818cf8', fontSize: '8px' }}>⚠️ This will send email to ALL {users.length} users</div>}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Subject</label>
              <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email subject..." style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Message</label>
              <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="Type your message..." rows={5} style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '8px 10px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            {emailSuccess && <div style={{ color: '#22c55e', fontSize: '9px', marginBottom: '10px' }}>{emailSuccess}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEmailModal(false)} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSendEmail} disabled={emailSending} style={{ flex: 1, padding: '9px', background: emailSending ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: emailSending ? 'not-allowed' : 'pointer' }}>
                {emailSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e2538', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '4px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedUser.avatar ? (
                  <img src={'https://vertextradepro.onrender.com' + selectedUser.avatar} alt="avatar"
                    onClick={() => setProofImage('https://vertextradepro.onrender.com' + selectedUser.avatar)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1', cursor: 'pointer' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white' }}>
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </div>
                )}
                <div>
                  <div style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>{selectedUser.firstName} {selectedUser.lastName}</div>
                  {selectedUser.avatar && <div onClick={() => setProofImage('https://vertextradepro.onrender.com' + selectedUser.avatar)} style={{ color: '#6366f1', fontSize: '7px', cursor: 'pointer', marginTop: '2px' }}>View full photo</div>}
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {/* Profile Info */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Profile</div>
                {[
                  ['Email', selectedUser.email],
                  ['Phone', selectedUser.phone || '---'],
                  ['Country', selectedUser.country || '---'],
                  ['KYC Status', selectedUser.kycStatus],
                  ['Account Type', selectedUser.accountType],
                  ['Referral Code', selectedUser.referralCode],
                  ['Status', selectedUser.isBlocked ? 'Blocked' : 'Active'],
                  ['Joined', new Date(selectedUser.createdAt).toLocaleDateString()],
                ].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>{k}</span>
                    <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Stats */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Financials</div>
                {[
                  ['Balance', '$' + (selectedUser.balance?.toFixed(2) || '0.00')],
                  ['Total Deposits', '$' + (selectedUser.totalDeposits?.toFixed(2) || '0.00')],
                  ['Total Withdrawals', '$' + (selectedUser.totalWithdrawals?.toFixed(2) || '0.00')],
                  ['Total Profit', '$' + (selectedUser.totalProfit?.toFixed(2) || '0.00')],
                  ['Total Referrals', selectedUser.totalReferrals || 0],
                ].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>{k}</span>
                    <span style={{ color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Admin message */}
              {selectedUser.adminMessage && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', padding: '8px', marginBottom: '14px' }}>
                  <div style={{ color: '#f59e0b', fontSize: '7px', fontWeight: '700', marginBottom: '4px' }}>Admin Message</div>
                  <div style={{ color: 'white', fontSize: '8px' }}>{selectedUser.adminMessage}</div>
                </div>
              )}
              <button onClick={() => setSelectedUser(null)} style={{ width: '100%', padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Image Modal */}
      {proofImage && (
        <>
          <div onClick={() => setProofImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
              <button onClick={() => setProofImage(null)} style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>×</button>
              <img src={proofImage} alt="Payment Proof" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', border: '2px solid rgba(255,255,255,0.2)' }} />
              <a href={proofImage} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#6366f1', fontSize: '11px' }}>Open in new tab</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
