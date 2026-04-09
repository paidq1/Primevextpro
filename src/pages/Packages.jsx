import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { CheckCircle, X, AlertCircle, Zap, TrendingUp, Award, Crown, Rocket, Star } from 'lucide-react';
import { joinPlan, getInvestments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';

const plans = [
  { name: 'BRONZE',   roi: '10% Daily', price: '$500',     min: 500,    max: 4999,    rate: '10% Daily',  duration: '7',  defaultAmt: '500'    },
  { name: 'SILVER',   roi: '15% Daily', price: '$5,000',   min: 5000,   max: 9999,    rate: '15% Daily',  duration: '14', defaultAmt: '5000'   },
  { name: 'GOLD',     roi: '20% Daily', price: '$10,000',  min: 10000,  max: 24999,   rate: '20% Daily',  duration: '21', defaultAmt: '10000'  },
  { name: 'PLATINUM', roi: '25% Daily', price: '$25,000',  min: 25000,  max: 49999,   rate: '25% Daily',  duration: '30', defaultAmt: '25000'  },
  { name: 'DIAMOND',  roi: '30% Daily', price: '$50,000',  min: 50000,  max: 99999,   rate: '30% Daily',  duration: '45', defaultAmt: '50000'  },
  { name: 'ELITE',    roi: '40% Daily', price: '$100,000', min: 100000, max: 1000000, rate: '40% Daily',  duration: '60', defaultAmt: '100000' },
];

export default function Packages() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlTab = new URLSearchParams(location.search).get('tab');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(urlTab || 'available');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    setActiveTab(tab || 'available');
  }, [location.search]);
  const [amounts, setAmounts] = useState(plans.map(p => p.defaultAmt));
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lowBalance, setLowBalance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showInsufficient, setShowInsufficient] = useState(false);

  const userBalance = user?.balance || 0;
  const [investments, setInvestments] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getInvestments().then(res => {
      if (Array.isArray(res)) setInvestments(res);
    }).catch(() => {});
  }, [success]);

  const handleJoin = (plan, i) => {
    const amt = parseFloat(amounts[i]);
    if (!amt || amt < plan.min) {
      setError(`Minimum amount for ${plan.name} is ${getCurrencySymbol(user?.currency)}${plan.min.toLocaleString()}`);
      setTimeout(() => setError(''), 4000);
      return;
    }
    if (plan.max && amt > plan.max) {
      setError(`Maximum amount for ${plan.name} is ${getCurrencySymbol(user?.currency)}${plan.max.toLocaleString()}`);
      setTimeout(() => setError(''), 4000);
      return;
    }
    if (userBalance < amt) { setShowInsufficient(true);
      setLowBalance(true);
      setTimeout(() => setLowBalance(false), 4000);
      return;
    }
    setConfirmPlan({ ...plan, amount: amounts[i] });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await joinPlan({
        plan: confirmPlan.name,
        amount: parseFloat(confirmPlan.amount),
        roi: confirmPlan.roi,
        duration: confirmPlan.duration,
      });
      if (res.investment || res.message === 'Investment plan joined successfully') {
        setConfirmPlan(null);
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to join plan. Please try again.');
        setConfirmPlan(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setConfirmPlan(null);
    } finally {
      setSubmitting(false);
    }
  };

  const activeInvestments = investments.filter(i => i.status === 'active');

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Low Balance Notice */}
      {lowBalance && (
        <div style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#ef4444', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', minWidth: '260px' }}>
          <AlertCircle size={13}/>
          <span>Your balance is too low for this plan. Please make a deposit.</span>
          <button onClick={() => setLowBalance(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}><X size={12}/></button>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#f59e0b', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', minWidth: '260px' }}>
          <AlertCircle size={13}/>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}><X size={12}/></button>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmPlan && (
        <>
          <div onClick={() => setConfirmPlan(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 151, background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.4)', padding: '20px', width: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Confirm Investment</span>
              <button onClick={() => setConfirmPlan(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={13}/></button>
            </div>
            {[
              ['Plan', confirmPlan.name],
              ['Amount', formatAmount(parseFloat(confirmPlan.amount), user?.currency)],
              ['ROI', confirmPlan.roi],
              ['Duration', confirmPlan.duration + ' days'],
              ['Your Balance', formatAmount(userBalance, user?.currency)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{k}</span>
                <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setConfirmPlan(null)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirm} disabled={submitting} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Insufficient Balance Popup */}
      {showInsufficient && (
        <>
          <div onClick={() => setShowInsufficient(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' fill='none' stroke='#ef4444' viewBox='0 0 24 24' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Insufficient Balance</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Hello <strong style={{ color: '#111' }}>{user?.name || user?.email?.split('@')[0] || 'there'}</strong>, your balance is too low for this plan. Please make a deposit and try again.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowInsufficient(false)} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '10px', cursor: 'pointer', borderRadius: '4px' }}>Cancel</button>
              <button onClick={() => { setShowInsufficient(false); navigate('/dashboard/deposit'); }} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>Deposit Now</button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {success && (
        <>
          <div onClick={() => setSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Investment Successful!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Your investment has been activated. Check Investment Records for details.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSuccess(false)} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Stay</button>
              <button onClick={() => { setSuccess(false); navigate('/dashboard/investment-records'); }} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>View Records</button>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <PageHeader title="Packages" />

      <div style={{ padding: '14px' }}>

        {activeTab === 'my' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '600' }}>Current Packages</span>
              <button onClick={() => setActiveTab('available')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '8px 14px', cursor: 'pointer' }}>+ Add Plan</button>
            </div>


            {/* Records Table */}
            <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', marginTop: '0' }}>
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
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Plan','Amount','ROI','Earned','Start Date','End Date','Status'].map((h,i) => (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '600', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', padding: '7px 6px', display: 'block' }}>{h}</span>
                ))}
              </div>
              {(() => {
                const filtered = investments.filter(inv => !search || inv.plan?.toLowerCase().includes(search.toLowerCase()) || inv.status?.toLowerCase().includes(search.toLowerCase()));
                const totalPages = Math.max(1, Math.ceil(filtered.length / show));
                const paged = filtered.slice((page-1)*show, page*show);
                return (
                  <>
                    {paged.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No investment records found</div>
                    ) : paged.map((inv, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
                        <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{inv.plan}</span>
                        <span style={{ color: 'white', fontSize: '8px' }}>${parseFloat(inv.amount).toLocaleString()}</span>
                        <span style={{ color: '#22c55e', fontSize: '8px' }}>{inv.roi}</span>
                        <span style={{ color: '#f59e0b', fontSize: '8px', fontWeight: '700' }}>+{formatAmount(inv.earned || inv.profit || 0, user?.currency)}</span>
                        <span style={{ color: '#f59e0b', fontSize: '8px', fontWeight: '700' }}>+{formatAmount(inv.earned || inv.profit || 0, user?.currency)}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{new Date(inv.createdAt).toLocaleDateString()}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : '—'}</span>
                        <span style={{ background: inv.status==='active'?'rgba(34,197,94,0.15)':inv.status==='completed'?'rgba(99,102,241,0.15)':'rgba(239,68,68,0.15)', color: inv.status==='active'?'#22c55e':inv.status==='completed'?'#818cf8':'#ef4444', fontSize: '6px', padding: '2px 5px', fontWeight: '600', textTransform: 'uppercase', display: 'inline-block' }}>{inv.status}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length === 0 ? 0 : (page-1)*show+1} to {Math.min(page*show, filtered.length)} of {filtered.length} entries</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => setPage(1)} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page===1?'default':'pointer' }}>«</button>
                        <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page===1?'default':'pointer' }}>‹</button>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page>=totalPages?'default':'pointer' }}>›</button>
                        <button onClick={() => setPage(totalPages)} disabled={page>=totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page>=totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page>=totalPages?'default':'pointer' }}>»</button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#818cf8', fontSize: '7px', fontWeight: '600' }}>{plan.roi}</span>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i === 0 && <Zap size={11} color='#818cf8'/>}
                    {i === 1 && <TrendingUp size={11} color='#818cf8'/>}
                    {i === 2 && <Award size={11} color='#818cf8'/>}
                    {i === 3 && <Crown size={11} color='#818cf8'/>}
                    {i === 4 && <Rocket size={11} color='#818cf8'/>}
                    {i === 5 && <Star size={11} color='#818cf8'/>}
                  </div>
                </div>
                <div style={{ color: 'white', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ color: '#6366f1', fontSize: '10px', fontWeight: '700', marginBottom: '10px' }}>{plan.price}</div>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>Minimum: ${plan.min.toLocaleString()}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>Maximum: ${plan.max ? plan.max.toLocaleString() : 'Unlimited'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>ROI: {plan.rate}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>Duration: {plan.duration} days</div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '4px' }}>Amount to invest:</div>
                <input
                  value={amounts[i]}
                  onChange={e => { const a = [...amounts]; a[i] = e.target.value; setAmounts(a); }}
                  style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '6px 8px', outline: 'none', boxSizing: 'border-box', marginBottom: '4px' }}
                />
                {amounts[i] && Number(amounts[i]) >= plan.min && user?.currency && user.currency !== 'USD' && (
                  <div style={{ fontSize: '7px', color: '#22c55e', marginBottom: '10px' }}>≈ {formatAmount(Number(amounts[i]), user.currency)}</div>
                )}
                <button onClick={() => handleJoin(plan, i)} style={{ width: '100%', padding: '7px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  Join Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}