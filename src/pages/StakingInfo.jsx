import { useNavigate } from 'react-router-dom';
import { Wallet, Lock, TrendingUp, Gift, ArrowRight } from 'lucide-react';

export default function StakingInfo() {
  const navigate = useNavigate();
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
          <Lock size={22} color="#22c55e" />
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Staking</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', lineHeight: '1.8', marginBottom: '24px' }}>
          Earn passive income by staking your crypto assets. Simply lock your tokens and earn rewards automatically — no trading experience required.
        </p>
        {[
          { icon: <Lock size={13} color="#22c55e"/>, title: 'What is Staking?', desc: 'Staking means locking up your crypto assets to support a blockchain network. In return, you earn rewards — similar to earning interest in a bank.' },
          { icon: <Gift size={13} color="#f59e0b"/>, title: 'Earn Rewards', desc: 'Earn up to 40% annually on your staked assets. Rewards are credited directly to your account balance automatically.' },
          { icon: <Wallet size={13} color="#6366f1"/>, title: 'Flexible Terms', desc: 'Choose from flexible staking periods. Withdraw anytime or lock for higher returns with fixed-term staking.' },
          { icon: <TrendingUp size={13} color="#818cf8"/>, title: 'Compound Growth', desc: 'Reinvest your staking rewards to compound your earnings over time and grow your portfolio faster.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#1a2e4a', padding: '20px', marginBottom: '16px', borderLeft: '3px solid #22c55e', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '10px', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', lineHeight: '1.6' }}>{item.desc}</div>
            </div>
          </div>
        ))}
        <button onClick={() => navigate('/signup')} style={{ background: '#22c55e', border: 'none', color: 'white', padding: '14px 32px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
          Start Staking Now <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}
