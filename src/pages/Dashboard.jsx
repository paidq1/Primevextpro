import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol, formatAmountWithCode } from '../utils/currency';
import { getDashboard, getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import BTCChart from '../components/BTCChart';
import CryptoNews from '../components/CryptoNews';
import { User, Wallet, RefreshCw, CreditCard, TrendingUp, ArrowDownCircle, Clock, DollarSign, Menu, Users, Package, Bot, BarChart2, Settings, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    getDashboard().then(data => setDashData(data));
    getTransactions().then(data => Array.isArray(data) ? setTransactions(data) : setTransactions([]));
  }, []);

  const u = dashData?.user || user || {};
  const stats = [
    { label: 'Total Deposits', value: '+ ' + formatAmountWithCode(u.totalDeposits || 0, u.currency), iconBg: '#6366f1', borderColor: '#6366f1', icon: <CreditCard size={14} color="#6366f1" /> },
    { label: 'Account Balance', value: formatAmountWithCode(u.balance || 0, u.currency), iconBg: '#6366f1', borderColor: '#818cf8', icon: <Wallet size={14} color="#6366f1" /> },
    { label: 'Total Profit', value: '+ ' + formatAmountWithCode(u.totalProfit || 0, u.currency), iconBg: '#f59e0b', borderColor: '#f59e0b', icon: <TrendingUp size={14} color="#f59e0b" /> },
    { label: 'Total Referrals', value: '+ ' + formatAmountWithCode(u.totalReferrals || 0, u.currency), iconBg: '#22c55e', borderColor: '#22c55e', icon: <Users size={14} color="#22c55e" /> },
    { label: 'Total Withdrawals', value: formatAmountWithCode(u.totalWithdrawals || 0, u.currency), iconBg: '#ec4899', borderColor: '#ec4899', icon: <ArrowDownCircle size={14} color="#ec4899" /> },
    { label: 'Total Packages', value: '+ ' + formatAmountWithCode(u.totalPackages || 0, u.currency), iconBg: '#6366f1', borderColor: '#a78bfa', icon: <Package size={14} color="#6366f1" />, hasViewTrade: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#1a2035', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top Nav - exactly like reference */}
      <div style={{ background: '#141824', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '24px', height: '24px', flexShrink: 0 }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '0', display: 'flex' }}>
            <Menu size={20}/>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#f59e0b', fontSize: '13px' }}>₿</span>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{formatAmount(u.balance || 0, u.currency)}</span>
          </div>
          <button onClick={() => navigate('/dashboard/live-trading')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <RefreshCw size={11}/> Trade
          </button>
          <div onClick={() => navigate('/dashboard/profile')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4b5563', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {u.avatar ? <img src={u.avatar} style={{ width: '32px', height: '32px', objectFit: 'cover' }} /> : <User size={16} color="white" />}
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      {u.adminMessage && showNotice && (
        <div style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#c0392b', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', minWidth: '260px', maxWidth: '320px' }}>
          <span style={{ flex: 1 }}>{u.adminMessage}</span>
          {u.isAdmin && <button onClick={() => navigate('/admin')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: 'white', cursor: 'pointer', fontSize: '7px', padding: '2px 6px' }}>Admin</button>}
          <button onClick={() => setShowNotice(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', padding: 0 }}>×</button>
        </div>
      )}

      {/* Main scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>

        {/* Horizontally Scrollable Stat Cards */}
        <div style={{ overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: '#252d3d', border: '1px solid ' + s.borderColor + '60', padding: '12px 14px', minWidth: '150px', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px' }}>{s.label}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.iconBg + '30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                </div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>{s.value}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 4px' }}>{getCurrencySymbol(u.currency)}0.00</span>
                    <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '6px', padding: '1px 4px' }}>BTC: 0.00</span>
                  </div>
                  {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons - exactly like reference */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { label: 'Deposit', color: '#ef4444', icon: <Wallet size={20} color="white" />, route: '/dashboard/withdraw-deposit' },
            { label: 'Withdraw', color: '#06b6d4', icon: <ArrowDownCircle size={20} color="white" style={{ transform: 'rotate(180deg)' }} />, route: '/dashboard/withdraw' },
            { label: 'Earnings', color: '#22c55e', icon: <DollarSign size={20} color="white" />, route: '/dashboard/investment-records' },
            { label: 'Transactions', color: '#f59e0b', icon: <Clock size={20} color="white" />, route: '/dashboard/transaction-history' },
          ].map((btn, i) => (
            <div key={i} onClick={() => navigate(btn.route)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <div style={{ background: btn.color, width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn.icon}</div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '9px', fontWeight: '500', textAlign: 'center' }}>{btn.label}</span>
            </div>
          ))}
        </div>

        {/* Stats Grid 2x3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#252d3d', border: '1px solid ' + s.borderColor + '60', padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px' }}>{s.label}</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.iconBg + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
              </div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '12px', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 3px' }}>{s.label === 'Total Withdrawals' ? '-' : ''}{getCurrencySymbol(u.currency)}0.00</span>
                  <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '6px', padding: '1px 3px' }}>BTC: 0.00</span>
                </div>
                {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <BTCChart />

        {/* Transaction List */}
        <div style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.4)', padding: '10px', marginTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em' }}>TRANSACTION LIST</span>
            <select style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none' }}>
              <option>Today</option><option>This Week</option><option>This Month</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Show</span>
              <select style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 4px', outline: 'none' }}><option>10</option><option>25</option><option>50</option></select>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>entries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Search:</span>
              <input style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 6px', outline: 'none', width: '80px' }} />
            </div>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '6px 8px' }}>
              {['Amount','Txn Date','Method','Txn Type','Status'].map((h, i) => (
                <span key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontWeight: '600' }}>{h}</span>
              ))}
            </div>
            {transactions.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
            ) : transactions.slice(0, 10).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: t.type === 'withdrawal' ? '#ef4444' : '#22c55e', fontSize: '8px', fontWeight: '700' }}>{t.type === 'withdrawal' ? '-' : '+'}{formatAmount(t.amount || 0, u.currency)}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', textTransform: 'capitalize' }}>{t.method || '---'}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', textTransform: 'capitalize' }}>{t.type}</span>
                <span style={{ fontSize: '7px', color: t.status === 'approved' ? '#22c55e' : t.status === 'pending' ? '#f59e0b' : '#ef4444', textTransform: 'capitalize' }}>{t.status}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Showing {Math.min(transactions.length, 10)} of {transactions.length} entries</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 7px', cursor: 'pointer' }}>&#8249;</button>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 7px', cursor: 'pointer' }}>&#8250;</button>
              </div>
            </div>
          </div>
        </div>

        <CryptoNews />
      </div>
    </div>
  );
}
