import { useNavigate, useLocation } from 'react-router-dom';

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const masked = email ? email.replace(/(.{1})(.*)(@.*)/, '$1**********$3') : '**********@gmail.com';
  const name = location.state?.name || '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e2538' }}>
      <div style={{ background: '#252d3d', width: '340px', padding: '40px 24px', textAlign: 'center', borderRadius: '4px' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg width='80' height='70' viewBox='0 0 80 70' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ margin: '0 auto', display: 'block' }}>
            <rect x='5' y='15' width='70' height='50' rx='4' fill='#f59e0b' opacity='0.2'/>
            <rect x='5' y='15' width='70' height='50' rx='4' stroke='#f59e0b' strokeWidth='2' fill='none'/>
            <path d='M5 20l35 25 35-25' stroke='#f59e0b' strokeWidth='2' fill='none'/>
            <circle cx='40' cy='30' r='14' fill='#f59e0b' opacity='0.9'/>
            <text x='40' y='35' textAnchor='middle' fill='white' fontSize='16' fontWeight='bold'>@</text>
          </svg>
        </div>
        <h2 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Check your mailbox!</h2>
        <p style={{ color: '#94a3b8', fontSize: '9px', marginBottom: '24px', lineHeight: '1.8' }}>
          {name ? `Hello! ${name}, an` : 'An'} email has been sent to <strong style={{ color: 'white' }}>{masked}</strong>. Please click on the included link to confirm your email.
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginBottom: '12px' }}>
          <button onClick={() => navigate('/signin')} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
            <svg width='12' height='12' fill='none' stroke='white' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/></svg>
            Resend email
          </button>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <button onClick={() => navigate('/signin')} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
            ← Return to login
          </button>
        </div>
      </div>
    </div>
  );
}
