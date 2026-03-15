import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import DashboardSidebar from '../components/DashboardSidebar';

const BASE_URL = 'https://vertextrades.onrender.com/api';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const bots = [
  { name: 'STARTER BOT',  amount: 500,   dailyRate: '10%', duration: '7 days',   days: 7,   color: '#cd7f32' },
  { name: 'SILVER BOT',   amount: 1000,  dailyRate: '16%', duration: '14 days',  days: 14,  color: '#94a3b8' },
  { name: 'GOLD BOT',     amount: 2500,  dailyRate: '24%', duration: '30 days',  days: 30,  color: '#f59e0b' },
  { name: 'PLATINUM BOT', amount: 5000,  dailyRate: '36%', duration: '60 days',  days: 60,  color: '#6366f1' },
  { name: 'DIAMOND BOT',  amount: 10000, dailyRate: '50%', duration: '90 days',  days: 90,  color: '#22d3ee' },
  { name: 'ELITE BOT',    amount: 25000, dailyRate: '70%', duration: '120 days', days: 120, color: '#a855f7' },
];

export default function ManageBots() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeBots, setActiveBots] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [confirmBot, setConfirmBot] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/bots`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setActiveBots(d.bots || []); setTotalEarned(d.totalEarned || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const subscribe = async (bot) => {
    setSubscribing(bot.name);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/bots`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ botName: bot.name })
      }).then(r => r.json());

      if (res.success) {
        setActiveBots(prev => [res.bot, ...prev]);
        setMsg(`${bot.name} activated successfully!`);
        setTimeout(() => setMsg(''), 3000);
        // Refresh user balance
        fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(r => r.json()).then(d => {
          if (d._id) localStorage.setItem('user', JSON.stringify(d));
        });
      } else {
        setError(res.message || 'Subscription failed');
      }
    } catch(e) {
      setError('Network error. Please try again.');
    }
    setSubscribing('');
    setConfirmBot(null);
  };

  const cancelBot = async (botId) => {
    try {
      const res = await fetch(`${BASE_URL}/bots/${botId}`, { method: 'DELETE', headers: headers() }).then(r => r.json());
      if (res.success) {
        setActiveBots(prev => prev.map(b => b._id === botId ? { ...b, status: 'cancelled' } : b));
        setMsg('Bot cancelled and balance refunded');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch(e) {}
  };

  const activeCount = activeBots.filter(b => b.status === 'active').length;

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Trading Bots</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>Balance: {formatAmount(user?.balance || 0, user?.currency)}</span>
        </div>
      </div>

      {msg && <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{msg}</div>}
      {error && <div style={{ background: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{error}</div>}

      <div style={{ padding: '16px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {[
            ['Active Bots', activeCount, '#22c55e'],
            ['Total Bots', activeBots.length, '#6366f1'],
            ['Total Earned', formatAmount(totalEarned, user?.currency), '#f59e0b'],
          ].map(([l,v,c]) => (
            <div key={l} style={{ background: '#1a2e4a', padding: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px' }}>{l}</div>
              <div style={{ color: c, fontSize: '10px', fontWeight: '700' }}>{v}</div>
            </div>
          ))}
        </div>



        {/* Active Bot Progress */}
        {activeBots.filter(b => b.status === 'active').length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'white', fontSize: '10px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg>Active Bots</div>
            {activeBots.filter(b => b.status === 'active').map((b, i) => {
              const totalDays = parseInt(b.duration) || 7;
              const daysLeft = b.expiresAt ? Math.max(0, Math.ceil((new Date(b.expiresAt) - new Date()) / (1000*60*60*24))) : 0;
              const elapsed = totalDays - daysLeft;
              const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
              const earned = b.earned || 0;
              const roi = b.amount > 0 ? ((earned / b.amount) * 100).toFixed(2) : '0.00';
              return (
                <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6366f1', fontSize: '10px', fontWeight: '800' }}>{b.botName}</span>
                    <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '7px', padding: '2px 8px', fontWeight: '700' }}>ACTIVE</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', marginBottom: '10px' }}>
                    {[
                      ['Invested', formatAmount(b.amount || 0, user?.currency), 'white'],
                      ['Daily Rate', b.dailyRate, '#22c55e'],
                      ['Earned', formatAmount(earned, user?.currency), '#f59e0b'],
                      ['ROI', `${roi}%`, parseFloat(roi) >= 0 ? '#22c55e' : '#ef4444'],
                    ].map(([l,v,col]) => (
                      <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', padding: '6px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '3px' }}>{l}</div>
                        <div style={{ color: col, fontSize: '10px', fontWeight: '700' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{elapsed} / {totalDays} days</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{daysLeft} days left</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', height: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: progress + '%', height: '100%', background: '#6366f1', borderRadius: '3px', transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>{progress.toFixed(0)}% complete</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>Expires: {b.expiresAt ? new Date(b.expiresAt).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bot Plans */}
        <div style={{ color: 'white', fontSize: '10px', fontWeight: '700', marginBottom: '10px' }}>Available Bot Plans</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {bots.map((bot, i) => {
            const dailyProfit = (bot.amount * parseFloat(bot.dailyRate) / 100).toFixed(0);
            const totalProfit = (bot.amount * parseFloat(bot.dailyRate) / 100 * bot.days).toFixed(0);
            const canAfford = (user?.balance || 0) >= bot.amount;
            const isSubscribing = subscribing === bot.name;
            return (
              <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '12px', position: 'relative', overflow: 'visible' }}>

                <div style={{ color: 'white', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>{bot.name}</div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: '#6366f1', fontSize: '10px', fontWeight: '700', marginBottom: '10px' }}>${bot.amount.toLocaleString()}</div>
                  
                </div>
                {[
                  ['Daily Return', bot.dailyRate, '#22c55e'],
                  ['Duration', bot.duration, 'white'],
                  ['Daily Profit', `+${getCurrencySymbol(user?.currency)}${dailyProfit}`, '#22c55e'],
                  ['Total Profit', `+${getCurrencySymbol(user?.currency)}${totalProfit}`, '#f59e0b'],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</span>
                    <span style={{ color: c, fontSize: '7px', fontWeight: '600' }}>{v}</span>
                  </div>
                ))}
                <button
                  onClick={() => canAfford ? setConfirmBot(bot) : setError(`Insufficient balance. You need ${getCurrencySymbol(user?.currency)}${bot.amount.toLocaleString()}.`)}
                  disabled={isSubscribing}
                  style={{ width: '100%', marginTop: '10px', padding: '7px', background: canAfford ? bot.color : 'rgba(255,255,255,0.06)', border: 'none', color: canAfford ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '8px', fontWeight: '700', cursor: canAfford ? 'pointer' : 'not-allowed' }}>
                  {isSubscribing ? 'Activating...' : canAfford ? 'Subscribe Now' : 'Insufficient Balance'}
                </button>
              </div>
            );
          })}
        </div>


      </div>

      {/* Confirm Modal */}
      {confirmBot && (
        <div onClick={() => setConfirmBot(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0e1628', border: `1px solid ${confirmBot.color}40`, width: '100%', maxWidth: '320px', padding: '20px', borderRadius: '4px' }}>
            <div style={{ color: confirmBot.color, fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>{confirmBot.name}</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', lineHeight: '1.6', marginBottom: '16px' }}>
              You are about to subscribe to <strong style={{ color: 'white' }}>{confirmBot.name}</strong> for <strong style={{ color: '#ef4444' }}>{formatAmount(confirmBot.amount, user?.currency)}</strong>. This amount will be deducted from your balance immediately.
            </p>
            {[
              ['Investment', `${formatAmount(confirmBot.amount, user?.currency)}`],
              ['Daily Return', confirmBot.dailyRate],
              ['Duration', confirmBot.duration],
              ['Your Balance', formatAmount(user?.balance || 0, user?.currency)],
              ['Balance After', formatAmount(((user?.balance || 0) - confirmBot.amount), user?.currency)],
            ].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</span>
                <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setConfirmBot(null)} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => subscribe(confirmBot)} style={{ flex: 1, padding: '9px', background: confirmBot.color, border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; VertexTrade Pro</div>

    </div>
  );
}