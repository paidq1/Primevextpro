import { useState } from 'react';

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '70px', right: '12px', zIndex: 1000 }}>
      {/* Chat popup */}
      {open && (
        <div style={{
          position: 'absolute', bottom: '50px', right: '0',
          width: '220px', background: '#1a2535', borderRadius: '8px',
          padding: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          marginBottom: '8px',
        }}>
          <h4 style={{ color: 'white', fontSize: '10px', fontWeight: '700', marginBottom: '6px' }}>Live Support</h4>
          <p style={{ color: '#94a3b8', fontSize: '8px', lineHeight: '1.6', marginBottom: '10px' }}>
            Hi! How can we help you today? Our support team is available 24/7.
          </p>
          <a href="mailto:support@quantyrexprox.cc" style={{
            display: 'block', background: '#6366f1', color: 'white',
            fontSize: '8px', fontWeight: '600', padding: '8px',
            borderRadius: '4px', textAlign: 'center', textDecoration: 'none',
          }}>
            Start Chat
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #818cf8)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(99,102,241,0.6)',
          position: 'relative',
        }}
      >
        <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {/* Green online dot */}
        <div style={{
          position: 'absolute', bottom: '2px', right: '2px',
          width: '12px', height: '12px', borderRadius: '50%',
          background: '#22c55e', border: '2px solid #1a2535',
        }} />
      </button>
    </div>
  );
};

export default FloatingChat;
