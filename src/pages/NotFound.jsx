import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ color: '#6366f1', fontSize: '72px', fontWeight: '800', lineHeight: 1 }}>404</div>
      <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginTop: '12px' }}>Page Not Found</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', marginBottom: '24px' }}>The page you're looking for doesn't exist.</div>
      <button onClick={() => navigate('/')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', padding: '10px 24px', cursor: 'pointer' }}>
        Go to Dashboard
      </button>
    </div>
  );
}
