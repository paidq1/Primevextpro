import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Users, DollarSign, Gift } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { getReferrals } from '../services/api';

export default function ReferUsers() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(10);
  const [data, setData] = useState({ referralCode: '', totalReferrals: 0, commission: 0, referredUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferrals().then(res => {
      if (res.referralCode) setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const referralLink = `${window.location.origin}/signup?ref=${data.referralCode}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCard = (icon, label, value, color) => (
    <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '3px' }}>{label}</div>
        <div style={{ color, fontSize: '12px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Refer & Earn</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 4px' }}>Refer & Earn</h2>
          <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Invite friends and earn commission on their activity</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {statCard(<Users size={14} color="#6366f1"/>, 'Total Referrals', data.totalReferrals, '#6366f1')}
          {statCard(<DollarSign size={14} color="#22c55e"/>, 'Commission Earned', `$${data.commission.toFixed(2)}`, '#22c55e')}
          {statCard(<Gift size={14} color="#f59e0b"/>, 'Pending Rewards', '$0.00', '#f59e0b')}
        </div>

        {/* Referral Code */}
        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', marginBottom: '12px', borderRadius: '4px' }}>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>YOUR REFERRAL CODE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1, background: '#1e2538', padding: '8px 10px', fontSize: '11px', fontWeight: '700', color: '#6366f1', letterSpacing: '1px', borderRadius: '4px' }}>
              {loading ? '...' : data.referralCode}
            </div>
            <button onClick={() => handleCopy(data.referralCode)} style={{ padding: '8px 10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Copy size={10}/> Copy
            </button>
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>REFERRAL LINK</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, background: '#1e2538', padding: '8px 10px', fontSize: '7px', color: 'rgba(255,255,255,0.6)', borderRadius: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? '...' : referralLink}
            </div>
            <button onClick={() => handleCopy(referralLink)} style={{ padding: '8px 10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Copy size={10}/> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Referred Users Table */}
        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '9px', fontWeight: '600' }}>Referred Users ({data.totalReferrals})</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #6366f1' }}>
              {['Username', 'Commission', 'Status', 'Date'].map(h => (
                <div key={h} style={{ padding: '6px 8px', fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', borderRight: '1px solid #6366f1', display: 'block' }}>{h}</div>
              ))}
            </div>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
            ) : data.referredUsers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>No referrals yet</div>
            ) : data.referredUsers.slice(0, show).map((u, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ padding: '8px', fontSize: '7px', color: 'white' }}>{u.username}</div>
                <div style={{ padding: '8px', fontSize: '7px', color: '#22c55e' }}>${u.commission}</div>
                <div style={{ padding: '8px', fontSize: '7px', color: u.status === 'Active' ? '#22c55e' : '#f59e0b' }}>{u.status}</div>
                <div style={{ padding: '8px', fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{new Date(u.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          {data.referredUsers.length > show && (
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <button onClick={() => setShow(s => s + 10)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '8px', padding: '6px 16px', cursor: 'pointer', borderRadius: '4px' }}>Load More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
