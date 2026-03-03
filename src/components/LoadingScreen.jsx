export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e1628',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* Animated Logo */}
      <div style={{ position: 'relative', width: '40px', height: '40px', marginBottom: '16px' }}>
        {/* Spinning ring */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#6366f1',
          borderRightColor: '#6366f1',
          animation: 'spin 1s linear infinite'
        }} />
        {/* Logo in center */}
        <div style={{ position: 'absolute', inset: '8px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div style={{ color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', marginBottom: '6px' }}>
        VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '5px', height: '5px',
            borderRadius: '50%',
            background: '#6366f1',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
