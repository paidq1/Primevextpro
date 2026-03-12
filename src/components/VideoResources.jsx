import { useEffect, useRef, useState } from 'react';

const features = [
  {
    title: 'Trading Basics',
    description: 'Learn how to trade cryptocurrencies and forex with our beginner-friendly video tutorials.',
  },
  {
    title: 'Staking Opportunities',
    description: 'Understand how staking works and how it can generate passive income.',
  },
  {
    title: 'Security Measures',
    description: 'Discover the advanced security protocols we use to protect your assets and data.',
  },
  {
    title: 'Investment Growth',
    description: "Explore different investment strategies to maximize your portfolio's growth potential.",
  },
];

const suggestedLinks = [
  { title: 'Cryptocurrency and Forex Trading for Beginners - How It Works', duration: '22:24', channel: 'Coin Bureau', url: 'https://youtu.be/VYWc9dFqROI?si=yGiqEe0_DC0cZR8T' },
  { title: 'The Benefits of Staking and How to Get Started', duration: '09:19', channel: '99Bitcoins', url: 'https://youtu.be/0RhJBZGnOLQ?si=RjKoEVnaoQ0wgs9d' },
  { title: 'How to Keep Your Cryptocurrency Safe: Best Practices', duration: '26:02', channel: 'Coin Bureau', url: 'https://youtu.be/xzV-gj8a4yM?si=HpP1eTDipHX1cYhG' },
];

export default function VideoResources() {
  const sectionRef = useRef(null);

  return (
    <>
      <style>{`
        @keyframes vrPop {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vr-visible { animation: vrPop 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .vr-hidden { opacity: 0; transform: translateY(40px) scale(0.97); }
      `}</style>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', padding: 'clamp(8px, 2vw, 12px)', position: 'relative' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/download.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />
        <div className='scroll-anim' style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>

          {/* Left Panel */}
          <div style={{
            flex: '0 0 38%', minWidth: 0, boxSizing: 'border-box', alignSelf: 'stretch',
            background: '#141e2e',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '0px',
            padding: 'clamp(8px, 2vw, 12px)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', gap: '10px',
            marginTop: '18px',
                      }}>
            <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(10px, 2.8vw, 14px)', lineHeight: '1.4', margin: 0 }}>
              Learn the Basics of Cryptocurrency Trading and Staking
            </h2>

            <div style={{
              width: '26px', height: '26px', borderRadius: '50%', marginBottom: '4px', marginTop: '8px',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>

            <div style={{ width: '40px', height: '2px', background: '#4f46e5', marginTop: '8px' }} />

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.5', margin: 0 }}>
              Watch our videos to understand the fundamentals of cryptocurrency and forex trading, as well as the benefits of staking.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '14px', height: '14px', border: '1.5px solid #4f46e5',
                    borderRadius: '2px', flexShrink: 0, marginTop: '1px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: 'clamp(7px, 1.8vw, 10px)', marginBottom: '1px' }}>{f.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(6px, 1.6vw, 14px)', lineHeight: '1.4' }}>{f.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
              background: 'transparent', border: '1px solid #6366f1', color: 'white',
              padding: '10px 12px', borderRadius: '0px', fontSize: 'clamp(8px, 2vw, 15px)',
              fontWeight: '600', cursor: 'pointer', width: '100%', marginTop: 'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Explore More Resources
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
          </div>

          {/* Right Panel */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* Image */}
            <img
              src="/1003049384-removebg-preview.png"
              alt="Video Preview"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', background: 'transparent' }}
            />

            {/* Suggested Links */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: 'clamp(9px, 2.2vw, 17px)' }}>Suggested Links</span>
                <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suggestedLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(10,15,35,0.25)',
                    border: '1px solid rgba(79,70,229,0.4)',
                    borderLeft: '3px solid #4f46e5',
                    borderRadius: '0px', padding: '6px 8px', cursor: 'pointer',
                    textDecoration: 'none',
                  }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                    </div>
                    <div>
                      <div style={{ color: '#818cf8', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', marginBottom: '1px' }}>{link.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(6px, 1.5vw, 13px)' }}>{link.duration} ~ {link.channel}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ width: '40px', height: '2px', background: '#4f46e5', marginTop: '8px' }} />

            {/* Quote */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <img
                src="/1003049399-removebg-preview.png"
                alt="James Clark"
                style={{ width: 'clamp(36px, 9vw, 46px)', height: 'clamp(36px, 9vw, 46px)', flexShrink: 0, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 5%', background: 'white', border: '2px solid #3b82f6' }}
              />
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', margin: '0 0 4px 0', fontStyle: 'normal' }}>
                  We envision a world where financial independence is within reach for everyone. Our mission is to build a platform that empowers you to take control of your financial future.
                </p>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(6px, 1.5vw, 13px)' }}>~ James Clark</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
