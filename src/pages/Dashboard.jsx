import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol, formatAmountWithCode } from '../utils/currency';
import { getDashboard, getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import BTCChart from '../components/BTCChart';
import CryptoNews from '../components/CryptoNews';
import { User, LayoutDashboard, Wallet, Bot, Package, BarChart2, Lock, RefreshCw, CreditCard, TrendingUp, ArrowDownCircle, Clock, DollarSign, Menu, Users, Settings, LogOut } from 'lucide-react';

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)', display: 'flex', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {tradeSuccess && (
        <>
          <div onClick={() => setTradeSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '10px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Trade Placed!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>{tradeType} order submitted successfully.</div>
            <button onClick={() => setTradeSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}

      {/* Icon Sidebar */}
      <div style={{ width: 'clamp(36px, 8vw, 48px)', background: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '4px', flexShrink: 0, visibility: sidebarOpen ? 'hidden' : 'visible' }}>
        <div style={{ width: '22px', height: '22px', marginBottom: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0F172A' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0F172A' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
        </div>
        {navItems.map((item, i) => (
          <button key={i} onClick={() => { setActiveNav(i); navigate(item.route); }} title={item.label}
            style={{ width: '34px', height: '34px', background: activeNav === i ? '#6366f1' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeNav === i ? 'white' : 'rgba(255,255,255,0.4)' }}>
            {item.icon}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top Nav */}
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, borderBottom: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 4px 24px rgba(99,102,241,0.15), 0 1px 0 rgba(255,255,255,0.05) inset' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginRight: '4px', display: 'flex', alignItems: 'center' }}>
            <Menu size={15}/>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'stretch' }}>
            <button onClick={() => getDashboard().then(data => setDashData(data))} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}><span style={{ color: '#f7931a' }}>₿</span> {u.balance ? formatAmount(u.balance, u.currency) : '0.00'}</button>
            <button onClick={() => navigate('/dashboard/live-trading')} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #6366f1', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}><RefreshCw size={11}/> Trade</button>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)', padding: '0 12px', cursor: 'pointer', height: '100%' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#5b6477', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {u.avatar ? <img src={u.avatar} style={{ width: '34px', height: '34px', objectFit: 'cover' }} /> : <User size={18} color="white" />}
                </div>
              </div>
              {showProfileMenu && (
                <>
                  <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', zIndex: 999, minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                    <div onClick={() => { navigate('/dashboard/profile'); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <User size={14} /> My Account
                    </div>
                    <div onClick={() => { navigate('/dashboard/profile', { state: { tab: 'edit' } }); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <Settings size={14} /> Edit Account
                    </div>
                    <div onClick={() => { navigate('/forgot-password'); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <Lock size={14} /> Change Password
                    </div>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                    <div onClick={() => { logout(); navigate('/signin'); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: '#ef4444', fontSize: '11px' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <LogOut size={14} /> Logout
                    </div>
                  </div>
                </>
              )}
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <svg viewBox='0 0 40 40' fill='none' style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0F172A' stroke='#6366F1' strokeWidth='1.5'/>
                <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0F172A' stroke='#6366F1' strokeWidth='1.2'/>
                <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
              </svg>
              <span style={{ color: '#6366f1', fontSize: '9px', fontWeight: '800' }}>VERTEXTRADE PRO</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>| {u.firstName || ''} {u.lastName || ''}</span>
            </div>

            {/* Welcome Card - Premium */}
            <div style={{ background: 'linear-gradient(135deg, rgba(15,20,60,0.95) 0%, rgba(30,15,60,0.95) 50%, rgba(15,20,60,0.95) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '20px', padding: '16px 14px', marginBottom: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.08)', position: 'relative', overflow: 'hidden' }}>
              {/* Glow effects */}
              <div style={{ position: 'absolute', top: '-20px', left: '20%', width: '120px', height: '80px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', top: '-10px', right: '10%', width: '80px', height: '60px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px' }}>
                {/* LEFT SIDE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: '800', marginBottom: '2px', letterSpacing: '-0.3px' }}>Welcome back, {u.firstName || 'User'}! 👋</div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginBottom: '3px' }}>Account Balance</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: 'white', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', textShadow: '0 0 20px rgba(99,102,241,0.5)' }}>{formatAmountWithCode(u.balance || 0, u.currency)}</span>
                      <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: '700' }}>+0.00%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e', fontSize: '7px', padding: '3px 8px', borderRadius: '20px' }}>
                      ✅ {u.kycStatus === 'approved' ? 'KYC Verified' : 'KYC Unverified'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8', fontSize: '7px', padding: '3px 8px', borderRadius: '20px' }}>
                      💰 Available: {formatAmountWithCode(u.balance || 0, u.currency)}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '7px', marginBottom: '12px' }}>Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ago</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate('/dashboard/withdraw-deposit')} style={{ flex: 1, background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '9px 6px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxShadow: '0 4px 15px rgba(99,102,241,0.5)' }}>
                      <svg width='12' height='12' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='16'/><line x1='8' y1='12' x2='16' y2='12'/></svg>
                      Deposit
                    </button>
                    <button onClick={() => navigate('/dashboard/withdraw')} style={{ flex: 1, background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '9px 6px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxShadow: '0 4px 15px rgba(168,85,247,0.4)' }}>
                      <svg width='12' height='12' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><line x1='7' y1='17' x2='17' y2='7'/><polyline points='7 7 17 7 17 17'/></svg>
                      Withdraw
                    </button>
                  </div>
                </div>
                {/* RIGHT SIDE - Glowing Chart */}
                <div style={{ width: '95px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', minHeight: '100px' }}>
                    <svg viewBox='0 0 95 100' width='100%' height='100%' preserveAspectRatio='none'>
                      <defs>
                        <linearGradient id='cg1' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='0%' stopColor='#06b6d4' stopOpacity='0.4'/>
                          <stop offset='100%' stopColor='#06b6d4' stopOpacity='0'/>
                        </linearGradient>
                        <filter id='glow'>
                          <feGaussianBlur stdDeviation='2' result='coloredBlur'/>
                          <feMerge><feMergeNode in='coloredBlur'/><feMergeNode in='SourceGraphic'/></feMerge>
                        </filter>
                      </defs>
                      <path d='M0,85 C8,80 15,75 20,68 C28,58 32,62 38,55 C45,46 50,50 56,42 C63,33 68,37 74,28 C80,20 85,24 90,15 C92,12 93,13 95,10 L95,100 L0,100 Z' fill='url(#cg1)'/>
                      <path d='M0,85 C8,80 15,75 20,68 C28,58 32,62 38,55 C45,46 50,50 56,42 C63,33 68,37 74,28 C80,20 85,24 90,15 C92,12 93,13 95,10' fill='none' stroke='#06b6d4' strokeWidth='2' filter='url(#glow)'/>
                      <circle cx='95' cy='10' r='3' fill='#06b6d4' filter='url(#glow)'/>
                      {[0,20,40,60,80,95].map((x,i) => <line key={i} x1={x} y1='0' x2={x} y2='100' stroke='rgba(255,255,255,0.03)' strokeWidth='1'/>)}
                      {[25,50,75].map((y,i) => <line key={i} x1='0' y1={y} x2='95' y2={y} stroke='rgba(255,255,255,0.03)' strokeWidth='1'/>)}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '12px 10px', minHeight: '90px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(8px, 2vw, 11px)' }}>{s.label}</span>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.iconBg + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 10px ${s.iconBg}60` }}>{s.icon}</div>
                  </div>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(11px, 2.5vw, 16px)', marginBottom: '8px' }}>{s.value}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 3px' }}>{s.label === 'Total Withdrawals' ? '-' + getCurrencySymbol(u.currency) + '0.00' : getCurrencySymbol(u.currency) + '0.00'}</span>
                      <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: '6px', padding: '1px 3px' }}>{s.btc}</span>
                    </div>
                    {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                  </div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "12px" }}><BTCChart /></div>
            {/* Transaction List */}
            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: '20px' }}>
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

        {/* Trade Assets - Full Width */}
        <div style={{ padding: '0 12px 20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '12px' }}>TRADE ASSETS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              {[
                { label: 'Account', val: tradeAccount, set: setTradeAccount, options: ['---','Real Account','Demo Account'] },
                { label: 'Markets', val: tradeMarket, set: setTradeMarket, options: ['---','Crypto','Forex','Stocks','Commodities'] },
                { label: 'Symbol', val: tradeSymbol, set: setTradeSymbol, options: ['BTC/USD','ETH/USD','XRP/USD','SOL/USD','BNB/USD','EUR/USD','GBP/USD'] },
                { label: 'Duration', val: tradeDuration, set: setTradeDuration, options: ['---','30 seconds','1 minute','5 minutes','15 minutes','30 minutes','1 hour'], hasIcon: true },
                { label: 'Leverage', val: tradeLeverage, set: setTradeLeverage, options: ['1x (No Leverage)','2x','5x','10x','20x','50x','100x'] },
              ].map((field, i) => (
                <div key={i}>
                  <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
                    {field.label}{field.hasIcon && <Clock size={9} color="#f59e0b"/>}
                  </label>
                  <select value={field.val} onChange={e => field.set(e.target.value)} style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '6px 8px', outline: 'none' }}>
                    {field.options.map((o, j) => <option key={j}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}><DollarSign size={9}/> Amount</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '12px' }}>{tradeError}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => {
                if (tradeAccount === '---') { setTradeError('Select account'); return; }
                if (tradeMarket === '---') { setTradeError('Select market'); return; }
                if (tradeDuration === '---') { setTradeError('Select duration'); return; }
                if (!amount || Number(amount) < 10) { setTradeError('Min amount $10'); return; }
                setTradeError(''); setTradeType('Buy'); setTradeSuccess(true);
              }} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Buy</button>
              <button onClick={() => {
                if (tradeAccount === '---') { setTradeError('Select account'); return; }
                if (tradeMarket === '---') { setTradeError('Select market'); return; }
                if (tradeDuration === '---') { setTradeError('Select duration'); return; }
                if (!amount || Number(amount) < 10) { setTradeError('Min amount $10'); return; }
                setTradeError(''); setTradeType('Sell'); setTradeSuccess(true);
              }} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Sell</button>
            </div>
          </div>
        </div>
      <CryptoNews />
      </div>
    </div>
  );
}
