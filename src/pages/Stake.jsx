import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import { getStakes } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, DollarSign, Lock, Unlock } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const stakePlans = [
  { name: 'STARTER',  apy: '5%',  min: 500,   max: 999,   duration: '7',   color: '#22c55e', bg: '#22c55e20' },
  { name: 'SILVER',   apy: '8%',  min: 1000,  max: 2499,  duration: '14',  color: '#94a3b8', bg: '#94a3b820' },
  { name: 'GOLD',     apy: '12%', min: 2500,  max: 4999,  duration: '30',  color: '#f59e0b', bg: '#f59e0b20' },
  { name: 'PLATINUM', apy: '18%', min: 5000,  max: 9999,  duration: '60',  color: '#6366f1', bg: '#6366f120' },
  { name: 'DIAMOND',  apy: '25%', min: 10000, max: 24999, duration: '90',  color: '#22d3ee', bg: '#22d3ee20' },
  { name: 'ELITE',    apy: '35%', min: 25000, max: null,  duration: '120', color: '#ec4899', bg: '#ec489920' },
];

export default function Stake() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { if (location.search.includes('new=1')) setShowForm(true); }, [location]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [show, setShow] = useState(10);
  const perPage = show;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stakes, setStakes] = useState([]);
  const [loadingStakes, setLoadingStakes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch('https://quantyrexs.onrender.com/api/user/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => setBalance(d.balance || 0)).catch(() => {});
    getStakes().then(data => {
      if (Array.isArray(data)) {
        setStakes(data);
        setTotalStaked(data.reduce((s, i) => s + (i.amount || 0), 0));
        setTotalEarned(data.reduce((s, i) => s + (i.earned || 0), 0));
      }
      setLoadingStakes(false);
    }).catch(() => setLoadingStakes(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedPlan) { setError('Please select a staking plan.'); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < selectedPlan.min) { setError(`Minimum stake for ${selectedPlan.name} is $${selectedPlan.min}`); return; }
    if (selectedPlan.max && Number(amount) > selectedPlan.max) { setError(`Maximum stake for ${selectedPlan.name} is $${selectedPlan.max}`); return; }
    setError(''); setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://quantyrexs.onrender.com/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: selectedPlan.name, amount: Number(amount), apy: selectedPlan.apy, duration: selectedPlan.duration })
      }).then(r => r.json());
      if (res.success || res._id || res.stake) {
        setShowSuccess(true); setShowForm(false);
        getStakes().then(data => { if (Array.isArray(data)) { setStakes(data); setTotalStaked(data.reduce((s,i) => s+(i.amount||0),0)); setTotalEarned(data.reduce((s,i) => s+(i.earned||0),0)); }});
      } else {
        setError(res.message || 'Stake submission failed.');
      }
    } catch { setError('Network error.'); }
    setSubmitting(false);
  };

  const statusColor = s => s === 'active' ? '#22c55e' : s === 'completed' ? '#6366f1' : s === 'cancelled' ? '#ef4444' : '#f59e0b';

  const filtered = stakes.filter(s => !search || s.plan?.toLowerCase().includes(search.toLowerCase()) || s.status?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page-1)*perPage, page*perPage);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Header */}
      <PageHeader title="Stake" />

      

      {/* New Stake Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#0e1628', border: '1px solid rgba(99,102,241,0.3)', padding: '16px', width: '340px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>New Stake</span>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            {/* Plans */}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', marginBottom: '8px' }}>Choose a Plan</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
              {stakePlans.map((plan, i) => (
                <div key={i} onClick={() => { setSelectedPlan(plan); setAmount(String(plan.min)); }}
                  style={{ background: selectedPlan?.name === plan.name ? plan.bg : '#1a2e4a', border: `1px solid ${selectedPlan?.name === plan.name ? plan.color : 'rgba(255,255,255,0.08)'}`, padding: '10px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: plan.color, fontSize: '8px', fontWeight: '800' }}>{plan.name}</span>
                    <span style={{ background: plan.bg, color: plan.color, fontSize: '7px', fontWeight: '700', padding: '1px 5px', border: `1px solid ${plan.color}40` }}>{plan.apy}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>Min: <span style={{ color: 'white' }}>${plan.min.toLocaleString()}</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{plan.duration} days</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', marginBottom: '4px' }}>Selected Plan</div>
              <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', fontSize: '9px', color: selectedPlan ? selectedPlan.color : 'rgba(255,255,255,0.3)' }}>
                {selectedPlan ? `${selectedPlan.name} — ${selectedPlan.apy} APY — ${selectedPlan.duration} days` : 'No plan selected'}
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', marginBottom: '4px' }}>Amount (USD) — Balance: <span style={{ color: '#22c55e' }}>{formatAmount(balance, user?.currency)}</span></div>
              <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
              {amount && Number(amount) > 0 && user?.currency && user.currency !== 'USD' && (
                <div style={{ fontSize: '7px', color: '#f59e0b', marginTop: '4px' }}>≈ {formatAmount(Number(amount), user.currency)} in your currency</div>
              )}
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px' }}>{error}</div>}
            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '9px', background: submitting ? '#4b4e9b' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Processing...' : 'Stake Now'}
            </button>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Stake Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your staking request has been submitted successfully and is now earning rewards.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* New Stake Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
          <button onClick={() => navigate('/dashboard/new-stake')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '8px 14px', cursor: 'pointer' }}>+ New Stake</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '0' }}>
          {[
            ['Total Staked', formatAmount(totalStaked, user?.currency), '#6366f1'],
            ['Total Earned', formatAmount(totalEarned, user?.currency), '#22c55e'],
            ['Active', String(stakes.filter(s=>s.status==='active').length), '#f59e0b'],
            ['Completed', String(stakes.filter(s=>s.status==='completed').length), '#94a3b8'],
          ].map(([l,v,c]) => (
            <div key={l} style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center', boxShadow: '0 4px 24px rgba(99,102,241,0.1)' }}>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '7px', marginBottom: '3px' }}>{l}</div>
              <div style={{ color: c, fontSize: '11px', fontWeight: '800' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Table */}
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
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }}/>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Plan','Amount','APY','Earned','Duration','Status'].map((h,i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 10px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h} ↕</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingStakes ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No stakes found</td></tr>
              ) : paginated.map((s, i) => {
                const color = statusColor(s.status);
                const earned = s.earned || 0;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '8px 10px', color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{s.plan}</td>
                    <td style={{ padding: '8px 10px', color: 'white', fontSize: '8px', fontWeight: '700' }}>{formatAmount(s.amount||0, user?.currency)}</td>
                    <td style={{ padding: '8px 10px', color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>{s.apy}</td>
                    <td style={{ padding: '8px 10px', color: '#f59e0b', fontSize: '8px', fontWeight: '700' }}>{formatAmount(earned, user?.currency)}</td>
                    <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{s.duration} days</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ background: color+'20', color, fontSize: '7px', padding: '2px 6px', display: 'inline-block', textTransform: 'capitalize' }}>{s.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length === 0 ? 0 : (page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length} entries</span>
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

      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px' }}>2020-2026 © Quantyrex Markets</div>
    </div>
  );
}
