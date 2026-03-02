import { useEffect, useRef, useState } from 'react';

const awards = [
  { num: '01.', title: 'Century International Quality Gold ERA Award', org: '- Fintech Innovation Summit', desc: 'The prestigious award was given to VertexTrade Pro Trades in recognition of our outstanding commitment to Quality and Excellence, particularly in the realm of Customer Satisfaction.', img: '/award1.png' },
  { num: '02.', title: 'Most Innovative Binary Option Platform', org: '- Crypto Excellence Awards', desc: "As Steve Jobs once said, innovation distinguishes between leaders and followers. Our innovative approach makes our product shine—and the evidence is in this beautiful accolade.", img: '/award2.png' },
  { num: '03.', title: 'Most Reliable Binary Options Broker', org: '- MasterForex-V Academy', desc: "Our first priority is the security of our clients' funds. This was recognized by the experts at MasterForex-V, who awarded VertexTrade Pro Trades the title of Most Trusted Binary Options Broker.", img: '/award3.png' },
  { num: '04.', title: "World's Leading Binary Options Broker", org: '- Most Trusted Forex Broker 2021', desc: "As Steve Jobs once said, innovation distinguishes between leaders and followers. Our innovative approach makes our product shine—and the evidence is in this beautiful accolade.", img: '/award4.png', small: true },
  { num: '05.', title: "World's Leading Binary Options Broker", org: '- MasterForex-V Academy', desc: "At the same MasterForex-V VertexTrade Pro was awarded for being the World's Leading Binary Options Broker. The perfection in our service and product was recognized by the experts of the conference in 2014.", img: '/award5.png' },
  { num: '06.', title: 'Most Innovative Binary Option Platform', org: '- Top Innovation in Staking 2022', desc: "As Steve Jobs once said, innovation distinguishes between leaders and followers. Our innovative approach makes our product shine—and the evidence is in this beautiful accolade.", img: '/award6.png' },
];

export default function Achievements() {
  const ref = useRef(null);

  return (
    <>
      
      <section ref={ref} style={{ background: '#293137', width: '100%', boxSizing: 'border-box', padding: '32px 16px 16px 16px', overflow: 'hidden' }}>
        <div className="scroll-anim">

          {/* Top: Title + Image */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', margin: '0 12px 24px 12px' }}>

            {/* Left */}
            <div style={{ flex: '0 0 48%', minWidth: 0 }}>
              <h2 style={{ color: 'white', fontSize: '14px', fontWeight: '800', margin: '0 0 6px 0' }}>Our Achievements</h2>
              <p style={{ color: 'white', fontSize: '7px', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                We are proud to have received numerous prestigious awards that recognize our commitment to innovation, security, and customer satisfaction in the cryptocurrency and trading industry.
              </p>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid #6366f1', color: 'white', padding: '7px 12px', borderRadius: '4px', fontSize: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Explore Our Features
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </button>
            </div>

            {/* Right: Image with badge */}
            <div style={{ flex: 1, position: 'relative' }}>
              <img src="/achievements-bg.jpg" alt="Team" style={{ width: '100%', borderRadius: '5px', display: 'block', borderTop: 'none', borderLeft: 'none', borderBottom: '4px solid rgba(120,80,255,0.9)', borderRight: '4px solid rgba(120,80,255,0.9)', boxShadow: '6px 6px 25px rgba(120,80,255,0.7)', height: '170px', objectFit: 'cover', objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', background: '#2d1f6e', borderRadius: '50%', width: '58px', height: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '9px' }}>10+ Years</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '6px', fontWeight: '600' }}>Experience</span>
              </div>
            </div>
          </div>

          {/* Awards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '0 12px' }}>
            {awards.map((a, i) => (
              <div key={i} className={`scroll-anim delay-${(i % 5) + 1}`} style={{ background: '#344d58', borderRadius: '0px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'sans-serif' }}>
                <span style={{ color: '#6366f1', fontSize: '9px', fontWeight: '700' }}>{a.num}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', flexShrink: 0, width: '70px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(150,130,255,0.6) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(8px)' }}></div>
                    <img src={a.img} alt={a.title} style={{ width: a.small ? '70%' : '100%', height: a.small ? '70%' : '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} onError={e => e.target.style.display='none'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '7.5px', lineHeight: '1.3', marginBottom: '2px' }}>{a.title}</div>
                    <div style={{ color: '#6366f1', fontSize: '6.5px', marginBottom: '6px' }}>{a.org}</div>
                    <div style={{ color: 'rgba(255,255,255,1)', fontSize: '6.5px', lineHeight: '1.4' }}>{a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
