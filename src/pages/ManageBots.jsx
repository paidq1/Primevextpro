import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAmount } from '../utils/currency';
import PageHeader from '../components/PageHeader';

const bots = [
  { name: 'STARTER BOT',  amount: 500,   dailyRate: '10%', duration: '7 days',   days: 7,   color: '#818cf8' },
  { name: 'SILVER BOT',   amount: 1000,  dailyRate: '16%', duration: '14 days',  days: 14,  color: '#818cf8' },
  { name: 'GOLD BOT',     amount: 2500,  dailyRate: '24%', duration: '30 days',  days: 30,  color: '#818cf8' },
  { name: 'PLATINUM BOT', amount: 5000,  dailyRate: '36%', duration: '60 days',  days: 60,  color: '#818cf8' },
  { name: 'DIAMOND BOT',  amount: 10000, dailyRate: '50%', duration: '90 days',  days: 90,  color: '#818cf8' },
  { name: 'ELITE BOT',    amount: 25000, dailyRate: '70%', duration: '120 days', days: 120, color: '#818cf8' },
];

const BASE_URL = 'https://quantyrexs.onrender.com/api';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

export default function ManageBots() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeBots, setActiveBots] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [confirmBot, setConfirmBot] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${BASE_URL}/bots`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setActiveBots(d.bots || []); setTotalEarned(d.totalEarned || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const subscribe = async (bot) => {
    setSubscribing(bot.name); setError('');
    try {
      const res = await fetch(`${BASE_URL}/bots`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ botName: bot.name })
      }).then(r => r.json());
      if (res.success) {
        setActiveBots(prev => [res.bot, ...prev]);
        setMsg(`${bot.name} activated!`);
        setShowPlans(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        setError(res.message || 'Subscription failed');
      }
    } catch { setError('Network error.'); }
    setSubscribing(''); setConfirmBot(null);
  };

  const cancelBot = async (botId) => {
    try {
      const res = await fetch(`${BASE_URL}/bots/${botId}`, { method: 'DELETE', headers: headers() }).then(r => r.json());
      if (res.success) {
        setActiveBots(prev => prev.map(b => b._id === botId ? { ...b, status: 'cancelled' } : b));
        setMsg('Bot cancelled'); setTimeout(() => setMsg(''), 3000);
      }
    } catch {}
  };

  const activeCount = activeBots.filter(b => b.status === 'active').length;
  const filtered = activeBots.filter(b => !search || b.botName?.toLowerCase().includes(search.toLowerCase()) || b.status?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / show));
  const paginated = filtered.slice((page-1)*show, page*show);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Trading Bots" />

      {msg && <div style={{ background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{msg}</div>}
      {error && <div style={{ background: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '9px', fontWeight: '600' }}>{error}</div>}

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Subscribe Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
          <button onClick={() => navigate('/dashboard/bot-plans')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '8px 14px', cursor: 'pointer' }}>+ Subscribe Bot</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '0' }}>
          {[
            ['Active Bots', activeCount, '#22c55e'],
            ['Total Bots', activeBots.length, '#6366f1'],
            ['Total Earned', formatAmount(totalEarned, user?.currency), '#f59e0b'],
          ].map(([l,v,c]) => (
            <div key={l} style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '7px', marginBottom: '3px' }}>{l}</div>
              <div style={{ color: c, fontSize: '11px', fontWeight: '800' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Bots Table */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
              <select value={show} onChange={e => { setShow(Number(e.target.value)); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Bot Name','Invested','Daily Rate','Earned','Duration','Status','Action'].map((h,i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 6px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No bots found</td></tr>
              ) : paginated.map((b, i) => {
                const color = b.status === 'active' ? '#22c55e' : b.status === 'cancelled' ? '#ef4444' : '#f59e0b';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '8px 6px', color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{b.botName}</td>
                    <td style={{ padding: '8px 6px', color: 'white', fontSize: '8px' }}>{formatAmount(b.amount||0, user?.currency)}</td>
                    <td style={{ padding: '8px 6px', color: '#22c55e', fontSize: '8px' }}>{b.dailyRate}</td>
                    <td style={{ padding: '8px 6px', color: '#f59e0b', fontSize: '8px' }}>{formatAmount(b.earned||0, user?.currency)}</td>
                    <td style={{ padding: '8px 6px', color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{b.duration}</td>
                    <td style={{ padding: '8px 6px' }}><span style={{ background: color+'20', color, fontSize: '7px', padding: '2px 6px', textTransform: 'capitalize' }}>{b.status}</span></td>
                    <td style={{ padding: '8px 6px' }}>
                      {b.status === 'active' && <button onClick={() => cancelBot(b._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '7px', padding: '2px 6px', cursor: 'pointer' }}>Cancel</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length === 0 ? 0 : (page-1)*show+1}–{Math.min(page*show, filtered.length)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setPage(1)} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page===1?'default':'pointer' }}>«</button>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page===1?'default':'pointer' }}>‹</button>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page>=totalPages?'default':'pointer' }}>›</button>
              <button onClick={() => setPage(totalPages)} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page>=totalPages?'default':'pointer' }}>»</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Plans Modal */}
      {showPlans && (
        <>
          <div onClick={() => setShowPlans(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#0e1628', border: '1px solid rgba(99,102,241,0.3)', padding: '16px', width: '340px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Subscribe to a Bot</span>
              <button onClick={() => setShowPlans(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {bots.map((bot, i) => {
                const rateNum = parseFloat(bot.dailyRate) / 100;
                const dailyProfit = (bot.amount * rateNum).toFixed(0);
                const totalProfit = (bot.amount * rateNum * bot.days).toFixed(0);
                const canAfford = (user?.balance || 0) >= bot.amount;
                const isSubscribing = subscribing === bot.name;
                return (
                  <div key={i} style={{ background: '#0d1426', border: '1px solid rgba(99,102,241,0.3)', padding: '12px', position: 'relative' }}>
                    <div style={{ color: '#818cf8', fontSize: '9px', fontWeight: '800', marginBottom: '2px' }}>{bot.name}</div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '900', marginBottom: '8px' }}>${bot.amount.toLocaleString()}</div>
                    {[
                      ['Daily Return', bot.dailyRate, '#22c55e'],
                      ['Duration', bot.duration, 'white'],
                      ['Daily Profit', `+$${dailyProfit}`, '#22c55e'],
                      ['Total Profit', `+$${totalProfit}`, '#f59e0b'],
                    ].map(([l,v,c]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{l}</span>
                        <span style={{ color: c, fontSize: '7px', fontWeight: '600' }}>{v}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => canAfford ? setConfirmBot(bot) : (setError(`Insufficient balance. You need $${bot.amount.toLocaleString()}.`), setShowInsufficient && setShowInsufficient(true))}
                      disabled={isSubscribing}
                      style={{ width: '100%', marginTop: '10px', padding: '7px', background: canAfford ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: canAfford ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '8px', fontWeight: '700', cursor: canAfford ? 'pointer' : 'not-allowed' }}>
                      {isSubscribing ? 'Activating...' : canAfford ? 'Subscribe Now' : 'Insufficient Balance'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Confirm Modal */}
      {confirmBot && (
        <div onClick={() => setConfirmBot(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d1426', border: '1px solid rgba(99,102,241,0.4)', width: '100%', maxWidth: '320px', padding: '20px', borderRadius: '4px' }}>
            <div style={{ color: '#818cf8', fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>{confirmBot.name}</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', lineHeight: '1.6', marginBottom: '16px' }}>
              Subscribe to <strong style={{ color: 'white' }}>{confirmBot.name}</strong> for <strong style={{ color: '#ef4444' }}>{formatAmount(confirmBot.amount, user?.currency)}</strong>. This will be deducted from your balance.
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
              <button onClick={() => subscribe(confirmBot)} style={{ flex: 1, padding: '9px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
    </div>
  );
}
