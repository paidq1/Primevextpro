import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart2, Shield, Zap, ArrowRight } from 'lucide-react';

export default function TradingInfo() {
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
          <TrendingUp size={22} color="#6366f1" />
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Live Trading</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', lineHeight: '1.8', marginBottom: '24px' }}>
          Trade cryptocurrencies and forex in real-time with professional tools. Quantyrex Markets gives you access to live markets 24/7 with competitive spreads and instant execution.
        </p>
        {[
          { icon: <BarChart2 size={13} color="#6366f1"/>, title: 'Real-Time Charts', desc: 'Advanced TradingView charts with 50+ technical indicators, multiple timeframes, and drawing tools.' },
          { icon: <Zap size={13} color="#f59e0b"/>, title: 'Instant Execution', desc: 'Lightning-fast order execution with no requotes. Buy and sell at the price you see.' },
          { icon: <Shield size={13} color="#22c55e"/>, title: 'Risk Management', desc: 'Set stop-loss and take-profit levels to protect your capital and lock in profits automatically.' },
          { icon: <TrendingUp size={13} color="#818cf8"/>, title: 'Multiple Markets', desc: 'Trade BTC, ETH, and 100+ cryptocurrencies plus major forex pairs all in one platform.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#1a2e4a', padding: '20px', marginBottom: '16px', borderLeft: '3px solid #6366f1', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '10px', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', lineHeight: '1.6' }}>{item.desc}</div>
            </div>
          </div>
        ))}
        <button onClick={() => navigate('/signup')} style={{ background: '#6366f1', border: 'none', color: 'white', padding: '14px 32px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
          Start Trading Now <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}
