import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol, formatAmountWithCode } from '../utils/currency';
import { getDashboard, getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import BTCChart from '../components/BTCChart';
import CryptoNews from '../components/CryptoNews';
import DashboardTicker from '../components/DashboardTicker';
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


function TrendyStocks() {
  const [activeStock, setActiveStock] = useState('AAPL');
  const [period, setPeriod] = useState('1M');
  const chartRef = useRef(null);

  const stocks = [
    { label: 'Apple', symbol: 'NASDAQ:AAPL' },
    { label: 'Google', symbol: 'NASDAQ:GOOGL' },
    { label: 'Microsoft', symbol: 'NASDAQ:MSFT' },
    { label: 'RNDRUSDT', symbol: 'BINANCE:RNDRUSDT' },
  ];

  const periods = ['1D', '1M', '3M', '1Y', '5Y', 'All'];
  const periodMap = { '1D': 'D', '1M': '1M', '3M': '3M', '1Y': '12M', '5Y': '60M', 'All': 'ALL' };

  const activeSymbol = stocks.find(s => s.symbol.includes(activeStock))?.symbol || stocks[0].symbol;

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: activeSymbol,
      interval: period === '1D' ? '30' : period === '1M' ? 'D' : 'W',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '3',
      locale: 'en',
      backgroundColor: '#132035',
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      hide_legend: false,
      save_image: false,
      allow_symbol_change: false,
      price_scale_mode: 1,
      range: periodMap[period],
    });
    chartRef.current.appendChild(script);
  }, [activeStock, period]);

  return (
    <div style={{ background: '#132035', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Trendy Stock Markets</div>
        <button onClick={() => window.location.href='/dashboard/deposit-funds'} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Deposit</button>
      </div>

      {/* Stock Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
        {stocks.map(s => (
          <button key={s.symbol} onClick={() => setActiveStock(s.symbol.split(':')[1])}
            style={{ padding: '6px 14px', borderRadius: '8px', background: activeStock === s.symbol.split(':')[1] ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', color: activeStock === s.symbol.split(':')[1] ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: activeStock === s.symbol.split(':')[1] ? '700' : '400', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Period Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: '4px 10px', borderRadius: '6px', background: period === p ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', color: period === p ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: period === p ? '700' : '400', cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: '250px', position: 'relative' }}>
        <div ref={chartRef} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </div>
  );
}

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
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
    fetch('https://quantyrexs.onrender.com/api/notifications', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(r => r.json()).then(d => Array.isArray(d) ? setNotifications(d) : setNotifications([])).catch(() => {});
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
            <button onClick={() => setTradeSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', }}>Okay</button>
          </div>
        </>
      )}

      {/* Icon Sidebar */}
      <div style={{ width: 'clamp(36px, 8vw, 48px)', background: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.1)', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '4px', flexShrink: 0, display: sidebarOpen ? 'none' : 'flex' }}>
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
                      <button onClick={() => { const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]'); setNotifications(prev => prev.map(n => ({ ...n, unread: readIds.includes(String(n.id)) ? false : n.unread }))); setShowNotifications(!showNotifications); setShowProfileMenu(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '5px 8px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <svg width='18' height='18' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>
                        <span style={{ position: 'absolute', top: '2px', right: '4px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                      </button>
                      {showNotifications && (
                        <>
                          <div onClick={() => setShowNotifications(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                          <div style={{ position: 'absolute', top: '110%', right: 0, background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', zIndex: 999, minWidth: '260px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Notifications</span>
                              <span onClick={() => {
                                const ids = notifications.map(n => String(n.id));
                                const existing = JSON.parse(localStorage.getItem('readNotifications') || '[]');
                                localStorage.setItem('readNotifications', JSON.stringify([...new Set([...existing, ...ids])]));
                                setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                              }} style={{ color: '#6366f1', fontSize: '9px', cursor: 'pointer' }}>Mark all read</span>
                            </div>
                            {(notifications.length ? notifications.slice(0,5) : [
                              { id: 1, icon: '🔐', title: 'KYC Reminder', desc: 'Complete verification to unlock all features', time: new Date(), unread: true },
                            ]).map((n, i) => (
                              <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.unread ? 'rgba(99,102,241,0.08)' : 'transparent', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '16px' }}>{n.icon}</span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ color: 'white', fontSize: '10px', fontWeight: '600', marginBottom: '2px' }}>{n.title}</div>
                                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '2px' }}>{n.desc}</div>
                                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>{typeof n.time === 'string' && n.time.includes('ago') ? n.time : new Date(n.time).toLocaleDateString()}</div>
                                </div>
                                {n.unread && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' }} />}
                              
                            </div>
                            ))}
                            <div onClick={() => { navigate('/dashboard/notifications'); setShowNotifications(false); }} style={{ padding: '10px 16px', textAlign: 'center', color: '#6366f1', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.06)' }}>View All Notifications →</div>
                          </div>
                        </>
                      )}
                    </div>
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
                    <div onClick={() => { navigate('/dashboard/change-password'); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}
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

            <DashboardTicker />
            <div style={{ height: "10px" }}></div>
            {/* Welcome Card */}
            <div style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '14px 12px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Welcome back, {u.firstName || 'User'} {u.lastName || ''}!</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', marginBottom: '10px' }}>Your investment dashboard overview</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', marginBottom: '8px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60px', borderRadius: '50%', background: 'rgba(99,102,241,0.35)', filter: 'blur(45px)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                  <svg width='16' height='16' fill='none' stroke='rgba(255,255,255,0.6)' viewBox='0 0 24 24' strokeWidth='2'><rect x='2' y='5' width='20' height='14' rx='2'/><line x1='2' y1='10' x2='22' y2='10'/></svg>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: '600' }}>Account Balance</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '10px' }}>Your available funds</div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>{formatAmountWithCode(u.balance || 0, u.currency)}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px' }}>
                  <svg width='12' height='12' fill='none' stroke='rgba(255,255,255,0.6)' viewBox='0 0 24 24' strokeWidth='2'><polyline points='20 6 9 17 4 12'/></svg>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Available for Withdrawal</span>
                </div>
                <div style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }}>
                  <span style={{ background: u.kycStatus === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: u.kycStatus === 'approved' ? '#22c55e' : '#ef4444', fontSize: '9px', padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg width='10' height='10' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
                    {u.kycStatus === 'approved' ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => navigate('/dashboard/deposit')} style={{ flex: 1, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', padding: '7px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  <svg width='14' height='14' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='16'/><line x1='8' y1='12' x2='16' y2='12'/></svg>
                  Deposit
                </button>
                <button onClick={() => navigate('/dashboard/withdraw')} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '9px', fontWeight: '600', padding: '7px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width='14' height='14' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><line x1='7' y1='17' x2='17' y2='7'/><polyline points='7 7 17 7 17 17'/></svg>
                  Withdraw
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 10px', minHeight: '90px' }}>
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
                    {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', }}>View Trade</button>}
                  </div>
                </div>
              ))}
            </div>
            {/* Chart */}
            {/* Identity Verification Card */}
            {u.kycStatus !== 'approved' && (
              <div style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width='24' height='24' fill='none' stroke='#6366f1' viewBox='0 0 24 24' strokeWidth='2'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>
                </div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Identity Verification</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginBottom: '16px' }}>Complete verification to access all features</div>
                <button onClick={() => navigate('/dashboard/kyc')} style={{ width: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', padding: '12px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                  View Details
                  <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><polyline points='6 9 12 15 18 9'/></svg>
                </button>
              </div>
            )}

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
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', }}>&#8249;</button>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', }}>&#8250;</button>
                  </div>
                </div>
              </div>
            </div>

            
          </div>

        </div>

        {/* Quick Trade Banner */}
        <div style={{ padding: '0 12px 16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '12px', padding: '20px 16px', textAlign: 'center', }}>
            <svg width='28' height='28' fill='none' stroke='white' strokeWidth='2' viewBox='0 0 24 24' style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }}><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Quick Trade</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px' }}>Start a new trade instantly or explore investment plans.</div>
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
              }} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', }}>Buy</button>
              <button onClick={() => {
                if (tradeAccount === '---') { setTradeError('Select account'); return; }
                if (tradeMarket === '---') { setTradeError('Select market'); return; }
                if (tradeDuration === '---') { setTradeError('Select duration'); return; }
                if (!amount || Number(amount) < 10) { setTradeError('Min amount $10'); return; }
                setTradeError(''); setTradeType('Sell'); setTradeSuccess(true);
              }} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', }}>Sell</button>
            </div>
          </div>
        </div>
      <div style={{ padding: '0 12px' }}><TrendyStocks /></div>
      <CryptoNews />
      </div>
    </div>
  );
}
