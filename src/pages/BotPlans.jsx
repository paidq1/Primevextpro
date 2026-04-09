import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount } from '../utils/currency';
import PageHeader from '../components/PageHeader';

const bots = [
  { name: 'STARTER BOT',  amount: 500,   dailyRate: '10%', duration: '7 days',   days: 7,   color: '#e67e22' },
  { name: 'SILVER BOT',   amount: 1000,  dailyRate: '16%', duration: '14 days',  days: 14,  color: '#bdc3c7' },
  { name: 'GOLD BOT',     amount: 2500,  dailyRate: '24%', duration: '30 days',  days: 30,  color: '#f1c40f' },
  { name: 'PLATINUM BOT', amount: 5000,  dailyRate: '36%', duration: '60 days',  days: 60,  color: '#7f8cf8' },
  { name: 'DIAMOND BOT',  amount: 10000, dailyRate: '50%', duration: '90 days',  days: 90,  color: '#00d2ff' },
  { name: 'ELITE BOT',    amount: 25000, dailyRate: '70%', duration: '120 days', days: 120, color: '#9b59b6' },
];

const BASE_URL = 'https://quantyrexs.onrender.com/api';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` });

export default function BotPlans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmBot, setConfirmBot] = useState(null);
  const [subscribing, setSubscribing] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const subscribe = async (bot) => {
    setSubscribing(bot.name); setError('');
    try {
      const res = await fetch(`${BASE_URL}/bots`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ botName: bot.name })
      }).then(r => r.json());
      if (res.success) {
        setShowSuccess(true); setConfirmBot(null);
      } else {
        setError(res.message || 'Subscription failed');
      }
    } catch { setError('Network error.'); }
    setSubscribing('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Bot Plans" />

      {error && <div style={{ background: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '9px' }}>{error}</div>}

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Bot Activated!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your trading bot has been activated and is now running. Profits will be credited daily.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowSuccess(false); }} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', cursor: 'pointer' }}>Subscribe More</button>
              <button onClick={() => navigate('/dashboard/manage-bots')} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>View Bots</button>
            </div>
          </div>
        </>
      )}

      <div style={{ padding: '16px' }}>
        <div style={{ color: 'white', fontSize: '11px', fontWeight: '700', marginBottom: '14px' }}>Choose a Bot Plan</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {bots.map((bot, i) => {
            const rateNum = parseFloat(bot.dailyRate) / 100;
            const dailyProfit = (bot.amount * rateNum).toLocaleString();
            const totalProfit = (bot.amount * rateNum * bot.days).toLocaleString();
            const canAfford = (user?.balance || 0) >= bot.amount;
            return (
              <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '12px', position: 'relative' }}>
                <div style={{ color: bot.color, fontSize: '9px', fontWeight: '800', marginBottom: '4px' }}>{bot.name}</div>
                <div style={{ color: bot.color, fontSize: '10px', fontWeight: '800', marginBottom: '2px' }}>${bot.amount.toLocaleString()}</div>
                {user?.currency && user.currency !== 'USD' && (
                  <div style={{ fontSize: '7px', color: '#f59e0b', marginBottom: '8px' }}>≈ {formatAmount(bot.amount, user.currency)}</div>
                )}
                {[
                  ['Daily Return', bot.dailyRate, '#22c55e'],
                  ['Duration', bot.duration, 'white'],
                  ['Daily Profit', `+$${dailyProfit}`, '#22c55e'],
                  ['Total Profit', `+$${totalProfit}`, '#f59e0b'],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</span>
                    <span style={{ color: c, fontSize: '8px', fontWeight: '600' }}>{v}</span>
                  </div>
                ))}
                <button
                  onClick={() => canAfford ? setConfirmBot(bot) : setError(`Insufficient balance. You need $${bot.amount.toLocaleString()}.`)}
                  style={{ width: '100%', marginTop: '12px', padding: '8px', background: canAfford ? bot.color : 'rgba(255,255,255,0.06)', border: 'none', color: canAfford ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: '700', cursor: canAfford ? 'pointer' : 'not-allowed' }}>
                  {canAfford ? 'Subscribe Now' : 'Insufficient Balance'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmBot && (
        <div onClick={() => setConfirmBot(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d1426', border: '1px solid rgba(99,102,241,0.4)', width: '100%', maxWidth: '320px', padding: '20px' }}>
            <div style={{ color: '#818cf8', fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>{confirmBot.name}</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', lineHeight: '1.6', marginBottom: '16px' }}>
              Subscribe to <strong style={{ color: 'white' }}>{confirmBot.name}</strong> for <strong style={{ color: '#ef4444' }}>{formatAmount(confirmBot.amount, user?.currency)}</strong>.
            </p>
            {[
              ['Investment', formatAmount(confirmBot.amount, user?.currency)],
              ['Daily Return', confirmBot.dailyRate],
              ['Duration', confirmBot.duration],
              ['Balance After', formatAmount(((user?.balance || 0) - confirmBot.amount), user?.currency)],
            ].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{l}</span>
                <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setConfirmBot(null)} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => subscribe(confirmBot)} disabled={subscribing === confirmBot.name} style={{ flex: 1, padding: '9px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
                {subscribing === confirmBot.name ? 'Activating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
    </div>
  );
}
