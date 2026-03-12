import { ArrowUpRight } from 'lucide-react';

const steps = [
  {
    id: '01.',
    title: 'Register',
    description: 'Sign up easily by filling in your details and verifying your identity to secure your account.',
    highlight: false,
  },
  {
    id: '02.',
    title: 'Deposit Funds',
    description: 'Once registered, fund your account using any of our supported methods including bank transfers, credit cards, or e-wallets.',
    highlight: true,
    learnMore: true,
  },
  {
    id: '03.',
    title: 'Start Trading',
    description: 'Dive into trading with our user-friendly platform. Access real-time data, make trades, and explore advanced tools to help you make informed decisions.',
    highlight: false,
  },
  {
    id: '04.',
    title: 'Manage Portfolio',
    description: 'Monitor your portfolio, adjust your strategies, and use our automated tools to keep track of your progress.',
    highlight: false,
  },
  {
    id: '05.',
    title: 'Withdraw Profits',
    description: 'Easily withdraw your profits whenever you choose, with fast and secure transactions.',
    highlight: false,
  },
];

const CoinIcon = ({ highlight }) => (
  <div style={{
    width: 'clamp(24px, 6vw, 32px)', height: 'clamp(24px, 6vw, 32px)', borderRadius: '50%',
    background: highlight ? 'rgba(255,255,255,0.22)' : 'rgba(99,102,241,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <ellipse cx="12" cy="5" rx="8" ry="3"/>
      <path d="M4 5v4c0 1.657 3.582 3 8 3s8-1.343 8-3V5"/>
      <path d="M4 9v4c0 1.657 3.582 3 8 3s8-1.343 8-3V9"/>
      <path d="M4 13v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4"/>
    </svg>
  </div>
);

export default function HowItWorks() {
  return (
    <section id="how" className="relative w-full py-8 bg-[#0b0e14] overflow-hidden">

      {/* Top right crypto */}
      <div style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 5, width: '80px', height: '80px' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '5px', width: '80px', height: '80px', background: 'radial-gradient(circle at 50% 50%, rgba(220,220,255,0.4) 0%, rgba(180,180,220,0.2) 35%, transparent 70%)', borderRadius: '50%', filter: 'blur(18px)' }}></div>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: 0, left: 0 }}>
          <line x1="20" y1="20" x2="60" y2="60" stroke="rgba(150,120,255,0.8)" strokeWidth="1.2" strokeDasharray="2,2"/>
        </svg>
        <img src="https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" alt="TRX" style={{ position: 'absolute', top: '14px', left: '14px', width: '12px', height: '12px', borderRadius: '50%' }} />
        <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" style={{ position: 'absolute', top: '54px', left: '54px', width: '12px', height: '12px', borderRadius: '50%' }} />
      </div>

      {/* Background glow clouds */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(45px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(35px)', zIndex: 0 }}></div>

      <div className="relative z-10 px-3">
        {/* Header */}
        <div className="text-center mb-6 scroll-anim">
          <h2 style={{ fontSize: 'clamp(15px, 4.5vw, 22px)' }} className="font-bold text-white mb-2">How It Works</h2>
          <p style={{ fontSize: 'clamp(9px, 2.5vw, 13px)' }} className="text-gray-400 max-w-xs mx-auto leading-relaxed">
            Explore the advanced Start trading, staking, and investing with our user-friendly platform. Follow these simple steps to begin your financial journey.
          </p>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-2 scroll-anim delay-2">
          {/* Row 1 - 3 cards */}
          <div className="flex flex-row gap-2 items-start scroll-anim delay-3">
            {steps.slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  flex: 1,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  background: step.highlight ? '#4f46e5' : '#1e2d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: 'clamp(8px, 2vw, 12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: step.highlight ? 'clamp(150px, 38vw, 180px)' : 'clamp(120px, 32vw, 150px)',
                  marginTop: step.highlight ? '25px' : '55px',
                }}
              >
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 'clamp(8px, 2vw, 15px)' }}>{step.id}</span>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: 'clamp(9px, 2.5vw, 12px)' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.5', marginBottom: '6px' }}>{step.description}</p>
                  {step.learnMore && (
                    <button style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(7px, 1.8vw, 15px)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }} onClick={() => window.location.href="/signin"}>
                      Learn More <ArrowUpRight size={9} />
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <CoinIcon highlight={step.highlight} />
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - 2 cards + explore box */}
          <div className="flex flex-row gap-2 scroll-anim delay-4">
            {steps.slice(3, 5).map((step, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  flex: 1,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  background: '#1e2d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: 'clamp(8px, 2vw, 12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 'clamp(120px, 32vw, 150px)',
                }}
              >
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 'clamp(8px, 2vw, 15px)' }}>{step.id}</span>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: 'clamp(9px, 2.5vw, 12px)' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.5' }}>{step.description}</p>
                </div>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <CoinIcon highlight={false} />
                </div>
              </div>
            ))}

            {/* Explore box */}
            <div
              style={{
                flex: 1,
                borderRadius: '0px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 'clamp(8px, 2vw, 12px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 'clamp(120px, 32vw, 150px)',
              }}
            >
              <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: 'clamp(9px, 2.5vw, 12px)', marginBottom: '6px' }}>Explore Our Advanced Features</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.5' }}>Unlock more tools and features designed to enhance your trading experience.</p>
              </div>
              <button onClick={() => window.location.href='/signup'} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', padding: 'clamp(6px, 1.5vw, 13px) clamp(8px, 2vw, 15px)',
                borderRadius: '4px', fontSize: 'clamp(7px, 1.8vw, 15px)',
                fontWeight: '600', cursor: 'pointer', width: '100%',
              }}>
                Discover More <ArrowUpRight size={9} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
