import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Users, DollarSign, Gift } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function ReferUsers() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(10);

  const referralCode = 'PRIME-USER123';
  const referralLink = `https://primevestprox.cc/register?ref=${referralCode}`;

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
        <div style={{ color: value === '0' || value === '$0.00' ? 'rgba(255,255,255,0.4)' : color, fontSize: '12px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Refer Users</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Referral Program</span>
        </div>

        {/* Commission Banner */}
        <div style={{ background: 'linear-gradient(135deg, #6366f120, #22c55e20)', border: '1px solid rgba(99,102,241,0.3)', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f120', border: '1px solid #6366f140', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Gift size={18} color='#6366f1' />
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '10px', fontWeight: '700', marginBottom: '3px' }}>Earn <span style={{ color: '#22c55e' }}>10% Commission</span> on Every Referral!</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', lineHeight: '1.6' }}>Invite friends to PrimeVest Pro and earn 10% of their first deposit automatically credited to your account.</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {statCard(<Users size={16} color='#6366f1'/>, 'Total Referrals', '0', '#6366f1')}
          {statCard(<DollarSign size={16} color='#22c55e'/>, 'Total Earnings', '$0.00', '#22c55e')}
        </div>

        {/* Referral Code */}
        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', marginBottom: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '10px', fontWeight: '600' }}>YOUR REFERRAL CODE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1, background: '#1e2538', border: '1px solid rgba(99,102,241,0.3)', padding: '8px 12px', color: '#6366f1', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              {referralCode}
            </div>
            <button onClick={() => handleCopy(referralCode)}
              style={{ background: copied ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '8px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Copy size={10}/> {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '8px', fontWeight: '600' }}>YOUR REFERRAL LINK</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', color: 'rgba(255,255,255,0.5)', fontSize: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {referralLink}
            </div>
            <button onClick={() => handleCopy(referralLink)}
              style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Copy size={10}/> Copy Link
            </button>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700', marginBottom: '10px' }}>HOW IT WORKS</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { step: '1', text: 'Share your referral link or code with friends' },
              { step: '2', text: 'Friend registers using your link or code' },
              { step: '3', text: 'Earn 10% when they make their first deposit' },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6366f1', color: 'white', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>{item.step}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', lineHeight: '1.5' }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral History Table */}
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', marginBottom: '10px' }}>Referral History</div>
        <div style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
              <select value={show} onChange={e => setShow(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
              <input style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Username', 'Commission', 'Status', 'Date'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '4px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No referrals yet</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing 0 to 0 of 0 entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
