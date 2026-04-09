import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Shield, Star, ArrowRight } from 'lucide-react';

export default function InvestingInfo() {
  const navigate = useNavigate();
  const plans = [
    { name: 'BRONZE', roi: '10% Daily', min: '$500', duration: '7 Days', color: '#cd7f32' },
    { name: 'SILVER', roi: '15% Daily', min: '$5,000', duration: '14 Days', color: '#9ca3af' },
    { name: 'GOLD', roi: '20% Daily', min: '$10,000', duration: '21 Days', color: '#f59e0b' },
    { name: 'PLATINUM', roi: '25% Daily', min: '$25,000', duration: '30 Days', color: '#6366f1' },
    { name: 'DIAMOND', roi: '30% Daily', min: '$50,000', duration: '45 Days', color: '#22d3ee' },
    { name: 'ELITE', roi: '40% Daily', min: '$100,000', duration: '60 Days', color: '#ec4899' },
  ];
  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', color: 'white', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#132035', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontWeight: '800', fontSize: '13px' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '10px', cursor: 'pointer' }}>Home</button>
          <button onClick={() => navigate('/signup')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Get Started</button>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Package size={22} color="#f59e0b" />
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Investment Plans</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', lineHeight: '1.8', marginBottom: '24px' }}>
          Choose an investment plan that suits your goals. Our managed investment packages deliver consistent daily returns with your capital fully protected.
        </p>
        {[
          { icon: <Package size={13} color="#f59e0b"/>, title: 'What is Investing?', desc: 'Investing means putting your money to work. On Quantyrex Markets, you choose a plan, deposit funds, and earn daily returns managed by our expert trading team.' },
          { icon: <Shield size={13} color="#22c55e"/>, title: 'Capital Protection', desc: 'Your initial investment is returned in full at the end of the investment period, on top of all earned profits.' },
          { icon: <TrendingUp size={13} color="#6366f1"/>, title: 'Daily Returns', desc: 'Profits are credited to your account daily throughout the investment period. Watch your balance grow every day.' },
          { icon: <Star size={13} color="#818cf8"/>, title: 'Expert Management', desc: 'Our professional trading team manages all investments using advanced strategies across crypto, forex, and commodities markets.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#1a2e4a', padding: '20px', marginBottom: '16px', borderLeft: '3px solid #f59e0b', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '10px', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', lineHeight: '1.6' }}>{item.desc}</div>
            </div>
          </div>
        ))}
        <h2 style={{ fontSize: '13px', fontWeight: '700', margin: '24px 0 12px' }}>Our Investment Plans</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: '#2e3840', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f87171', fontSize: '8px', fontWeight: '600' }}>{p.roi}</span>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '7px', fontWeight: '700' }}>{i+1}</span>
                </div>
              </div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px' }}>{p.name}</div>
              <div style={{ color: '#6366f1', fontWeight: '700', fontSize: '12px' }}>{p.min}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Duration</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px', fontWeight: '500' }}>{p.duration}</span>
              </div>
              <button onClick={() => navigate('/signup')} style={{ width: '100%', background: '#6366f1', border: 'none', color: 'white', padding: '8px', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Join Plan</button>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/signup')} style={{ background: '#f59e0b', border: 'none', color: 'white', padding: '14px 32px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Start Investing Now <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}
