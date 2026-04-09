import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount } from '../utils/currency';
import { RefreshCw, User, Settings, Lock, LogOut } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

export default function PageHeader({ title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://quantyrexs.onrender.com/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => Array.isArray(d) ? setNotifications(d) : setNotifications([])).catch(() => {});
    fetch('https://quantyrexs.onrender.com/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setBalance(d.balance || user?.balance || 0)).catch(() => {});
  }, []);

  return (
    <>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, borderBottom: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 4px 24px rgba(99,102,241,0.15), 0 1px 0 rgba(255,255,255,0.05) inset' }}>

        {/* Hamburger */}
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginRight: '4px', display: 'flex', alignItems: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        {title && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>/ {title}</span>}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'stretch' }}>

          {/* Balance */}
          <button style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '11px', cursor: 'default', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#f7931a' }}>₿</span> {formatAmount(balance, user?.currency)}
          </button>

          {/* Trade */}
          <button onClick={() => navigate('/dashboard/live-trading')} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #6366f1', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <RefreshCw size={11}/> Trade
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '5px 8px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width='18' height='18' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>
              {notifications.some(n => n.unread) && <span style={{ position: 'absolute', top: '2px', right: '4px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />}
            </button>
            {showNotifications && (
              <>
                <div onClick={() => setShowNotifications(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', zIndex: 999, minWidth: '260px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Notifications</span>
                    <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} style={{ color: '#6366f1', fontSize: '9px', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {(notifications.length ? notifications.slice(0,5) : [
                    { id: 1, icon: '🔐', title: 'KYC Reminder', desc: 'Complete verification to unlock all features', time: new Date(), unread: true },
                  ]).map((n, i) => (
                    <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.unread ? 'rgba(99,102,241,0.08)' : 'transparent', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px' }}>{n.icon || '🔔'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontSize: '10px', fontWeight: '600', marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>{n.desc || n.message}</div>
                      </div>
                      {n.unread && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' }} />}
                    </div>
                  ))}
                  <div onClick={() => { navigate('/dashboard/notifications'); setShowNotifications(false); }} style={{ padding: '10px 16px', textAlign: 'center', color: '#6366f1', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.06)' }}>View All Notifications →</div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <div onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)', padding: '0 12px', cursor: 'pointer', height: '100%' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#5b6477', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.avatar ? <img src={user.avatar} style={{ width: '34px', height: '34px', objectFit: 'cover' }} /> : <User size={18} color="white" />}
              </div>
            </div>
            {showProfileMenu && (
              <>
                <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', zIndex: 999, minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                  {[
                    { icon: <User size={14}/>, label: 'My Account', action: () => navigate('/dashboard/profile') },
                    { icon: <Settings size={14}/>, label: 'Edit Account', action: () => navigate('/dashboard/profile', { state: { tab: 'edit' } }) },
                    { icon: <Lock size={14}/>, label: 'Change Password', action: () => navigate('/dashboard/change-password') },
                  ].map((item, i) => (
                    <div key={i} onClick={() => { item.action(); setShowProfileMenu(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      {item.icon} {item.label}
                    </div>
                  ))}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <div onClick={() => { logout(); navigate('/signin'); setShowProfileMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', color: '#ef4444', fontSize: '11px' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <LogOut size={14}/> Logout
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
