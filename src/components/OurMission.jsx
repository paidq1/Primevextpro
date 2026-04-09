import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const accordionItems = [
  { title: 'Empowering Clients with Cutting-Edge Trading Tools', content: 'Providing innovative tools and resources to help clients succeed in the dynamic world of crypto and forex trading.' },
  { title: 'Commitment to Transparency and Integrity', content: 'We uphold the highest standards of honesty and openness in every transaction and client interaction.' },
  { title: 'Leading the Industry in Security Standards', content: 'Our platform uses state-of-the-art encryption and security protocols to keep your assets safe at all times.' },
  { title: '24/7 Expert Support for Trading Success', content: 'Our dedicated support team is always available to assist you with any questions or concerns.' },
];

const OurMission = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ background: "#1e2235", position: "relative", width: "100%", boxSizing: 'border-box', overflow: 'hidden', paddingTop: '30px', paddingBottom: '30px' }}>
      <div style={{ position: 'absolute', top: '0px', left: '0px', width: '150px', height: '150px', background: 'radial-gradient(circle at 40% 40%, rgba(120,60,255,0.5) 0%, rgba(100,40,220,0.2) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(35px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '-8px', left: '0px', zIndex: 1, width: '90px', height: '90px' }}>
        <img src='/network-graph.png' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 'clamp(10px, 3vw, 20px)', paddingRight: '12px', minHeight: 'unset' }}>

        {/* Left: Phone */}
        <div className="scroll-anim" style={{ flex: '0 0 38%', minWidth: 0, position: 'relative', maxHeight: 'clamp(260px, 65vw, 340px)', overflow: 'hidden', marginTop: '40px' }}>
          <img src="/mission-phone.png" alt="App mockup"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Right: Card - full height */}
        <div className="scroll-anim delay-2" style={{ flex: '0 0 48%', display: 'flex', alignItems: 'stretch', padding: '0px 12px 0px 0px', marginLeft: 'auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', minHeight: 'unset',
            padding: 'clamp(10px, 2.5vw, 16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px',
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(10px, 2.5vw, 13px)', margin: 0 }}>Our Mission</h2>
              <div style={{ width: '24px', height: '2px', background: '#6366f1' }} />
              <p style={{ color: 'white', fontSize: 'clamp(6px, 1.6vw, 8px)', lineHeight: '1.5', margin: 0 }}>
                Founded in 2020, Quantyrex Markets is dedicated to providing secure and innovative financial solutions. Our mission is to empower our clients with the tools and knowledge to succeed in the dynamic world of crypto and forex trading. We are committed to transparency, integrity, and the highest standards of security. Our vision is to be the leading platform for crypto and forex trading worldwide, trusted by our clients for our expertise, reliability, and commitment to their success.
              </p>
              <div style={{ width: '24px', height: '1px', background: 'rgba(99,102,241,0.4)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {accordionItems.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                        </svg>
                        <span style={{ color: 'white', fontSize: 'clamp(6px, 1.5vw, 13px)', fontWeight: '600', textAlign: 'left' }}>{item.title}</span>
                      </div>
                      <span style={{ color: '#6366f1', fontSize: '9px', flexShrink: 0 }}>{openIndex === index ? '∧' : '∨'}</span>
                    </button>
                    {openIndex === index && (
                      <p style={{ color: 'white', fontSize: 'clamp(6px, 1.4vw, 7.5px)', lineHeight: '1.4', padding: '0 0 4px 13px', margin: 0 }}>
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => window.location.href="/signup"} style={{ flex: 1, padding: '7px', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '7px', fontWeight: '600', cursor: 'pointer' }}>
                Get Started
              </button>
              <button style={{ flex: 1, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }} onClick={() => window.location.href="/signin"}>
                Learn More <ArrowUpRight size={8} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OurMission;
