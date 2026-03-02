import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, BarChart2, Wallet, Bot, TrendingUp, Clock, ArrowDownCircle, Package, Lock, Users, ChevronRight, Globe, X, Download } from 'lucide-react';

const sidebarSections = [
  {
    title: 'DASHBOARD',
    items: [
      { icon: <User size={13}/>, label: 'Profile', route: '/dashboard/profile' },
      { icon: <BarChart2 size={13}/>, label: 'Live Market', badge: 'New', route: '/dashboard/live-market' },
      { icon: <Wallet size={13}/>, label: 'Stake', route: '/dashboard/stake' },
      { icon: <Bot size={13}/>, label: 'Manage Bots', badge: 'New', route: '/dashboard/bot-transactions' },
    ]
  },
  {
    title: 'INVESTMENTS',
    items: [
      { icon: <BarChart2 size={13}/>, label: 'Investment records', route: '/dashboard/investment-records' },
      { icon: <Clock size={13}/>, label: 'Transaction history', route: '/dashboard/transaction-history' },
      { icon: <ArrowDownCircle size={13}/>, label: 'Withdraw / Deposit', route: null, submenu: [
        { label: 'Deposit', route: '/dashboard/deposit' },
        { label: 'Withdraw', route: '/dashboard/withdraw' },
      ]},
      { icon: <TrendingUp size={13}/>, label: 'Live Trading', badge: 'New', route: '/dashboard/live-trading' },
      { icon: <Package size={13}/>, label: 'Packages', route: '/dashboard/packages' },
      { icon: <Lock size={13}/>, label: 'KYC', route: '/dashboard/kyc' },
      { icon: <Users size={13}/>, label: 'Refer Users', route: '/dashboard/refer-users' },
    ]
  }
];

export default function DashboardSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />}
      <div style={{
        position: 'fixed', top: 0, left: open ? '0' : '-180px', height: '100vh', width: '170px',
        background: '#1a2035', zIndex: 101, transition: 'left 0.3s ease',
        display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => { navigate('/dashboard'); onClose(); }}>
            <div style={{ width: '18px', height: '18px' }}>
              <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
                <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
                <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
                <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={14}/>
          </button>
        </div>

        {/* Menu */}
        <div style={{ padding: '12px 0', flex: 1 }}>
          {sidebarSections.map((section, si) => (
            <div key={si} style={{ marginBottom: '16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', fontWeight: '700', letterSpacing: '0.1em', padding: '0 16px', marginBottom: '6px' }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <div key={ii}>
                  <button onClick={() => {
                    if (item.submenu) {
                      setOpenSubmenu(openSubmenu === si+'-'+ii ? null : si+'-'+ii);
                    } else {
                      navigate(item.route); onClose();
                    }
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '9px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.badge && <span style={{ background: '#ef4444', color: 'white', fontSize: '6px', padding: '1px 4px', borderRadius: '2px', fontWeight: '700' }}>{item.badge}</span>}
                      <ChevronRight size={10} color='rgba(255,255,255,0.2)' style={{ transform: openSubmenu === si+'-'+ii ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}/>
                    </div>
                  </button>
                  {item.submenu && openSubmenu === si+'-'+ii && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', paddingLeft: '38px' }}>
                      {item.submenu.map((sub, si2) => (
                        <button key={si2} onClick={() => { navigate(sub.route); onClose(); }}
                          style={{ width: '100%', padding: '8px 16px 8px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#6366f1' }}>›</span> {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Language */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={11} color='rgba(255,255,255,0.4)'/>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>EN ^</span>
        </div>
      </div>
    </>
  );
}
