import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { ArrowLeft, Bell, Check } from 'lucide-react';

const allNotifications = [
  { id: 1, icon: '💰', title: 'Deposit Confirmed', desc: 'Your deposit of $500 has been approved and credited to your account.', time: '2 minutes ago', unread: true, type: 'deposit' },
  { id: 2, icon: '📈', title: 'Trade Update', desc: 'Your BTC/USD trade is currently active and performing well.', time: '1 hour ago', unread: true, type: 'trade' },
  { id: 3, icon: '🔐', title: 'KYC Reminder', desc: 'Complete your identity verification to unlock all platform features.', time: '2 hours ago', unread: false, type: 'kyc' },
  { id: 4, icon: '💸', title: 'Withdrawal Processed', desc: 'Your withdrawal request of $200 has been processed successfully.', time: '1 day ago', unread: false, type: 'withdrawal' },
  { id: 5, icon: '🤝', title: 'Referral Bonus', desc: 'You earned a $10 referral bonus from a new signup.', time: '2 days ago', unread: false, type: 'referral' },
  { id: 6, icon: '📦', title: 'Package Activated', desc: 'Your Bronze investment package has been activated successfully.', time: '3 days ago', unread: false, type: 'package' },
  { id: 7, icon: '🔔', title: 'System Update', desc: 'Quantyrex Markets has been updated with new features and improvements.', time: '1 week ago', unread: false, type: 'system' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('https://quantyrexs.onrender.com/api/notifications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        setNotifications(d.map(n => ({ ...n, unread: readIds.includes(String(n.id)) ? false : n.unread })));
      } else {
        setNotifications(allNotifications);
      }
    }).catch(() => setNotifications(allNotifications));
  }, []);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    const ids = notifications.map(n => String(n.id));
    const existing = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    localStorage.setItem('readNotifications', JSON.stringify([...new Set([...existing, ...ids])]));
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };
  const markRead = (id) => {
    const existing = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    localStorage.setItem('readNotifications', JSON.stringify([...new Set([...existing, String(id)])]));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filtered = filter === 'unread' ? notifications.filter(n => n.unread) : notifications;
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', sans-serif" }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#131b2e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <Bell size={18} color="#6366f1" />
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Notifications</span>
        {unreadCount > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '9px', padding: '2px 7px', borderRadius: '10px' }}>{unreadCount} new</span>}
        <button onClick={markAllRead} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(99,102,241,0.4)', color: '#6366f1', fontSize: '9px', padding: '4px 10px', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Check size={10} /> Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px' }}>
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: 'none', border: 'none', color: filter === f ? '#6366f1' : 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '10px 16px', cursor: 'pointer', borderBottom: filter === f ? '2px solid #6366f1' : '2px solid transparent', fontWeight: filter === f ? '600' : '400', textTransform: 'capitalize' }}>
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ padding: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
            <Bell size={32} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontSize: '12px' }}>No notifications</div>
          </div>
        ) : filtered.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{ background: n.unread ? 'rgba(99,102,241,0.08)' : '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
            <span style={{ fontSize: '22px', flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '600' }}>{n.title}</span>
                {n.unread && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px', lineHeight: '1.4' }}>{n.desc}</div>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}>{typeof n.time === 'string' && n.time.includes('ago') ? n.time : new Date(n.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
