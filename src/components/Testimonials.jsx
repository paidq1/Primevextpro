import { useEffect, useRef, useState } from 'react';

const testimonials = [
  { name: 'Marco Rossi', role: '~ Forex Trader', review: 'Best experience trading forex. Low fees and fast support perfect for professionals!', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Giulia Verdi', role: '~ New Trader', review: 'Simple and effective. The demo account really helped me get started confidently.', stars: 5, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rahul Sharma', role: '~ Crypto Investor', review: 'Best platform for crypto trading in India. Withdrawals are fast and the staking rewards are amazing!', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { name: 'Priya Patel', role: '~ Day Trader', review: 'I have been trading here for 6 months and my returns have been outstanding. Highly recommend!', stars: 5, avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { name: 'Amit Kumar', role: '~ Forex Trader', review: 'Very reliable platform. Customer support is excellent and always available to help.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { name: 'Sneha Reddy', role: '~ Staker', review: 'The staking yields are unbelievable. I earn passive income every day with zero stress!', stars: 5, avatar: 'https://randomuser.me/api/portraits/women/46.jpg' },
  { name: 'Alessandro Ferrari', role: '~ Staking Enthusiast', review: 'Fantastic returns and super easy to track rewards! Best staking platform I have used.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
  { name: 'Vikram Singh', role: '~ Professional Trader', review: 'Trading on this platform has changed my financial life. The tools are world class!', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { name: 'Rohan Mehta', role: '~ Swing Trader', review: 'I switched from another platform and this is 10x better. Execution is fast and fees are low!', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/37.jpg' },
  { name: 'Karan Malhotra', role: '~ Forex Trader', review: 'Outstanding forex trading experience. The charts and indicators are top notch for analysis.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Arjun Desai', role: '~ Day Trader', review: 'Best platform for active traders in India. Live data, fast orders, and great customer support.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/39.jpg' },
  { name: 'Nikhil Verma', role: '~ Professional Trader', review: 'Professional grade tools at an affordable price. My portfolio has grown 40% since joining.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/40.jpg' },
  { name: 'Luca Bianchi', role: '~ Crypto Investor', review: 'Amazing platform! The staking rewards are incredible and withdrawals are always on time.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
  { name: 'Sofia Esposito', role: '~ Day Trader', review: 'The best trading platform I have used. Fast, reliable and very secure.', stars: 5, avatar: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { name: 'Lorenzo Moretti', role: '~ Investor', review: 'Secure and reliable platform. I have seen great results with my investments.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { name: 'Ishaan Kapoor', role: '~ Crypto Investor', review: 'Very transparent platform. No hidden fees and the ROI on staking is consistently excellent.', stars: 5, avatar: 'https://randomuser.me/api/portraits/men/43.jpg' },
  { name: 'Kavya Menon', role: '~ Investor', review: 'I recommend this to all my friends. Safe, fast, and the returns are better than any bank!', stars: 5, avatar: 'https://randomuser.me/api/portraits/women/48.jpg' },
];

export default function Testimonials() {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);

  const seen = new Set();
  const uniqueVisible = [];
  for (let i = 0; uniqueVisible.length < 4 && i < testimonials.length; i++) {
    const t = testimonials[(current + i) % testimonials.length];
    if (!seen.has(t.avatar)) { seen.add(t.avatar); uniqueVisible.push(t); }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      
      <section id="reviews" ref={ref} style={{ background: '#151c27', width: '100%', boxSizing: 'border-box', padding: '24px 16px 20px 16px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '100px', height: '100px', background: 'radial-gradient(circle at 40% 40%, rgba(80,60,220,0.3) 0%, rgba(60,40,180,0.12) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '-8px', left: '0px', zIndex: 1, width: '90px', height: '90px' }}>
          <img src='/network-graph.png' style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
        </div>
        <div className='scroll-anim' style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(13px, 3.5vw, 18px)', marginBottom: '8px' }}>Trusted by Traders Worldwide</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.6', maxWidth: '280px', margin: '0 auto' }}>
            See how our platform has helped traders, investors, and crypto enthusiasts achieve their financial goals and experience secure, seamless trading.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'flex-start' }}>
          {uniqueVisible.map((t, i) => (
            <div key={i} className={`scroll-anim delay-${i+1}`}
              style={{ background: 'rgba(44,62,80,0.75)', borderRadius: '0px', padding: 'clamp(6px, 2vw, 10px)', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, animationDelay: i * 0.1 + 's' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: '#f59e0b', fontSize: 'clamp(8px, 2vw, 15px)' }}>&#9733;</span>
                  ))}
                </div>
                <span style={{ color: '#6366f1', fontSize: 'clamp(12px, 3vw, 24px)', opacity: 0.7 }}>"</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>{t.review}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <img src={t.avatar + '?v=' + t.name.replace(/s/g, '')} alt={t.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center center', minWidth: '24px', minHeight: '24px', maxWidth: '24px', maxHeight: '24px', overflow: 'hidden', flexShrink: 0 }} />
                <div style={{ width: '2px', height: '28px', background: '#6366f1', borderRadius: '2px' }} />
                <div>
                  <div style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '700' }}>{t.name}</div>
                  <div style={{ color: '#6366f1', fontSize: 'clamp(6px, 1.6vw, 8px)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '60px', height: '2px', background: '#6366f1', borderRadius: '2px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8249;</button>
            <button onClick={() => setCurrent((current + 1) % testimonials.length)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8250;</button>
          </div>
        </div>
      </section>
    </>
  );
}
