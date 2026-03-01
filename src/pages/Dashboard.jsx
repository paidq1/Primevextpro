import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { User, LayoutDashboard, Wallet, Bot, Package, BarChart2, Lock, RefreshCw, CreditCard, TrendingUp, ArrowDownCircle, Clock, DollarSign, Menu, Users, Settings } from 'lucide-react';

// stats defined inside component using real data

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
  const { user, logout } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [amount, setAmount] = useState('100.00');
  const [activeNav, setActiveNav] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getDashboard().then(data => setDashData(data));
  }, []);

  const u = dashData?.user || user || {};
  const stats = [
    { label: 'Total Deposits', value: '+ USD ' + (u.totalDeposits || 0).toFixed(2), btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#6366f1', icon: <CreditCard size={14} color="#6366f1" /> },
    { label: 'Account Balance', value: 'USD ' + (u.balance || 0).toFixed(2), btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#818cf8', icon: <Wallet size={14} color="#6366f1" /> },
    { label: 'Total Profit', value: '+ USD ' + (u.totalProfit || 0).toFixed(2), btc: 'BTC: 0.00', iconBg: '#f59e0b', borderColor: '#f59e0b', icon: <TrendingUp size={14} color="#f59e0b" /> },
    { label: 'Total Referrals', value: '+ USD ' + (u.totalReferrals || 0).toFixed(2), btc: 'BTC: 0.00', iconBg: '#22c55e', borderColor: '#22c55e', icon: <Users size={14} color="#22c55e" /> },
    { label: 'Total Withdrawals', value: 'USD ' + (u.totalWithdrawals || 0).toFixed(2), btc: 'BTC: 0.00', iconBg: '#ec4899', borderColor: '#ec4899', icon: <ArrowDownCircle size={14} color="#ec4899" /> },
    { label: 'Total Packages', value: '+ USD 0.00', btc: '0.0', iconBg: '#6366f1', borderColor: '#a78bfa', icon: <Package size={14} color="#6366f1" />, hasViewTrade: true },
  ];
  const [tradeAccount, setTradeAccount] = useState('---');
  const [tradeMarket, setTradeMarket] = useState('---');
  const [tradeSymbol, setTradeSymbol] = useState('BTC/USD');
  const [tradeDuration, setTradeDuration] = useState('---');
  const [tradeLeverage, setTradeLeverage] = useState('1x (No Leverage)');
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [tradeType, setTradeType] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', display: 'flex', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Trade Success Modal */}
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

      {/* Icon Sidebar */}
      <div style={{ width: '48px', background: '#141824', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '4px', flexShrink: 0, visibility: sidebarOpen ? 'hidden' : 'visible' }}>
        <div style={{ width: '22px', height: '22px', marginBottom: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, maxWidth: '100%' }}>

        {/* Top Nav */}
        <div style={{ background: '#141824', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginRight: '4px', display: 'flex', alignItems: 'center' }}>
            <Menu size={15}/>
          </button>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => navigate('/dashboard/packages')} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>{u.plan?.toUpperCase() || 'STARTER'}</button>
            <button style={{ padding: '4px 10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>{u.currency || 'USD'}</button>
            <button onClick={() => navigate('/dashboard/kyc')} style={{ padding: '4px 10px', background: u.kycStatus === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.15)', border: 'none', color: u.kycStatus === 'approved' ? '#22c55e' : 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>KYC {u.kycStatus === 'approved' ? '✓' : ''}</button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={9}/> {u.accountType?.toUpperCase() || 'REAL'} ACCOUNT</button>
            <button onClick={() => getDashboard().then(data => setDashData(data))} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: '#22c55e', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={9}/> ${(u.balance || 0).toFixed(2)}</button>
            <button onClick={() => navigate('/dashboard/profile')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0 }}>{u.avatar ? <img src={'https://primevextpro.onrender.com' + u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /> : null}<User size={13} style={{ display: u.avatar ? 'none' : 'block' }}/></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left Panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <svg viewBox='0 0 40 40' fill='none' style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
                <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
                <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
              </svg>
              <span style={{ color: '#6366f1', fontSize: '9px', fontWeight: '800' }}>PRIMEVEST PRO</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginLeft: '4px' }}>| {u.firstName || ''} {u.lastName || ''}</span>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: '#252d3d', border: '1px solid ' + s.borderColor + '80', padding: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px' }}>{s.label}</span>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.iconBg + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                  </div>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '9px', marginBottom: '6px' }}>{s.value}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ background: s.label === 'Total Withdrawals' ? '#ec4899' : '#ef4444', color: 'white', fontSize: '6px', padding: '1px 3px' }}>{s.label === 'Total Withdrawals' ? '-$0.00' : '$0.00'}</span>
                      <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: '6px', padding: '1px 3px' }}>{s.btc}</span>
                    </div>
                    {s.hasViewTrade && <button onClick={() => navigate('/dashboard/packages')} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ marginBottom: '12px', border: '1px solid rgba(99,102,241,0.5)', overflow: 'hidden', background: '#252d3d', height: '220px' }}>
              <iframe
                src="https://s.tradingview.com/widgetembed/?symbol=BINANCE%3ABTCUSDT&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=252d3d&studies=%5B%5D&theme=dark&style=3&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=0&locale=en&hide_top_toolbar=0&hide_legend=0&hide_volume=1&scale=1&bgcolor=%23252d3d&gridcolor=rgba(255%2C255%2C255%2C0.04)"
                style={{ width: '238%', height: '530px', border: 'none', display: 'block', transform: 'scale(0.42)', transformOrigin: 'top left', marginBottom: '-145px' }}
                allowTransparency={true}
                scrolling="no"
                title="BTC/USD Chart"
              />
            </div>

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
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
                  <input style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '90px' }} />
                </div>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px' }}>
                  {['Amount','Txn Date','Method','Txn Type','Status'].map((h, i) => (
                    <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', fontWeight: '600' }}>{h}</span>
                  ))}
                </div>
                <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing 0 to 0 of 0 entries</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Trade Assets */}
          <div style={{ width: '155px', background: 'transparent', borderLeft: 'none', padding: '10px', overflowY: 'auto', flexShrink: 0, paddingTop: '34px' }}>
            <div style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.4)', padding: '10px', height: 'fit-content' }}><div style={{ color: 'white', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '14px' }}>TRADE ASSETS</div>
            {[
              { label: 'Account', val: tradeAccount, set: setTradeAccount, options: ['---','Real Account','Demo Account'] },
              { label: 'Markets', val: tradeMarket, set: setTradeMarket, options: ['---','Crypto','Forex','Stocks','Commodities'] },
              { label: 'Symbol', val: tradeSymbol, set: setTradeSymbol, options: ['BTC/USD','ETH/USD','XRP/USD','SOL/USD','BNB/USD','EUR/USD','GBP/USD'] },
              { label: 'Duration', val: tradeDuration, set: setTradeDuration, options: ['---','30 seconds','1 minute','5 minutes','15 minutes','30 minutes','1 hour'], hasIcon: true },
              { label: 'Leverage', val: tradeLeverage, set: setTradeLeverage, options: ['1x (No Leverage)','2x','5x','10x','20x','50x','100x'] },
            ].map((field, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
                  {field.label}{field.hasIcon && <Clock size={9} color="#f59e0b"/>}
                </label>
                <select value={field.val} onChange={e => field.set(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '5px 7px', outline: 'none' }}>
                  {field.options.map((o, j) => <option key={j}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}><DollarSign size={9}/> Amount</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '5px 7px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ color: '#ef4444', fontSize: '7px', marginBottom: '6px', minHeight: '12px' }}>{tradeError}</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => {
                if (tradeAccount === '---') { setTradeError('Select account'); return; }
                if (tradeMarket === '---') { setTradeError('Select market'); return; }
                if (tradeDuration === '---') { setTradeError('Select duration'); return; }
                if (!amount || Number(amount) < 10) { setTradeError('Min amount $10'); return; }
                setTradeError(''); setTradeType('Buy'); setTradeSuccess(true);
              }} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Buy</button>
              <button onClick={() => {
                if (tradeAccount === '---') { setTradeError('Select account'); return; }
                if (tradeMarket === '---') { setTradeError('Select market'); return; }
                if (tradeDuration === '---') { setTradeError('Select duration'); return; }
                if (!amount || Number(amount) < 10) { setTradeError('Min amount $10'); return; }
                setTradeError(''); setTradeType('Sell'); setTradeSuccess(true);
              }} style={{ flex: 1, padding: '8px', background: '#ef4444', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Sell</button>
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
