import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { CheckCircle, X, AlertCircle, Zap, TrendingUp, Award, Crown, Rocket, Star } from 'lucide-react';

const plans = [
  { name: 'BRONZE', roi: '14% Daily', price: '$500', min: 500, max: 5000, rate: '14% Daily', duration: '7 days', defaultAmt: '500' },
  { name: 'SILVER', roi: '14% Daily', price: '$5,000', min: 5000, max: 10000, rate: '14% Daily', duration: '7 days', defaultAmt: '5000' },
  { name: 'GOLD', roi: '10% Daily', price: '$10,000', min: 10000, max: 25000, rate: '10% Daily', duration: '7 days', defaultAmt: '10000' },
  { name: 'PLATINUM', roi: '50% Weekly', price: '$20,000', min: 20000, max: 50000, rate: '50% Weekly', duration: '30 days', defaultAmt: '20000' },
  { name: 'DIAMOND', roi: '100% Weekly', price: '$50,000', min: 50000, max: 300000, rate: '100% Weekly', duration: '30 days', defaultAmt: '50000' },
  { name: 'ELITE', roi: '60% Weekly', price: '$100,000', min: 100000, max: 1000000, rate: '60% Weekly', duration: '60 days', defaultAmt: '100000' },
];

const userBalance = 10000;

export default function Packages() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amounts, setAmounts] = useState(plans.map(p => p.defaultAmt));
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lowBalance, setLowBalance] = useState(false);

  const handleJoin = (plan, i) => {
    const amt = parseFloat(amounts[i]);
    if (userBalance < plan.min || userBalance < amt) {
      setLowBalance(true);
      setTimeout(() => setLowBalance(false), 4000);
    } else {
      setConfirmPlan({ ...plan, amount: amounts[i] });
    }
  };

  const handleConfirm = () => {
    setConfirmPlan(null);
    setSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Low Balance Notice */}
      {lowBalance && (
        <div style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#ef4444', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', minWidth: '260px' }}>
          <AlertCircle size={13}/>
          <span>Hello, your balance is too low for this plan. Please make a deposit.</span>
          <button onClick={() => setLowBalance(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}><X size={12}/></button>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmPlan && (
        <>
          <div onClick={() => setConfirmPlan(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 151, background: '#252d3d', border: '1px solid rgba(99,102,241,0.4)', padding: '20px', width: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Confirm Investment</span>
              <button onClick={() => setConfirmPlan(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={13}/></button>
            </div>
            {[
              ['Plan', confirmPlan.name],
              ['Amount', '$' + confirmPlan.amount],
              ['ROI', confirmPlan.roi],
              ['Duration', confirmPlan.duration],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{k}</span>
                <span style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setConfirmPlan(null)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: '8px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {success && (
        <>
          <div onClick={() => setSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Success!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Investment successful! Check transaction history for details.</div>
            <button onClick={() => setSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span>
          <span>›</span>
          <span style={{ color: 'white' }}>Join Plans</span>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <div style={{ width: '16px', height: '16px' }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em' }}>PACKAGES</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.3)', padding: '12px' }}>
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
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>Minimum Return: {plan.min.toLocaleString()}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>Maximum Return: {plan.max.toLocaleString()}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', marginBottom: '2px' }}>Rate Of Return(ROI): {plan.rate}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>Duration: {plan.duration}</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginBottom: '4px' }}>Amount to invest: (default)</div>
              <input
                value={amounts[i]}
                onChange={e => { const a = [...amounts]; a[i] = e.target.value; setAmounts(a); }}
                style={{ width: '100%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '6px 8px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <button onClick={() => handleJoin(plan, i)} style={{ width: '100%', padding: '7px', background: '#6366f1', border: 'none', color: 'white', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>
                Join Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
