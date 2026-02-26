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

  useEffect(() => {
    const els = document.querySelectorAll('.mission-anim');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('mission-visible');
          else e.target.classList.remove('mission-visible');
        });
      },
      { threshold: 0.01 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ background: "#1e2235", position: "relative", width: "100%", paddingTop: "24px", paddingBottom: "24px", boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* Purple Glow Blob - behind network graphic */}
        <div style={{ position: 'absolute', top: '0px', left: '0px', width: '150px', height: '150px', background: 'radial-gradient(circle at 40% 40%, rgba(120,60,255,0.5) 0%, rgba(100,40,220,0.2) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(35px)', zIndex: 0 }}></div>
        {/* Abstract Network Graphic - Top Left */}
        <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 1, width: '80px', height: '80px', opacity: 0.5 }}>
          <svg width='80' height='80' viewBox='0 0 80 80'>
            <line x1='10' y1='10' x2='40' y2='30' stroke='#4a5fc1' strokeWidth='0.7' opacity='0.7'/>
            <line x1='40' y1='30' x2='70' y2='15' stroke='#4a5fc1' strokeWidth='0.7' opacity='0.7'/>
            <line x1='40' y1='30' x2='55' y2='55' stroke='#4a5fc1' strokeWidth='0.7' opacity='0.7'/>
            <line x1='40' y1='30' x2='15' y2='50' stroke='#4a5fc1' strokeWidth='0.7' opacity='0.7'/>
            <line x1='10' y1='10' x2='15' y2='50' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.4'/>
            <line x1='70' y1='15' x2='55' y2='55' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.4'/>
            <line x1='15' y1='50' x2='55' y2='55' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.4'/>
            <circle cx='40' cy='30' r='3' fill='#5b6fd4' opacity='0.9'/>
            <circle cx='10' cy='10' r='1.5' fill='#4a5fc1' opacity='0.8'/>
            <circle cx='70' cy='15' r='1.5' fill='#4a5fc1' opacity='0.8'/>
            <circle cx='55' cy='55' r='1.5' fill='#4a5fc1' opacity='0.8'/>
            <circle cx='15' cy='50' r='1.5' fill='#4a5fc1' opacity='0.8'/>
          </svg>
        </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>

        {/* Left: Phone - touches left edge, no margin */}
        <div className='mission-anim mission-delay-1' style={{ flex: '0 0 38%', minWidth: 0, position: 'relative', overflow: 'hidden', alignSelf: 'flex-start', marginTop: '50px' }}>
          <img src="/mission-phone.png" alt="App mockup"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Right: big gap from phone, card on right side */}
        <div className='mission-anim mission-delay-2' style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '24px 20px 24px 55px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)',
            borderRadius: '0px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '5px',
            width: '100%',
            minHeight: '360px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <h2 style={{ color: 'white', fontWeight: '700', fontSize: '12px', margin: 0 }}>Our Mission</h2>
              <div style={{ width: '24px', height: '2px', background: '#6366f1' }} />
              <p style={{ color: 'white', fontSize: '7px', lineHeight: '1.6', margin: 0 }}>
                Founded in 2020, PrimeVest Pro is dedicated to providing secure and innovative financial solutions. Our mission is to empower our clients with the tools and knowledge to succeed in the dynamic world of crypto and forex trading. We are committed to transparency, integrity, and the highest standards of security. Our vision is to be the leading platform for crypto and forex trading worldwide, trusted by our clients for our expertise, reliability, and commitment to their success.
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
                        <span style={{ color: 'white', fontSize: '7px', fontWeight: '600', textAlign: 'left' }}>{item.title}</span>
                      </div>
                      <span style={{ color: '#6366f1', fontSize: '9px', flexShrink: 0 }}>{openIndex === index ? '∧' : '∨'}</span>
                    </button>
                    {openIndex === index && (
                      <p style={{ color: 'white', fontSize: '6.5px', lineHeight: '1.5', padding: '0 0 4px 13px', margin: 0 }}>
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ flex: 1, padding: '7px', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '7px', fontWeight: '600', cursor: 'pointer' }}>
                Get Started
              </button>
              <button style={{ flex: 1, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '7px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
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
