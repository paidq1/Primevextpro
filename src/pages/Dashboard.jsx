import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { User, LayoutDashboard, Wallet, Bot, Package, BarChart2, Upload, Users, Settings, Lock, RefreshCw, CreditCard, TrendingUp, ArrowDownCircle, Clock, DollarSign, Menu, X, ChevronRight, Globe } from 'lucide-react';

const stats = [
  { label: 'Total Deposits', value: '+ USD 0.00', btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#6366f1', icon: <CreditCard size={14} color="#6366f1" /> },
  { label: 'Account Balance', value: 'USD 0.00', btc: 'BTC: 0.00', iconBg: '#6366f1', borderColor: '#818cf8', icon: <Wallet size={14} color="#6366f1" /> },
  { label: 'Total Profit', value: '+ USD 0.00', btc: 'BTC: 0.00', iconBg: '#f59e0b', borderColor: '#f59e0b', icon: <TrendingUp size={14} color="#f59e0b" /> },
  { label: 'Total Referrals', value: '+ USD 0.00', btc: 'BTC: 0.00', iconBg: '#22c55e', borderColor: '#22c55e', icon: <Users size={14} color="#22c55e" /> },
  { label: 'Total Withdrawals', value: 'USD 0.00', btc: 'BTC: 0.00', iconBg: '#ec4899', borderColor: '#ec4899', icon: <ArrowDownCircle size={14} color="#ec4899" /> },
  { label: 'Total Packages', value: '+ USD 0.00', btc: '0.0', iconBg: '#6366f1', borderColor: '#a78bfa', icon: <Package size={14} color="#6366f1" />, hasViewTrade: true },
];

const navItems = [
  { icon: <User size={12} />, label: 'Profile', route: '/dashboard/profile' },
  { icon: <LayoutDashboard size={12} />, label: 'Dashboard', route: '/dashboard' },
  { icon: <Wallet size={12} />, label: 'Deposit', route: '/dashboard/withdraw-deposit' },
  { icon: <Bot size={12} />, label: 'Bots', route: '/dashboard/manage-bots' },
  { icon: <Package size={12} />, label: 'Packages', route: '/dashboard/packages' },
  { icon: <BarChart2 size={12} />, label: 'Market', route: '/dashboard/live-market' },
  { icon: <TrendingUp size={12} />, label: 'Trading', route: '/dashboard/live-trading' },
  { icon: <Users size={12} />, label: 'Referrals', route: '/dashboard/refer-users' },
  { icon: <Settings size={12} />, label: 'KYC', route: '/dashboard/kyc' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100.00');
  const [activeNav, setActiveNav] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('USD');
  const [accountType, setAccountType] = useState('REAL');
  const [balance, setBalance] = useState('0.00');

  const sidebarSections = [
    {
      title: 'DASHBOARD',
      items: [
        { icon: <User size={13}/>, label: 'Profile', route: '/dashboard/profile' },
        { icon: <BarChart2 size={13}/>, label: 'Live Market', badge: 'New', route: '/dashboard/live-market' },
        { icon: <Wallet size={13}/>, label: 'Stake', route: '/dashboard/stake' },
        { icon: <Bot size={13}/>, label: 'Manage Bots', badge: 'New', route: '/dashboard/live-market' },
      ]
    },
    {
      title: 'INVESTMENTS',
      items: [
        { icon: <BarChart2 size={13}/>, label: 'Investment records', route: '/dashboard/investment-records' },
        { icon: <Clock size={13}/>, label: 'Transaction history', route: '/dashboard/transaction-history' },
        { icon: <ArrowDownCircle size={13}/>, label: 'Withdraw / Deposit', route: '/dashboard/withdraw-deposit' },
        { icon: <TrendingUp size={13}/>, label: 'Live Trading', badge: 'New', route: '/dashboard/live-market' },
        { icon: <Package size={13}/>, label: 'Packages', route: '/dashboard/packages' },
        { icon: <Lock size={13}/>, label: 'KYC', route: '/dashboard/kyc' },
        { icon: <Users size={13}/>, label: 'Refer Users', route: '/dashboard/refer-users' },
      ]
    }
  ];

  const drawerJSX = (
    <>

      <div style={{
        position: 'fixed', top: 0, left: sidebarOpen ? '0px' : '-160px', height: '100vh', width: '160px',
        background: '#141824', zIndex: 50,
        transition: 'left 0.3s ease', display: 'flex', flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '18px' }}>
              <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
                <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
                <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
                <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={14}/>
          </button>
        </div>
        <div style={{ padding: '12px 0', flex: 1 }}>
          {sidebarSections.map((section, si) => (
            <div key={si} style={{ marginBottom: '16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', fontWeight: '700', letterSpacing: '0.1em', padding: '0 16px', marginBottom: '6px' }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <button key={ii} onClick={() => { if(item.route) { navigate(item.route); setSidebarOpen(false); } }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '9px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {item.badge && <span style={{ background: '#ef4444', color: 'white', fontSize: '6px', padding: '1px 4px', borderRadius: '2px', fontWeight: '700' }}>{item.badge}</span>}
                    {!item.badge && <ChevronRight size={10} color="rgba(255,255,255,0.2)"/>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={11} color="rgba(255,255,255,0.4)"/>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>EN ^</span>
        </div>
      </div>
    </>
  );
  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', display: 'flex', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ width: '48px', background: '#141824', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '4px', flexShrink: 0, visibility: sidebarOpen ? 'hidden' : 'visible' }}>
        <div style={{ width: '22px', height: '22px', marginBottom: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
        </div>
        {navItems.map((item, i) => (
          <button key={i} onClick={() => { setActiveNav(i); navigate(item.route); }} title={item.label} style={{ width: '34px', height: '34px', borderRadius: '0px', background: activeNav === i ? '#6366f1' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeNav === i ? 'white' : 'rgba(255,255,255,0.4)' }}>
            {item.icon}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: '#141824', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginRight: '4px', display: 'flex', alignItems: 'center' }}>
            <Menu size={15}/>
          </button>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[{label:'STARTER',active:false},{label:'USD',active:true},{label:'KYC',active:false}].map((tab, i) => (
              <button key={i} style={{ padding: '4px 10px', background: tab.active ? '#6366f1' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '0px', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>{tab.label}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px', color: 'white', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={9}/> {accountType} ACCOUNT</button>
            <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px', color: '#22c55e', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={9}/> $0.00</button>
            <button onClick={() => navigate('/dashboard/profile')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={13}/></button>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}><svg viewBox='0 0 40 40' fill='none' style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/><path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/><path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/></svg><span style={{ color: '#6366f1', fontSize: '9px', fontWeight: '800' }}>PRIMEVEST PRO</span></div>
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
                    {s.hasViewTrade && <button style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 4px', cursor: 'pointer' }}>View Trade</button>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '12px', border: '1px solid rgba(99,102,241,0.5)', overflow: 'hidden', background: '#252d3d', height: '220px' }}>
              <iframe
                src="https://s.tradingview.com/widgetembed/?symbol=BINANCE%3ABTCUSDT&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=252d3d&studies=%5B%5D&theme=dark&style=3&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=0&locale=en&hide_top_toolbar=0&hide_legend=0&hide_volume=1&scale=1&bgcolor=%23252d3d&gridcolor=rgba(255%2C255%2C255%2C0.04)"
                style={{ width: '238%', height: '530px', border: 'none', display: 'block', transform: 'scale(0.42)', transformOrigin: 'top left', marginBottom: '-145px' }}
                allowTransparency={true}
                scrolling="no"
                title="BTC/USD Chart"
              />
            </div>
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
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>‹</button>
                    <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>›</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '150px', background: '#1e2538', padding: '14px 12px', paddingTop: '14px', border: '1px solid rgba(99,102,241,0.3)', marginTop: '29px', marginRight: '8px', marginBottom: '8px', borderRadius: '2px', alignSelf: 'flex-start', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ color: 'white', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '14px' }}>TRADE ASSETS</div>
            {[
  {label:'Account', options:['---','Real Account','Demo Account','Balance']},
  {label:'Markets', options:['---','Crypto','Forex']},
  {label:'Symbol', options:['---','BTC/USD']},
  {label:'Duration', options:['---','1 min','5 min','15 min','30 min','1 hr','4 hr','12 hr','1 day','1 week','1 month'], hasIcon:true},
  {label:'Leverage', options:['---','1x (No Leverage)','2x','5x','10x','20x','50x']}
].map((field, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
                  {field.label}{field.hasIcon && <Clock size={9} color="#f59e0b"/>}
                </label>
                <select style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '5px 7px', outline: 'none' }}>
                  {field.options.map((o, j) => <option key={j}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}><DollarSign size={9}/> Amount</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '5px 7px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Buy</button>
              <button style={{ flex: 1, padding: '8px', background: '#ef4444', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Sell</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
