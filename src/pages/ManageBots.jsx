import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ManageBots() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={14}/> <span style={{ fontSize: '9px' }}>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '16px', height: '16px' }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '8px' }}>/ Manage Bots</span>
      </div>
      <div style={{ padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '4px', height: '24px', background: '#6366f1', borderRadius: '2px' }}/>
          <h1 style={{ color: 'white', fontSize: '14px', fontWeight: '700', margin: 0 }}>Manage Bots</h1>
        </div>
        <div style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.2)', padding: '32px', textAlign: 'center' }}>
          <div style={{ color: '#6366f1', fontSize: '32px', marginBottom: '12px' }}>🤖</div>
          <div style={{ color: 'white', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Coming Soon</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>This section is under development.</div>
        </div>
      </div>
    </div>
  );
}
