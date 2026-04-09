import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

const API = 'https://quantyrexs.onrender.com/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      if (res.notifications) {
        setNotifications(res.notifications);
        setUnread(res.unread);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/notifications/read-all`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const typeColor = (type) => {
    const colors = { deposit: '#22c55e', withdrawal: '#f59e0b', profit: '#6366f1', referral: '#ec4899', kyc: '#22d3ee', system: '#9ca3af' };
    return colors[type] || '#9ca3af';
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => { setOpen(!open); if (!open && unread > 0) markAllRead(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px', display: 'flex', alignItems: 'center' }}>
        <Bell size={18} color="white" />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '30px', right: 0, width: '280px', background: '#132035', border: '1px solid rgba(255,255,255,0.1)', zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>Notifications</span>
            {unread > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>No notifications yet</div>
            ) : notifications.map((n, i) => (
              <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.06)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: typeColor(n.type), marginTop: '4px', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'white', fontSize: '9px', fontWeight: '600', marginBottom: '2px' }}>{n.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', lineHeight: '1.4' }}>{n.message}</div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '7px', marginTop: '4px' }}>{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
