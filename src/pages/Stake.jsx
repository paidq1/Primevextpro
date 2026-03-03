import { useState, useEffect } from 'react';
import { createStake, getStakes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Copy, TrendingUp, DollarSign, Lock, Unlock } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const stakePlans = [
  { name: 'BRONZE', apy: '8%', min: 100, max: 999, duration: '30 days', color: '#cd7f32', bg: '#cd7f3220' },
  { name: 'SILVER', apy: '12%', min: 1000, max: 4999, duration: '60 days', color: '#94a3b8', bg: '#94a3b820' },
  { name: 'GOLD', apy: '18%', min: 5000, max: 9999, duration: '90 days', color: '#f59e0b', bg: '#f59e0b20' },
  { name: 'PLATINUM', apy: '25%', min: 10000, max: null, duration: '180 days', color: '#6366f1', bg: '#6366f120' },
];

export default function Stake() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(10);
  const [stakes, setStakes] = useState([]);
  const [loadingStakes, setLoadingStakes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  const walletAddress = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';

  useEffect(() => {
    getStakes().then(data => {
      if (Array.isArray(data)) {
        setStakes(data);
        setTotalStaked(data.reduce((s, i) => s + (i.amount || 0), 0));
        setTotalEarned(data.reduce((s, i) => s + (i.earned || 0), 0));
      }
      setLoadingStakes(false);
    }).catch(() => setLoadingStakes(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {
      const el = document.createElement('textarea');
      el.value = walletAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!selectedPlan) { setError('Please select a staking plan.'); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < selectedPlan.min) { setError(`Minimum stake for ${selectedPlan.name} plan is $${selectedPlan.min}.`); return; }
    if (selectedPlan.max && Number(amount) > selectedPlan.max) { setError(`Maximum stake for ${selectedPlan.name} plan is $${selectedPlan.max}.`); return; }
    if (!paymentMethod) { setError('Please select a payment method.'); return; }
    if (!fileData) { setError('Please upload payment proof.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('plan', selectedPlan.name);
      formData.append('amount', Number(amount));
      formData.append('apy', selectedPlan.apy);
      formData.append('duration', selectedPlan.duration.replace(' days', ''));
      formData.append('paymentMethod', paymentMethod);
      if (fileData) formData.append('paymentProof', fileData);
      const res = await createStake(formData);
      if (res.success || res._id || res.stake) {
        setShowSuccess(true);
        getStakes().then(data => { if (Array.isArray(data)) { setStakes(data); setTotalStaked(data.reduce((s,i) => s+(i.amount||0),0)); setTotalEarned(data.reduce((s,i) => s+(i.earned||0),0)); }});
      } else {
        setError(res.message || 'Stake submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', background: '#2e3a52', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  const statusColor = s => s === 'active' ? '#22c55e' : s === 'completed' ? '#6366f1' : s === 'cancelled' ? '#ef4444' : '#f59e0b';
  const statCard = (icon, label, value, color) => (
    <div style={{ background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '3px' }}>{label}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#161f33', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#1a2236', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Stake</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Staking</span>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginTop: '3px' }}>Lock your funds and earn passive rewards</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {statCard(<Lock size={16} color='#6366f1'/>, 'Total Staked', `$${totalStaked.toFixed(2)}`, '#6366f1')}
          {statCard(<DollarSign size={16} color='#22c55e'/>, 'Total Earned', `$${totalEarned.toFixed(2)}`, '#22c55e')}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {statCard(<TrendingUp size={16} color='#f59e0b'/>, 'Active Stakes', String(stakes.filter(s=>s.status==='active').length), '#f59e0b')}
          {statCard(<Unlock size={16} color='#94a3b8'/>, 'Completed Stakes', String(stakes.filter(s=>s.status==='completed').length), '#94a3b8')}
        </div>

        {/* Stake Plans */}
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', marginBottom: '10px' }}>Choose a Staking Plan</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {stakePlans.map((plan, i) => (
            <div key={i} onClick={() => { setSelectedPlan(plan); setAmount(String(plan.min)); }}
              style={{ background: selectedPlan?.name === plan.name ? plan.bg : '#2e3a52', border: `1px solid ${selectedPlan?.name === plan.name ? plan.color : 'rgba(255,255,255,0.08)'}`, padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: plan.color, fontSize: '9px', fontWeight: '800' }}>{plan.name}</span>
                <span style={{ background: plan.bg, color: plan.color, fontSize: '8px', fontWeight: '700', padding: '2px 7px', border: `1px solid ${plan.color}40` }}>{plan.apy} APY</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '3px' }}>
                Min: <span style={{ color: 'white' }}>${plan.min.toLocaleString()}</span>
                {plan.max && <> — Max: <span style={{ color: 'white' }}>${plan.max.toLocaleString()}</span></>}
                {!plan.max && <> — <span style={{ color: 'white' }}>No limit</span></>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>
                <Lock size={8}/> Lock period: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{plan.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stake Form + QR */}
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', marginBottom: '10px' }}>Stake Now</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Form */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Selected Plan</label>
              <div style={{ background: '#2e3a52', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', fontSize: '9px', color: selectedPlan ? selectedPlan.color : 'rgba(255,255,255,0.3)' }}>
                {selectedPlan ? `${selectedPlan.name} — ${selectedPlan.apy} APY — ${selectedPlan.duration}` : 'No plan selected — choose above'}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Amount to Stake (USD)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} placeholder={selectedPlan ? `Min $${selectedPlan.min}` : '0.00'} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                style={{ width: '100%', background: '#2e3a52', border: '1px solid rgba(255,255,255,0.08)', color: paymentMethod ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }}>
                <option value=''>Select Payment Method</option>
                <option value='crypto'>Crypto (USDT)</option>
                <option value='bank'>Bank Transfer</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Payment Proof</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2e3a52', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px' }}>
                <label style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Choose File<input type='file' accept='image/*,application/pdf' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]){ setFileData(e.target.files[0]); setFileName(e.target.files[0].name); }}} />
                </label>
                <span style={{ color: fileData ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
              </div>
            </div>

            <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>

            <button onClick={handleSubmit} style={{ padding: '10px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
              {submitting ? 'Submitting...' : 'Stake Now'}
            </button>
          </div>

          {/* QR Panel */}
          <div style={{ width: '180px', flexShrink: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '4px', textAlign: 'left' }}>USDT Address:</div>
            <div style={{ color: '#6366f1', fontSize: '7px', wordBreak: 'break-all', marginBottom: '6px', textAlign: 'left' }}>{walletAddress}</div>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: copied ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '7px', padding: '4px 10px', cursor: 'pointer', marginBottom: '8px', width: '100%', justifyContent: 'center' }}>
              <Copy size={9}/> {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <div style={{ color: 'white', fontSize: '8px', fontWeight: '700', marginBottom: '8px' }}>Deposit USDT to VertexTrade Pro</div>
            <img src='/qrcode.jpg' alt='QR' style={{ width: '110px', height: '110px', margin: '0 auto 10px', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Network</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px' }}>TRC20 (Tron)</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px', marginBottom: '8px' }}>*Do not deposit assets other than USDT.</div>
            <div style={{ color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>✦ VertexTrade Pro</div>
          </div>
        </div>

        {/* Active Stakes Table */}
        <div style={{ marginTop: '24px', color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', marginBottom: '10px' }}>Active Stakes</div>
        <div style={{ background: '#2e3a52', border: '1px solid rgba(255,255,255,0.06)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Plan', 'Amount', 'APY', 'Start Date', 'End Date', 'Status'].map((h, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '4px 8px', display: 'block' }}>{h} ↕</span>
            ))}
          </div>
          {loadingStakes ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : stakes.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No active stakes found</div>
          ) : stakes.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
              <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{s.plan}</span>
              <span style={{ color: 'white', fontSize: '8px' }}>${s.amount?.toFixed(2)}</span>
              <span style={{ color: '#22c55e', fontSize: '8px' }}>{s.apy}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{new Date(s.createdAt).toLocaleDateString()}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '-'}</span>
              <span style={{ background: statusColor(s.status)+'20', color: statusColor(s.status), fontSize: '7px', padding: '2px 6px', textTransform: 'capitalize' }}>{s.status}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {Math.min(stakes.length, show) > 0 ? 1 : 0} to {Math.min(stakes.length, show)} of {stakes.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Stake Submitted!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Your staking request has been submitted and is pending approval. Check your active stakes for updates.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </div>
  );
}
