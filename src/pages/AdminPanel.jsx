import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://vertextrades.onrender.com/api';
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
  const [emailType, setEmailType] = useState('custom');
  const [regFeeAmount, setRegFeeAmount] = useState('');
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
  const [resetLink, setResetLink] = useState('');
  const [userBots, setUserBots] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [userDetailTab, setUserDetailTab] = useState('info');
  const [profitAmount, setProfitAmount] = useState('');
  const [profitLoading, setProfitLoading] = useState(false);

  const addProfit = async (userId, userName) => {
    if (!profitAmount || isNaN(profitAmount)) { showMsg('Enter valid amount'); return; }
    setProfitLoading(true);
    const res = await api(`/users/${userId}/profit`, 'POST', { amount: profitAmount });
    if (res.success) {
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, balance: u.balance + parseFloat(profitAmount), totalProfit: (u.totalProfit||0) + parseFloat(profitAmount) } : u));
      logActivity('Profit added', `$${profitAmount} to ${userName}`);
      showMsg(res.message);
      setProfitAmount('');
    } else {
      showMsg(res.message || 'Failed');
    }
    setProfitLoading(false);
  };

  const loadUserDetails = async (u) => {
    setSelectedUser(u);
    setUserDetailTab('info');
    setUserBots([]);
    setUserInvestments([]);
    const [bots, investments] = await Promise.all([
      api(`/users/${u._id}/bots`),
      api(`/users/${u._id}/investments`)
    ]);
    setUserBots(Array.isArray(bots) ? bots : []);
    setUserInvestments(Array.isArray(investments) ? investments : []);
  };

  const generateResetLink = async (userId, userName) => {
    const res = await api(`/users/${userId}/reset-password`, 'POST');
    if (res.resetLink) {
      setResetLink(res.resetLink);
      logActivity('Reset link generated', userName);
    } else {
      showMsg(res.message || 'Failed to generate reset link');
    }
  };

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [depositPage, setDepositPage] = useState(1);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const PAGE_SIZE = 10;

  // Activity log
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [allBots, setAllBots] = useState([]);
  const [allStakes, setAllStakes] = useState([]);
  const [botSearch, setBotSearch] = useState('');
  const [botFilter, setBotFilter] = useState('all');
  const [stakeSearch, setStakeSearch] = useState('');
  const [stakeFilter, setStakeFilter] = useState('all');
  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminActivityLog') || '[]'); } catch { return []; }
  });
  const logActivity = (action, detail) => {
    const entry = { action, detail, time: new Date().toLocaleString() };
    setActivityLog(prev => {
      const updated = [entry, ...prev].slice(0, 100);
      localStorage.setItem('adminActivityLog', JSON.stringify(updated));
      return updated;
    });
  };

  // CSV Export
  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]).filter(k => !['__v','proofImage','bankDetails'].includes(k));
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const api = (path, method = 'GET', body) =>
    fetch(`${BASE_URL}/admin${path}`, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined }).then(r => r.json());

  useEffect(() => { api('/stats').then(setStats); }, []);

  useEffect(() => {
    if (tab === 'users') api('/users').then(setUsers);
    if (tab === 'deposits') api('/deposits').then(setDeposits);
    if (tab === 'withdrawals') api('/withdrawals').then(setWithdrawals);
    if (tab === 'kyc') api('/kyc').then(setKyc);
    if (tab === 'trades') api('/trades').then(setTrades);
    if (tab === 'contacts') fetch('https://vertextrades.onrender.com/api/chat/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(r => r.json()).then(d => setContacts(Array.isArray(d) ? d : []));
    if (tab === 'bots') api('/bots/all').then(d => setAllBots(Array.isArray(d) ? d : []));
    if (tab === 'stakes') api('/stakes/all').then(d => setAllStakes(Array.isArray(d) ? d : []));
  }, [tab]);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const updateDepositStatus = async (id, status) => {
    const res = await api(`/deposits/${id}`, 'PUT', { status });
    if (res.transaction || res.deposit) {
      setDeposits(prev => prev.map(d => d._id === id ? { ...d, status } : d));
      logActivity('Deposit ' + status, `ID: ${id.slice(-6)}`);
      showMsg('Deposit ' + status);
    }
  };

  const updateWithdrawalStatus = async (id, status) => {
    const res = await api(`/withdrawals/${id}`, 'PUT', { status });
    if (res.transaction || res.withdrawal) {
      setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status } : w));
      logActivity('Withdrawal ' + status, `ID: ${id.slice(-6)}`);
      showMsg('Withdrawal ' + status);
    }
  };

  const deleteDeposit = async (id) => {
    if (!window.confirm('Delete this deposit record?')) return;
    await api(`/deposits/${id}`, 'DELETE');
    setDeposits(prev => prev.filter(d => d._id !== id));
    showMsg('Deposit deleted');
  };

  const approveDeposit = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this deposit?`)) return;
    await api(`/deposits/${id}`, 'PUT', { status });
    api('/deposits').then(setDeposits);
    api('/stats').then(setStats);
    showMsg(`Deposit ${status}`);
  };

  const deleteWithdrawal = async (id) => {
    if (!window.confirm('Delete this withdrawal record?')) return;
    await api(`/withdrawals/${id}`, 'DELETE');
    setWithdrawals(prev => prev.filter(w => w._id !== id));
    showMsg('Withdrawal deleted');
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

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name || 'this user'} permanently?`)) return;
    await api(`/users/${id}`, 'DELETE');
    setUsers(prev => prev.filter(u => u._id !== id));
    logActivity('User deleted', name || id);
    showMsg('User deleted');
    setSelectedUser(null);
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

  const toggleWithdrawalBlock = async (id) => {
    await api(`/users/${id}/withdrawal-block`, 'PUT');
    api('/users').then(setUsers);
    showMsg('Withdrawal status updated');
  };

  const toggleAccountUpgrade = async (id) => {
    await api(`/users/${id}/account-upgrade`, 'PUT');
    api('/users').then(setUsers);
    showMsg('Account upgrade status updated');
  };

  const setWithdrawalCode = async (id, disable = false) => {
    if (disable) {
      await api(`/users/${id}/withdrawal-code`, 'PUT', { withdrawalCode: '', withdrawalCodeRequired: false });
      api('/users').then(setUsers);
      showMsg('Withdrawal code removed');
      return;
    }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    await api(`/users/${id}/withdrawal-code`, 'PUT', { withdrawalCode: code, withdrawalCodeRequired: true });
    api('/users').then(setUsers);
    showMsg('Withdrawal code generated and emailed: ' + code);
  };

  const sendUpgradePromo = async (id, email, name) => {
    await api(`/users/${id}/send-upgrade-promo`, 'POST');
    showMsg('Upgrade plans email sent to ' + email);
  };

  const sendWithdrawalCode = async (id, email, name) => {
    await api(`/users/${id}/send-withdrawal-code`, 'POST');
    showMsg('Withdrawal code sent to ' + email);
  };

  const setMinWithdrawal = async (id) => {
    const amount = window.prompt('Set minimum withdrawal amount:');
    if (!amount || isNaN(amount)) return;
    await api(`/users/${id}/minimum-withdrawal`, 'PUT', { minimumWithdrawal: parseFloat(amount) });
    api('/users').then(setUsers);
    showMsg('Minimum withdrawal updated');
  };

  const updateTrade = async (id) => {
    const t = tradeEdit[id];
    if (!t) return;
    await api(`/trades/${id}`, 'PUT', { result: parseFloat(t.result || 0), status: t.status || 'closed' });
    api('/trades').then(setTrades);
    showMsg('Trade updated');
  };

  const tabs = ['stats', 'users', 'deposits', 'withdrawals', 'kyc', 'trades', 'bots', 'stakes', 'activity', 'contacts'];
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

  const thStyle = { padding: '10px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap', background: '#0f1a2e' };
  const tdStyle = { padding: '10px 12px', fontSize: '11px', color: 'white', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap', verticalAlign: 'top' };
  const btnStyle = (color) => ({ padding: '6px 12px', background: color, border: 'none', color: 'white', fontSize: '11px', cursor: 'pointer', borderRadius: '0px', marginRight: '6px', marginBottom: '6px', display: 'inline-block' });

  const handleSendEmail = async () => {
    if (emailType === 'upgradePromo') {
      setEmailSending(true);
      try {
        if (emailTarget) {
          await api(`/users/${emailTarget._id}/send-upgrade-promo`, 'POST');
        } else {
          for (const u of users) {
            await api(`/users/${u._id}/send-upgrade-promo`, 'POST');
          }
        }
        setEmailSuccess('Upgrade plans email sent!');
        setTimeout(() => setEmailModal(false), 2000);
      } catch(e) { setMsg('Error sending email'); }
      setEmailSending(false);
      return;
    }
    if (emailType === 'registrationFee') {
      if (!regFeeAmount) { setMsg('Please enter registration fee amount'); return; }
      setEmailSending(true);
      try {
        if (emailTarget) {
          await api(`/users/${emailTarget._id}/send-registration-fee`, 'POST', { amount: regFeeAmount });
        } else {
          for (const u of users) {
            await api(`/users/${u._id}/send-registration-fee`, 'POST', { amount: regFeeAmount });
          }
        }
        setEmailSuccess('Registration fee email sent!');
        setTimeout(() => setEmailModal(false), 2000);
      } catch(e) { setMsg('Error sending email'); }
      setEmailSending(false);
      return;
    }
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
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Header */}
      <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'white', fontSize: '8px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>/ Admin Panel</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '9px', padding: '4px 10px', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={logout} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '9px', padding: '4px 10px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg && <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '8px', fontWeight: '600' }}>{msg}</div>}

      {/* Tabs */}
      <div style={{ background: '#132035', padding: '0 16px', display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', background: 'none', border: 'none', color: tab === t ? '#6366f1' : 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: '700', cursor: 'pointer', borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {/* Stats */}
        {tab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {statCards.map((s, i) => (
                <div key={i} style={{ background: '#1a2e4a', border: `1px solid ${s.color}40`, padding: '14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', marginBottom: '6px' }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: '8px', fontWeight: '700' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Deposits by status chart */}
            <div style={{ background: '#1a2e4a', padding: '14px', marginBottom: '12px' }}>
              <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '12px' }}>Deposits Overview</div>
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
                          <div style={{ color: col, fontSize: '9px', fontWeight: '700' }}>{v}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700' }}>${totalAmount.toFixed(0)}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Approved $</div>
                      </div>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '0', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: (approved/total*100) + '%', background: '#22c55e' }} />
                      <div style={{ width: (pending/total*100) + '%', background: '#f59e0b' }} />
                      <div style={{ width: (rejected/total*100) + '%', background: '#ef4444' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      {[['Approved', '#22c55e'], ['Pending', '#f59e0b'], ['Rejected', '#ef4444']].map(([l,c]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '8px', height: '8px', background: c, borderRadius: '0' }} />
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Withdrawals by status chart */}
            <div style={{ background: '#1a2e4a', padding: '14px', marginBottom: '12px' }}>
              <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '12px' }}>Withdrawals Overview</div>
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
                          <div style={{ color: col, fontSize: '9px', fontWeight: '700' }}>{v}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ec4899', fontSize: '9px', fontWeight: '700' }}>${totalAmount.toFixed(0)}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Approved $</div>
                      </div>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '0', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: (approved/total*100) + '%', background: '#22c55e' }} />
                      <div style={{ width: (pending/total*100) + '%', background: '#f59e0b' }} />
                      <div style={{ width: (rejected/total*100) + '%', background: '#ef4444' }} />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Users overview */}
            <div style={{ background: '#1a2e4a', padding: '14px' }}>
              <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '12px' }}>Users Overview</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[
                  ['Total', users.length, '#6366f1'],
                  ['Active', users.filter(u => !u.isBlocked).length, '#22c55e'],
                  ['Blocked', users.filter(u => u.isBlocked).length, '#ef4444'],
                  ['KYC Done', users.filter(u => u.kycStatus === 'approved').length, '#f59e0b'],
                ].map(([l,v,col]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ color: col, fontSize: '9px', fontWeight: '700' }}>{v}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</div>
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
              <input value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }} placeholder="Search by name or email..." style={{ flex: 1, background: "#374151", border: "none", color: "white", fontSize: "8px", padding: "6px 10px", outline: "none" }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "7px" }}>{users.filter(u => (u.firstName + " " + u.lastName + " " + u.email).toLowerCase().includes(userSearch.toLowerCase())).length} users</span>
              <button onClick={() => exportCSV(users, 'users.csv')} style={{ ...btnStyle('#22c55e'), whiteSpace: 'nowrap' }}>⬇ CSV</button>
              <button onClick={() => { setEmailTarget(null); setEmailModal(true); setEmailSuccess(''); }} style={{ ...btnStyle('#6366f1'), whiteSpace: 'nowrap' }}>📧 Email All</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'Balance', 'Stats', 'KYC', 'Account Status', 'Msg', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(() => { const filtered = users.filter(u => (u.firstName + " " + u.lastName + " " + u.email).toLowerCase().includes(userSearch.toLowerCase())); const paginated = filtered.slice((userPage-1)*PAGE_SIZE, userPage*PAGE_SIZE); return paginated; })().map((u, i) => (
                  <tr key={i} style={{ verticalAlign: "top" }}>
                    <td style={tdStyle}>{u.firstName} {u.lastName}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <input value={editBalance[u._id] ?? u.balance?.toFixed(2) ?? '0'} onChange={e => setEditBalance(b => ({ ...b, [u._id]: e.target.value }))} style={{ width: '100px', background: '#374151', border: 'none', color: 'white', fontSize: '12px', padding: '5px 8px' }} />
                        <button onClick={() => updateBalance(u._id)} style={btnStyle('#6366f1')}>Set</button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {[["totalDeposits","Deposits"],["totalWithdrawals","Withdrawals"],["totalProfit","Profit"],["totalReferrals","Referrals"],["totalPackages","Packages"]].map(([field, label]) => (
                          <div key={field} style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", width: "70px" }}>{label}:</span>
                            <input type="number" placeholder={u[field]?.toFixed(2) ?? "0"} value={editStats[u._id]?.[field] ?? ""} onChange={e => setEditStats(p => ({ ...p, [u._id]: { ...p[u._id], [field]: e.target.value } }))} style={{ width: "80px", background: "#374151", border: "none", color: "white", fontSize: "10px", padding: "4px 6px" }} />
                          </div>
                        ))}
                        <button onClick={() => updateUserStats(u._id)} style={{ ...btnStyle("#22c55e"), marginTop: "3px" }}>Update</button>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: u.kycStatus === 'approved' ? '#22c55e' : u.kycStatus === 'submitted' ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}>{u.kycStatus || 'none'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: '700', background: u.isBlocked ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: u.isBlocked ? '#ef4444' : '#22c55e' }}>
                          {u.isBlocked ? '🔒 Blocked' : '✅ Active'}
                        </span>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: '700', background: u.accountUpgraded ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: u.accountUpgraded ? '#22c55e' : '#ef4444' }}>
                          {u.accountUpgraded ? '⬆ Upgraded' : '⬆ Not Upgraded'}
                        </span>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: '700', background: u.withdrawalBlocked ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: u.withdrawalBlocked ? '#ef4444' : '#22c55e' }}>
                          {u.withdrawalBlocked ? '💸 W.Blocked' : '💸 W.Allowed'}
                        </span>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: '700', background: u.withdrawalCodeRequired ? 'rgba(167,139,250,0.2)' : 'rgba(100,116,139,0.2)', color: u.withdrawalCodeRequired ? '#a78bfa' : '#64748b' }}>
                          {u.withdrawalCodeRequired ? '🔑 Code On' : '🔑 Code Off'}
                        </span>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', background: 'rgba(14,165,233,0.2)', color: '#0ea5e9' }}>
                          Min: ${u.minimumWithdrawal || 100}
                        </span>
                        <span style={{ padding: '4px 8px', borderRadius: '0px', fontSize: '10px', background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>
                          Plan: {u.currentPlan && u.currentPlan !== 'none' ? u.currentPlan : 'None'}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: u.isBlocked ? '#ef4444' : '#22c55e' }}>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>{u.adminMessage && <span style={{ color: "#f59e0b", fontSize: "6px", maxWidth: "140px", wordBreak: "break-word", whiteSpace: "normal" }}>Current: {u.adminMessage}</span>}<div style={{ display: "flex", gap: "2px" }}>
                        <input value={msgInput[u._id] || ''} onChange={e => setMsgInput(m => ({ ...m, [u._id]: e.target.value }))} placeholder="Message..." style={{ width: '140px', background: '#374151', border: 'none', color: 'white', fontSize: '8px', padding: '3px 4px' }} />
                        <button onClick={() => sendMessage(u._id)} style={btnStyle('#f59e0b')}>Send</button>
                        <button onClick={() => deleteMessage(u._id)} style={btnStyle("#ef4444")}>Del Msg</button>
                      </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => loadUserDetails(u)} style={btnStyle('#818cf8')}>View</button>
                      <button onClick={() => { setEmailTarget(u); setEmailModal(true); setEmailSuccess(''); }} style={btnStyle('#6366f1')}>Email</button>
                      <button onClick={() => toggleBlock(u._id)} style={btnStyle(u.isBlocked ? '#22c55e' : '#ef4444')}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
                      <button onClick={() => toggleWithdrawalBlock(u._id)} style={btnStyle(u.withdrawalBlocked ? '#22c55e' : '#f97316')}>{u.withdrawalBlocked ? 'Allow W.' : 'Block W.'}</button>
                      <button onClick={() => toggleAccountUpgrade(u._id)} style={btnStyle(u.accountUpgraded ? '#ef4444' : '#22c55e')}>{u.accountUpgraded ? 'Revoke Up.' : 'Approve Up.'}</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* User Pagination */}
            {(() => {
              const filtered = users.filter(u => (u.firstName + " " + u.lastName + " " + u.email).toLowerCase().includes(userSearch.toLowerCase()));
              const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
              if (totalPages <= 1) return null;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', marginTop: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {userPage} of {totalPages} ({filtered.length} users)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => setUserPage(p => Math.max(1, p-1))} disabled={userPage === 1} style={{ ...btnStyle('#374151'), opacity: userPage === 1 ? 0.4 : 1 }}>‹ Prev</button>
                    <button onClick={() => setUserPage(p => Math.min(totalPages, p+1))} disabled={userPage === totalPages} style={{ ...btnStyle('#374151'), opacity: userPage === totalPages ? 0.4 : 1 }}>Next ›</button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Deposits */}
        {tab === 'deposits' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Search user or method..." style={{ background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '6px 10px', outline: 'none', flex: 1, minWidth: '150px' }} />
              {['all','pending','approved','rejected'].map(f => (
                <button key={f} onClick={() => setDepositFilter(f)} style={{ padding: '6px 12px', background: depositFilter === f ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '8px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
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
                      <button onClick={() => deleteDeposit(d._id)} style={btnStyle('#64748b')}>Delete</button>
                      {d.proofImage && <button onClick={() => setProofImage(d.proofImage)} style={btnStyle('#6366f1')}>View Proof</button>}
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
              <input value={withdrawalSearch} onChange={e => setWithdrawalSearch(e.target.value)} placeholder="Search user or method..." style={{ background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '6px 10px', outline: 'none', flex: 1, minWidth: '150px' }} />
              {['all','pending','approved','rejected'].map(f => (
                <button key={f} onClick={() => setWithdrawalFilter(f)} style={{ padding: '6px 12px', background: withdrawalFilter === f ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '8px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
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
                        <button onClick={() => deleteWithdrawal(w._id)} style={btnStyle('#64748b')}>Delete</button>
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
                          }} style={{ background: tradeEdit[t._id]?.outcome === 'win' ? '#166534' : tradeEdit[t._id]?.outcome === 'loss' ? '#7f1d1d' : '#374151', border: 'none', color: 'white', fontSize: '8px', padding: '3px', cursor: 'pointer' }}>
                            <option value="">Outcome</option>
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                          </select>
                          <input placeholder="$ profit/loss" type="number" value={tradeEdit[t._id]?.result ?? ''} onChange={e => setTradeEdit(p => ({ ...p, [t._id]: { ...p[t._id], result: e.target.value } }))} style={{ width: '65px', background: '#374151', border: 'none', color: tradeEdit[t._id]?.outcome === 'win' ? '#22c55e' : '#ef4444', fontSize: '8px', padding: '3px 5px' }} />
                          <select value={tradeEdit[t._id]?.status ?? t.status} onChange={e => setTradeEdit(p => ({ ...p, [t._id]: { ...p[t._id], status: e.target.value } }))} style={{ background: '#374151', border: 'none', color: 'white', fontSize: '8px', padding: '3px' }}>
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

        {/* Bots */}
        {tab === 'bots' && (
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input placeholder="Search user or bot..." onChange={e => setBotSearch(e.target.value)} style={{ flex: 1, background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '6px 10px', outline: 'none' }} />
              {['all','active','completed','cancelled'].map(f => (
                <button key={f} onClick={() => setBotFilter(f)} style={{ padding: '5px 10px', background: botFilter===f?'#6366f1':'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
            {allBots.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>No bots found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['User', 'Bot', 'Amount', 'Daily Rate', 'Earned', 'Status', 'Expires', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {allBots.filter(b => {
                    const matchFilter = botFilter === 'all' || b.status === botFilter;
                    const matchSearch = !botSearch || (b.user?.firstName + ' ' + b.user?.lastName + ' ' + b.user?.email + ' ' + b.botName).toLowerCase().includes(botSearch.toLowerCase());
                    return matchFilter && matchSearch;
                  }).map((b, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{b.user?.firstName} {b.user?.lastName}<br/><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{b.user?.email}</span></td>
                      <td style={{ ...tdStyle, color: '#6366f1', fontWeight: '700' }}>{b.botName}</td>
                      <td style={tdStyle}>${(b.amount||0).toLocaleString()}</td>
                      <td style={{ ...tdStyle, color: '#22c55e' }}>{b.dailyRate}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input defaultValue={(b.earned||0).toFixed(2)} id={`bot-earned-${b._id}`} style={{ width: '65px', background: '#374151', border: 'none', color: '#f59e0b', fontSize: '8px', padding: '3px 5px' }} />
                          <button onClick={() => {
                            const val = document.getElementById(`bot-earned-${b._id}`).value;
                            api(`/bots/${b._id}/earned`, 'PUT', { earned: parseFloat(val) }).then(() => api('/bots/all').then(d => setAllBots(Array.isArray(d)?d:[])));
                          }} style={btnStyle('#f59e0b')}>Set</button>
                        </div>
                      </td>
                      <td style={{ ...tdStyle }}><span style={{ background: b.status==='active'?'rgba(34,197,94,0.1)':'rgba(99,102,241,0.1)', color: b.status==='active'?'#22c55e':'#6366f1', padding: '2px 6px', fontSize: '7px' }}>{b.status}</span></td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.4)' }}>{b.expiresAt ? new Date(b.expiresAt).toLocaleDateString() : '-'}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {b.status === 'active' && (
                            <button onClick={() => api(`/bots/${b._id}/cancel`, 'PUT').then(() => api('/bots/all').then(d => setAllBots(Array.isArray(d)?d:[])))}
                              style={btnStyle('#ef4444')}>Cancel</button>
                          )}
                          <button onClick={() => api(`/bots/${b._id}`, 'DELETE').then(() => setAllBots(prev => prev.filter(x => x._id !== b._id)))}
                            style={btnStyle('#6b7280')}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Stakes */}
        {tab === 'stakes' && (
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input placeholder="Search user or plan..." onChange={e => setStakeSearch(e.target.value)} style={{ flex: 1, background: '#2a3347', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '6px 10px', outline: 'none' }} />
              {['all','active','completed','cancelled'].map(f => (
                <button key={f} onClick={() => setStakeFilter(f)} style={{ padding: '5px 10px', background: stakeFilter===f?'#6366f1':'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
            {allStakes.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>No stakes found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['User', 'Plan', 'Amount', 'APY', 'Earned', 'Status', 'Expires', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {allStakes.filter(s => {
                    const matchFilter = stakeFilter === 'all' || s.status === stakeFilter;
                    const matchSearch = !stakeSearch || (s.user?.firstName + ' ' + s.user?.lastName + ' ' + s.user?.email + ' ' + s.plan).toLowerCase().includes(stakeSearch.toLowerCase());
                    return matchFilter && matchSearch;
                  }).map((s, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{s.user?.firstName} {s.user?.lastName}<br/><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{s.user?.email}</span></td>
                      <td style={{ ...tdStyle, color: '#6366f1', fontWeight: '700' }}>{s.plan}</td>
                      <td style={tdStyle}>${(s.amount||0).toLocaleString()}</td>
                      <td style={{ ...tdStyle, color: '#22c55e' }}>{s.apy}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input defaultValue={(s.earned||0).toFixed(4)} id={`stake-earned-${s._id}`} style={{ width: '70px', background: '#374151', border: 'none', color: '#f59e0b', fontSize: '8px', padding: '3px 5px' }} />
                          <button onClick={() => {
                            const val = document.getElementById(`stake-earned-${s._id}`).value;
                            api(`/stakes/${s._id}/earned`, 'PUT', { earned: parseFloat(val) }).then(() => api('/stakes/all').then(d => setAllStakes(Array.isArray(d)?d:[])));
                          }} style={btnStyle('#f59e0b')}>Set</button>
                        </div>
                      </td>
                      <td style={{ ...tdStyle }}><span style={{ background: s.status==='active'?'rgba(34,197,94,0.1)':'rgba(99,102,241,0.1)', color: s.status==='active'?'#22c55e':'#6366f1', padding: '2px 6px', fontSize: '7px' }}>{s.status}</span></td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.4)' }}>{s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '-'}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {s.status === 'active' && (
                            <button onClick={() => api(`/stakes/${s._id}/cancel`, 'PUT').then(() => api('/stakes/all').then(d => setAllStakes(Array.isArray(d)?d:[])))}
                              style={btnStyle('#ef4444')}>Cancel</button>
                          )}
                          <button onClick={() => api(`/stakes/${s._id}`, 'DELETE').then(() => setAllStakes(prev => prev.filter(x => x._id !== s._id)))}
                            style={btnStyle('#6b7280')}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Contacts */}
        {tab === 'contacts' && (
          <div style={{ padding: '12px', display: 'flex', gap: '12px', height: '500px' }}>
            <div style={{ width: '200px', flexShrink: 0, overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '8px' }}>
              <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '8px' }}>Conversations ({contacts.length})</div>
              {contacts.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>No chats yet</div>}
              {contacts.map((c, i) => (
                <div key={i} onClick={() => setSelectedChat(c)} style={{ padding: '8px', marginBottom: '4px', background: selectedChat?._id === c._id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', border: selectedChat?._id === c._id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent', cursor: 'pointer', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{c.name || c.email || 'User'}</span>
                    {c.unreadAdmin > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '7px', padding: '1px 4px', borderRadius: '8px' }}>{c.unreadAdmin}</span>}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginTop: '2px' }}>{c.messages?.length || 0} messages</div>
                  <div style={{ color: c.status === 'open' ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: '7px' }}>{c.status}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!selectedChat ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Select a conversation</div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>{selectedChat.name || selectedChat.email}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginLeft: '8px' }}>{selectedChat.email}</span>
                    </div>
                    {selectedChat.status === 'open' && (
                      <button onClick={async () => {
                        await fetch(`https://vertextrades.onrender.com/api/chat/resolve/${selectedChat._id}`, {
                          method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        fetch('https://vertextrades.onrender.com/api/chat/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(r => r.json()).then(d => setContacts(Array.isArray(d) ? d : []));
                        setSelectedChat(prev => ({ ...prev, status: 'resolved' }));
                      }} style={{ background: '#22c55e', border: 'none', color: 'white', fontSize: '7px', padding: '3px 8px', cursor: 'pointer', borderRadius: '3px' }}>Mark Resolved</button>
                    )}
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', background: '#151c27', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                    {selectedChat.messages?.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ background: msg.sender === 'admin' ? '#6366f1' : '#2d3748', color: 'white', fontSize: '8px', padding: '6px 10px', borderRadius: '6px', maxWidth: '70%', lineHeight: '1.4' }}>
                          {msg.text}
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginTop: '2px' }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedChat.status === 'open' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input value={adminReply || ''} onChange={e => setAdminReply(e.target.value)}
                        onKeyDown={async e => {
                          if (e.key === 'Enter' && adminReply?.trim()) {
                            const res = await fetch(`https://vertextrades.onrender.com/api/chat/reply/${selectedChat._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ text: adminReply }) });
                            const data = await res.json();
                            setSelectedChat(data);
                            setAdminReply('');
                          }
                        }}
                        placeholder="Type reply and press Enter..." style={{ flex: 1, background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '6px 8px', outline: 'none', borderRadius: '4px' }}
                      />
                      <button onClick={async () => {
                        if (!adminReply?.trim()) return;
                        const res = await fetch(`https://vertextrades.onrender.com/api/chat/reply/${selectedChat._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ text: adminReply }) });
                        const data = await res.json();
                        setSelectedChat(data);
                        setAdminReply('');
                      }} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Send</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Activity Log */}
        {tab === 'activity' && (
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'white', fontSize: '8px', fontWeight: '700' }}>Activity Log</span>
              <button onClick={() => { setActivityLog([]); localStorage.removeItem('adminActivityLog'); }} style={{ ...btnStyle('#ef4444') }}>Clear Log</button>
            </div>
            {activityLog.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>No activity recorded yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Action', 'Detail', 'Time'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {activityLog.map((log, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, color: log.action.includes('approved') ? '#22c55e' : log.action.includes('rejected') ? '#ef4444' : '#6366f1', fontWeight: '600' }}>{log.action}</td>
                      <td style={tdStyle}>{log.detail}</td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.4)' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Reset Link Modal */}
      {resetLink && (
        <div onClick={() => setResetLink('')} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a2e4a', border: '1px solid #6366f1', width: '100%', maxWidth: '400px', padding: '20px', borderRadius: '0' }}>
            <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', marginBottom: '12px' }}>🔗 Password Reset Link</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', marginBottom: '10px' }}>Copy this link and send it manually to the user. Valid for 1 hour.</p>
            <div style={{ background: '#0e1628', padding: '10px', fontSize: '8px', color: '#6366f1', wordBreak: 'break-all', marginBottom: '12px', border: '1px solid rgba(99,102,241,0.3)' }}>{resetLink}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { navigator.clipboard.writeText(resetLink); showMsg('Link copied!'); }} style={{ ...btnStyle('#6366f1'), flex: 1 }}>Copy Link</button>
              <button onClick={() => setResetLink('')} style={{ ...btnStyle('#374151'), flex: 1 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div onClick={() => setEmailModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '380px', borderRadius: '0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>
                {emailTarget ? `Email to ${emailTarget.firstName} ${emailTarget.lastName}` : 'Bulk Email - All Users'}
              </span>
              <button onClick={() => setEmailModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            {emailTarget && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '12px' }}>To: {emailTarget.email}</div>}
            {!emailTarget && <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', padding: '8px', marginBottom: '12px', color: '#818cf8', fontSize: '9px' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" style={{marginRight:"6px",verticalAlign:"middle"}}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>This will send email to ALL {users.length} users</div>}
            {/* Email Type Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { value: 'custom', label: '✏️ Custom Message' },
                  { value: 'upgradePromo', label: '⬆️ Send Upgrade Plans' },
                  { value: 'registrationFee', label: '💳 Registration Fee' },
                  { value: 'adminMessage', label: '📢 Admin Announcement' },
                ].map(opt => (
                  <div key={opt.value} onClick={() => setEmailType(opt.value)} style={{ padding: '10px 12px', background: emailType === opt.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${emailType === opt.value ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', color: emailType === opt.value ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: emailType === opt.value ? '600' : '400' }}>
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>

            {emailType === 'upgradePromo' && (
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '12px', marginBottom: '14px', color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: '1.6' }}>
                Sends a detailed email showing all 6 upgrade plans with prices, ROI and features.
              </div>
            )}

            {emailType === 'registrationFee' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Registration Fee Amount ($)</label>
                <input value={regFeeAmount} onChange={e => setRegFeeAmount(e.target.value)} placeholder="e.g. 250" style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}

            {(emailType === 'custom' || emailType === 'adminMessage') && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Subject</label>
                  <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email subject..." style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Message</label>
                  <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="Type your message..." rows={5} style={{ width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', padding: '8px 10px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </>
            )}
            {emailSuccess && <div style={{ color: '#22c55e', fontSize: '8px', marginBottom: '10px' }}>{emailSuccess}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEmailModal(false)} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSendEmail} disabled={emailSending} style={{ flex: 1, padding: '9px', background: emailSending ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: emailSending ? 'not-allowed' : 'pointer' }}>
                {emailSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '0' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt="avatar" onClick={() => setProofImage(selectedUser.avatar)} style={{ width: '40px', height: '40px', borderRadius: '0', objectFit: 'cover', border: '2px solid #6366f1', cursor: 'pointer' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '0', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: 'white' }}>
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </div>
                )}
                <div>
                  <div style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>{selectedUser.firstName} {selectedUser.lastName}</div>
                  {selectedUser.avatar && <div onClick={() => setProofImage(selectedUser.avatar)} style={{ color: '#6366f1', fontSize: '8px', cursor: 'pointer', marginTop: '2px' }}>View full photo</div>}
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
              {['info', 'bots', 'investments', 'profit'].map(t => (
                <button key={t} onClick={() => setUserDetailTab(t)} style={{ padding: '5px 12px', background: userDetailTab === t ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer', textTransform: 'capitalize', fontWeight: userDetailTab === t ? '700' : '400' }}>{t}</button>
              ))}
              <button onClick={() => deleteUser(selectedUser._id, selectedUser.firstName + ' ' + selectedUser.lastName)} style={{ padding: '5px 12px', background: '#7f1d1d', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer', marginLeft: 'auto' }}>Delete</button>
            </div>

            {/* Info Tab */}
            {userDetailTab === 'info' && (
              <div style={{ padding: '14px 16px' }}>
                {selectedUser.adminMessage && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', padding: '8px', marginBottom: '14px' }}>
                    <div style={{ color: '#f59e0b', fontSize: '8px', fontWeight: '700', marginBottom: '4px' }}>Admin Message</div>
                    <div style={{ color: 'white', fontSize: '9px' }}>{selectedUser.adminMessage}</div>
                  </div>
                )}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Profile</div>
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
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px' }}>{k}</span>
                      <span style={{ color: 'white', fontSize: '9px', fontWeight: '600' }}>{v}</span>
                    </div>
                  ))}
                </div>
                {/* Advanced Controls */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Advanced Controls</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Plan Upgrade */}
                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px', padding: '10px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '8px' }}>
                        Current Plan: <strong style={{ color: selectedUser.currentPlan && selectedUser.currentPlan !== 'none' ? '#22c55e' : '#64748b' }}>{selectedUser.currentPlan && selectedUser.currentPlan !== 'none' ? selectedUser.currentPlan : 'No Plan'}</strong>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ELITE'].map(plan => (
                          <button key={plan} onClick={async () => {
                            await api(`/users/${selectedUser._id}/plan`, 'PUT', { plan });
                            setSelectedUser({ ...selectedUser, currentPlan: plan });
                            showMsg(`User upgraded to ${plan} — email sent!`);
                          }} style={{ ...btnStyle(selectedUser.currentPlan === plan ? '#22c55e' : '#4b5563'), fontSize: '7px', opacity: selectedUser.currentPlan === plan ? 1 : 0.7 }}>
                            {selectedUser.currentPlan === plan ? '✓ ' : ''}{plan}
                          </button>
                        ))}
                        <button onClick={async () => {
                          await api(`/users/${selectedUser._id}/plan`, 'PUT', { plan: 'none' });
                          setSelectedUser({ ...selectedUser, currentPlan: 'none' });
                          showMsg('Plan removed');
                        }} style={{ ...btnStyle('#64748b'), fontSize: '7px' }}>Remove Plan</button>
                      </div>
                    </div>

                    {/* Withdrawal Code */}
                    <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '6px', padding: '10px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '6px' }}>
                        Withdrawal Code: <strong style={{ color: selectedUser.withdrawalCodeRequired ? '#a78bfa' : '#64748b' }}>{selectedUser.withdrawalCodeRequired ? '🔑 Active' : '🔑 Not Set'}</strong>
                      </div>
                      {selectedUser.withdrawalCode && (
                        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '4px', padding: '8px', marginBottom: '8px', textAlign: 'center' }}>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Current Code</div>
                          <div style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '800', letterSpacing: '4px' }}>{selectedUser.withdrawalCode}</div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => { setWithdrawalCode(selectedUser._id); setSelectedUser(null); }} style={btnStyle('#a78bfa')}>{selectedUser.withdrawalCodeRequired ? 'Generate New Code' : 'Generate Code'}</button>
                        {selectedUser.withdrawalCodeRequired && <button onClick={() => { setWithdrawalCode(selectedUser._id, true); setSelectedUser(null); }} style={btnStyle('#64748b')}>Remove Code</button>}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginTop: '6px' }}>Code will be emailed to user when you click Send Code below</div>
                    </div>

                    {/* Send Code Button */}
                    {selectedUser.withdrawalCodeRequired && (
                      <button onClick={() => { sendWithdrawalCode(selectedUser._id, selectedUser.email, selectedUser.firstName); setSelectedUser(null); }} style={{ ...btnStyle('#6366f1'), width: '100%', padding: '8px' }}>
                        📧 Send Code to {selectedUser.email}
                      </button>
                    )}

                    {/* Min Withdrawal */}
                    <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '6px', padding: '10px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '6px' }}>
                        Min Withdrawal: <strong style={{ color: '#0ea5e9' }}>${selectedUser.minimumWithdrawal || 100}</strong>
                      </div>
                      <button onClick={() => { setMinWithdrawal(selectedUser._id); setSelectedUser(null); }} style={btnStyle('#0ea5e9')}>Change Min Withdrawal</button>
                    </div>

                    {/* Delete */}
                    <button onClick={() => deleteUser(selectedUser._id)} style={{ ...btnStyle('#ef4444'), width: '100%', padding: '8px' }}>
                      🗑 Delete User Account
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Financials</div>
                  {[
                    ['Balance', '$' + (selectedUser.balance?.toFixed(2) || '0.00')],
                    ['Total Deposits', '$' + (selectedUser.totalDeposits?.toFixed(2) || '0.00')],
                    ['Total Withdrawals', '$' + (selectedUser.totalWithdrawals?.toFixed(2) || '0.00')],
                    ['Total Profit', '$' + (selectedUser.totalProfit?.toFixed(2) || '0.00')],
                    ['Total Referrals', selectedUser.totalReferrals || 0],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px' }}>{k}</span>
                      <span style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSelectedUser(null)} style={{ width: '100%', padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>Close</button>
              </div>
            )}

            {/* Bots Tab */}
            {userDetailTab === 'bots' && (
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '10px' }}>Bot Subscriptions ({userBots.length})</div>
                {userBots.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', padding: '20px', textAlign: 'center' }}>No bots subscribed</div>
                ) : userBots.map((b, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', marginBottom: '6px', borderLeft: '2px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{b.botName}</span>
                      <span style={{ color: b.status === 'active' ? '#22c55e' : '#9ca3af', fontSize: '8px' }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Invested: <span style={{ color: 'white' }}>${b.amount?.toLocaleString()}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Earned: <span style={{ color: '#f59e0b' }}>${(b.earned||0).toFixed(2)}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Rate: <span style={{ color: '#22c55e' }}>{b.dailyRate}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Investments Tab */}
            {userDetailTab === 'investments' && (
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '10px' }}>Investment Packages ({userInvestments.length})</div>
                {userInvestments.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', padding: '20px', textAlign: 'center' }}>No investments</div>
                ) : userInvestments.map((inv, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', marginBottom: '6px', borderLeft: '2px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '8px', fontWeight: '700' }}>{inv.plan}</span>
                      <span style={{ color: '#22c55e', fontSize: '8px' }}>{inv.roi}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Amount: <span style={{ color: 'white' }}>${inv.amount?.toLocaleString()}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profit Tab */}
            {userDetailTab === 'profit' && (
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '10px' }}>Manual Profit Credit</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>Current Balance</span>
                    <span style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>${selectedUser.balance?.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>Total Profit</span>
                    <span style={{ color: '#f59e0b', fontSize: '9px', fontWeight: '700' }}>${selectedUser.totalProfit?.toFixed(2) || '0.00'}</span>
                  </div>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', display: 'block', marginBottom: '6px' }}>Amount to Credit ($)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" value={profitAmount} onChange={e => setProfitAmount(e.target.value)} placeholder="Enter amount" style={{ flex: 1, background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '8px 10px', outline: 'none' }} />
                    <button onClick={() => addProfit(selectedUser._id, selectedUser.firstName)} disabled={profitLoading} style={{ ...btnStyle('#22c55e'), padding: '8px 16px' }}>{profitLoading ? '...' : 'Credit'}</button>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>This will add to both balance and total profit.</p>
              </div>
            )}

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
              <a href={proofImage} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#6366f1', fontSize: '9px' }}>Open in new tab</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
