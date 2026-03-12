import { useEffect, useRef, useState } from 'react';

const benefits = [
  { title: 'Low Fees & Fast Transactions', desc: 'Enjoy some of the lowest transaction fees in the market, coupled with lightning-fast execution speeds.' },
  { title: 'Advanced Trading Tools', desc: 'Access professional trading tools including charting features, technical indicators, and analysis tools.' },
  { title: 'High-Yield Staking Programs', desc: 'Maximize your earnings with flexible staking options offering high annual percentage yields (APYs).' },
  { title: 'Secure & Transparent Platform', desc: 'We prioritize security and transparency, using the latest blockchain technology to protect your assets.' },
  { title: 'Diverse Investment Options', desc: 'Choose from a wide variety of cryptocurrencies and forex pairs to diversify your investment portfolio.' },
  { title: '24/7 Customer Support', desc: 'Our expert support team is available around the clock to assist you with any issues or questions.' },
];

const Icon = () => (
  <div style={{ width: 'clamp(20px, 5vw, 26px)', height: 'clamp(20px, 5vw, 26px)', borderRadius: '50%', background: 'rgba(60,50,180,0.7)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
    </svg>
  </div>
);

export default function WhyChooseUs() {
  const ref = useRef(null);

  return (
    <>
    
    <section className="scroll-anim" ref={ref} style={{ background: '#1a2235', width: '100%', boxSizing: 'border-box', padding: '16px 8px 16px 16px', overflow: 'hidden', position: 'relative' }}>

      {/* Bottom right network graphic */}
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle at 40% 40%, rgba(80,60,220,0.35) 0%, rgba(60,40,180,0.15) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-8px', left: '0px', zIndex: 0, width: '90px', height: '90px' }}>
        <img src="/particle-network.png" alt="Network" style={{ width: '90px', height: '90px', objectFit: 'contain', opacity: 0.9 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 'clamp(8px, 3vw, 16px)', alignItems: 'flex-start' }}>

          {/* Left: Title + phone */}
          <div style={{ flex: '0 0 36%', minWidth: 0, marginLeft: '-16px' }}>
            <div style={{ paddingLeft: '16px' }}><p style={{ color: '#6366f1', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Benefits</p>
            <h2 style={{ color: 'white', fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: '800', margin: '0 0 8px 0', lineHeight: 1.3 }}>Why Choose Us?</h2>
            <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', margin: '0 0 12px 0' }}>
              Explore the unique advantages that set us apart from other platforms, ensuring you maximize your investment potential.
            </p>
            </div><img src="/mission-phone.png" alt="App" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
          </div>

          {/* Right: Benefits grid */}
          <div style={{ flex: '0 0 58%', minWidth: 0, paddingLeft: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {benefits.map((b, i) => (
                <div key={i} className={`scroll-anim delay-${i + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Icon />
                  <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: 1.3 }}>{b.title}</div>
                  <div style={{ color: 'white', fontSize: 'clamp(6px, 1.5vw, 13px)', lineHeight: '1.4' }}>{b.desc}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => window.location.href="/signup"} style={{ padding: 'clamp(5px, 1.5vw, 7px) clamp(8px, 2vw, 12px)', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Get Started Today
              </button>
              <button onClick={() => window.location.href='/signup'} style={{ padding: 'clamp(5px, 1.5vw, 7px) clamp(8px, 2vw, 12px)', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore Our Features
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
