import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol, formatAmountWithCode } from '../utils/currency';
import { getDashboard, getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import BTCChart from '../components/BTCChart';
import CryptoNews from '../components/CryptoNews';
import { User, LayoutDashboard, Wallet, Bot, Package, BarChart2, Lock, RefreshCw, CreditCard, TrendingUp, ArrowDownCircle, Clock, DollarSign, Menu, Users, Settings } from 'lucide-react';

const navItems = [
  { icon: <User size={12} />, label: 'Profile', route: '/dashboard/profile' },
  { icon: <LayoutDashboard size={12} />, label: 'Dashboard', route: '/dashboard' },
  { icon: <Wallet size={12} />, label: 'Deposit', route: '/dashboard/withdraw-deposit' },
  { icon: <Bot size={12} />, label: 'Bots', route: '/dashboard/bot-transactions' },
  { icon: <Package size={12} />, label: 'Packages', route: '/dashboard/packages' },
  { icon: <BarChart2 size={12} />, label: 'Market', route: '/dashboard/live-market' },
  { icon: <TrendingUp size={12} />, label: 'Trading', route: '/dashboard/live-trading' },
  { icon: <Users size={12} />, label: 'Referrals', route: '/dashboard/refer-users' },
  { icon: <Settings size={12} />, label: 'KYC', route: '/dashboard/kyc' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('100.00');
  const [activeNav, setActiveNav] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [tradeAccount, setTradeAccount] = useState('---');
  const [tradeMarket, setTradeMarket] = useState('---');
  const [tradeSymbol, setTradeSymbol] = useState('BTC/USD');
  const [tradeDuration, setTradeDuration] = useState('---');
  const [tradeLeverage, setTradeLeverage] = useState('1x (No Leverage)');
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [tradeType, setTradeType] = useState('');

  useEffect(() => {
    getDashboard().then(data => setDashData(data));
    getTransactions().then(data => Array.isArray(data) ? setTransactions(data) : setTransactions([]));
  }, []);

  const u = dashData?.user || user || {};
  const stats = [
    { label: 'Total Deposits', value: '+ ' + formatAmountWithCode(u.totalDeposits || 0, u.currency), btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#6366f1', icon: <CreditCard size={14} color="#6366f1" /> },
    { label: 'Account Balance', value: formatAmountWithCode(u.balance || 0, u.currency), btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#818cf8', icon: <Wallet size={14} color="#6366f1" /> },
    { label: 'Total Profit', value: '+ ' + formatAmountWithCode(u.totalProfit || 0, u.currency), btc: 'BTC: 0.00', iconBg: '#f59e0b', borderColor: '#f59e0b', icon: <TrendingUp size={14} color="#f59e0b" /> },
    { label: 'Total Referrals', value: '+ ' + formatAmountWithCode(u.totalReferrals || 0, u.currency), btc: 'BTC: 0.00', iconBg: '#22c55e', borderColor: '#22c55e', icon: <Users size={14} color="#22c55e" /> },
    { label: 'Total Withdrawals', value: formatAmountWithCode(u.totalWithdrawals || 0, u.currency), btc: 'BTC: 0.00', iconBg: '#ec4899', borderColor: '#ec4899', icon: <ArrowDownCircle size={14} color="#ec4899" /> },
    { label: 'Total Packages', value: '+ ' + formatAmountWithCode(u.totalPackages || 0, u.currency), btc: '0.0', iconBg: '#6366f1', borderColor: '#a78bfa', icon: <Package size={14} color="#6366f1" />, hasViewTrade: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', display: 'flex', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {tradeSuccess && (
        <>
          <div onClick={() => setTradeSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Placed!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>{tradeType} order submitted successfully.</div>
            <button onClick={() => setTradeSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}



      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top Nav */}
        <div style={{ background: '#141824', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '26px', height: '26px', flexShrink: 0 }}>
              <svg viewBox='0 0 40 40' fill='none' style={{ width: '26px', height: '26px' }}>
                <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
                <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
                <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
              </svg>
            </div>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0' }}>
              <Menu size={16}/>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#f59e0b', fontSize: '10px' }}>₿</span>
              <span style={{ color: 'white', fontSize: '10px', fontWeight: '600' }}>{formatAmount(u.balance || 0, u.currency)}</span>
            </div>
            <button onClick={() => navigate('/dashboard/live-trading')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <RefreshCw size={9}/> Trade
            </button>
            <div onClick={() => navigate('/dashboard/profile')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4b5563', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',  }}>
              {u.avatar ? <img src={u.avatar} style={{ width: '26px', height: '26px', objectFit: 'cover' }} /> : <User size={13} color="white" />}
            </div>
          </div>
        </div>

        {u.adminMessage && showNotice && (
          <div style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#c0392b', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', minWidth: '260px', maxWidth: '320px' }}>
            <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span style={{ flex: 1 }}>{u.adminMessage}</span>
            {u.isAdmin && <button onClick={() => navigate('/admin')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: 'white', cursor: 'pointer', fontSize: '7px', padding: '2px 6px', marginRight: '4px' }}>Admin</button>}
            <button onClick={() => setShowNotice(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px', padding: 0 }}>×</button>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', minWidth: 0 }}>


            {/* Horizontally Scrollable Stat Cards */}
            <div style={{ overflowX: 'auto', marginBottom: '12px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: '#252d3d', border: '1px solid ' + s.borderColor + '80', padding: '12px', minWidth: '140px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px' }}>{s.label}</span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.iconBg + '40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                    </div>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>{s.value}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 3px' }}>{s.label === 'Total Withdrawals' ? '-' + getCurrencySymbol(u.currency) + '0.00' : getCurrencySymbol(u.currency) + '0.00'}</span>
                        <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: '6px', padding: '1px 3px' }}>BTC: 0.00</span>
                      </div>
                      {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div onClick={() => navigate('/dashboard/withdraw-deposit')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <div style={{ background: '#f43f5e', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={22} color="white" /></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '8px', fontWeight: '500' }}>Deposit</span>
              </div>
              <div onClick={() => navigate('/dashboard/withdraw')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <div style={{ background: '#22d3ee', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowDownCircle size={22} color="white" style={{ transform: 'rotate(180deg)' }} /></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '8px', fontWeight: '500' }}>Withdraw</span>
              </div>
              <div onClick={() => navigate('/dashboard/investment-records')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <div style={{ background: '#4ade80', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={22} color="white" /></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '8px', fontWeight: '500' }}>Earnings</span>
              </div>
              <div onClick={() => navigate('/dashboard/transaction-history')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <div style={{ background: '#fbbf24', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={22} color="white" /></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '8px', fontWeight: '500' }}>Transactions</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: '#252d3d', border: '1px solid ' + s.borderColor + '80', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px' }}>{s.label}</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.iconBg + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                  </div>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '11px', marginBottom: '5px' }}>{s.value}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 3px' }}>{s.label === 'Total Withdrawals' ? '-' + getCurrencySymbol(u.currency) + '0.00' : getCurrencySymbol(u.currency) + '0.00'}</span>
                      <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: '6px', padding: '1px 3px' }}>{s.btc}</span>
                    </div>
                    {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                  </div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <BTCChart />
            {/* Transaction List */}
            <div style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.5)', padding: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: 'white', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em' }}>TRANSACTION LIST</span>
                <select style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none' }}>
                  <option>Today</option><option>This Week</option><option>This Month</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
                  <select style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}><option>10</option><option>25</option><option>50</option></select>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
                  <input style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '90px' }} />
                </div>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px' }}>
                  {['Amount','Txn Date','Method','Txn Type','Status'].map((h, i) => (
                    <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600' }}>{h}</span>
                  ))}
                </div>
                {transactions.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
                ) : transactions.slice(0, 10).map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: t.type === 'withdrawal' ? '#ef4444' : '#22c55e', fontSize: '8px', fontWeight: '700' }}>{t.type === 'withdrawal' ? '-' : '+'}{formatAmount(t.amount || 0, u.currency)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', textTransform: 'capitalize' }}>{t.method || '---'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', textTransform: 'capitalize' }}>{t.type}</span>
                    <span style={{ fontSize: '7px', color: t.status === 'approved' ? '#22c55e' : t.status === 'pending' ? '#f59e0b' : '#ef4444', textTransform: 'capitalize' }}>{t.status}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {Math.min(transactions.length, 10)} of {transactions.length} entries</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
                  </div>
                </div>
              </div>
            </div>

            
          </div>


        </div>
      <CryptoNews />
      </div>
    </div>
  );
}
