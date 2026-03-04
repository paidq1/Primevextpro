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
    width: '32px', height: '32px', borderRadius: '50%',
    background: highlight ? 'rgba(255,255,255,0.22)' : 'rgba(99,102,241,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <ellipse cx="12" cy="5" rx="8" ry="3"/>
      <path d="M4 5v4c0 1.657 3.582 3 8 3s8-1.343 8-3V5"/>
      <path d="M4 9v4c0 1.657 3.582 3 8 3s8-1.343 8-3V9"/>
      <path d="M4 13v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4"/>
    </svg>
  </div>
);

const PolyBg = ({ highlight }) => (
  <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <polygon points="0,0 120,60 60,160" fill={highlight ? 'rgba(255,255,255,0.08)' : 'rgba(60,120,130,0.35)'} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
    <polygon points="120,60 250,0 200,120" fill={highlight ? 'rgba(255,255,255,0.05)' : 'rgba(40,100,120,0.3)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="0,0 250,0 120,60" fill={highlight ? 'rgba(255,255,255,0.03)' : 'rgba(80,140,150,0.25)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="60,160 200,120 180,250" fill={highlight ? 'rgba(255,255,255,0.07)' : 'rgba(50,110,130,0.35)'} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
    <polygon points="0,160 60,160 0,280" fill={highlight ? 'rgba(255,255,255,0.04)' : 'rgba(70,130,140,0.28)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="200,120 300,80 280,220" fill={highlight ? 'rgba(255,255,255,0.06)' : 'rgba(90,150,160,0.3)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="60,160 180,250 80,320" fill={highlight ? 'rgba(255,255,255,0.05)' : 'rgba(45,105,125,0.32)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="180,250 280,220 260,340" fill={highlight ? 'rgba(255,255,255,0.04)' : 'rgba(65,125,145,0.28)'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
  </svg>
);

export default function HowItWorks() {
  return (
    <section id="how" className="relative w-full py-8 bg-[#0b0e14] overflow-hidden">

      {/* Top right crypto */}
      <div style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 5, width: '120px', height: '100px' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '5px', width: '100px', height: '100px', background: 'radial-gradient(circle at 50% 50%, rgba(220,220,255,0.6) 0%, rgba(180,180,220,0.3) 35%, transparent 70%)', borderRadius: '50%', filter: 'blur(22px)' }}></div>
        <svg width="120" height="100" viewBox="0 0 120 100" style={{ position: 'absolute', top: 0, left: 0 }}>
          <line x1="27" y1="27" x2="98" y2="67" stroke="rgba(150,120,255,0.8)" strokeWidth="1.8" strokeDasharray="3,2"/>
        </svg>
        <img src="https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" alt="TRX" style={{ position: 'absolute', top: '20px', left: '20px', width: '14px', height: '14px', borderRadius: '50%' }} />
        <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" style={{ position: 'absolute', top: '60px', right: '15px', width: '14px', height: '14px', borderRadius: '50%' }} />
      </div>

      <div className="relative z-10 px-3">
        {/* Header */}
        <div className="text-center mb-6 scroll-anim">
          <h2 className="text-lg font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-400 text-[10px] max-w-xs mx-auto leading-relaxed">
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
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                style={{
                  position: 'relative',
                  flex: 1,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  background: step.highlight ? '#4f46e5' : '#1e2d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: step.highlight ? '180px' : '150px', marginTop: step.highlight ? '25px' : '55px',
                }}
              >
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '10px' }}>{step.id}</span>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', lineHeight: '1.5', marginBottom: '6px' }}>{step.description}</p>
                  {step.learnMore && (
                    <button style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }} onClick={() => window.location.href="/signin"}>
                      Learn More <ArrowUpRight size={10} />
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
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                style={{
                  position: 'relative',
                  flex: 1,
                  borderRadius: '0px',
                  overflow: 'hidden',
                  background: '#1e2d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '150px',
                }}
              >
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '10px' }}>{step.id}</span>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>{step.title}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', lineHeight: '1.5' }}>{step.description}</p>
                </div>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <CoinIcon highlight={false} />
                </div>
              </div>
            ))}

            {/* Explore box */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              style={{
                flex: 1,
                borderRadius: '0px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '150px',
              }}
            >
              <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Explore Our Advanced Features</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', lineHeight: '1.5' }}>Unlock more tools and features designed to enhance your trading experience.</p>
              </div>
              <button onClick={() => window.location.href='/signup'} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', padding: '8px 10px', borderRadius: '4px',
                fontSize: '8px', fontWeight: '600', cursor: 'pointer', width: '100%',
              }}>
                Discover More <ArrowUpRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
