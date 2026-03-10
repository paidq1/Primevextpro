import CryptoMarketOverview from './CryptoMarketOverview';
import { useRef } from 'react';

// @section trading
export default function TradingAnalysis() {
  const sectionRef = useRef(null);

  return (
    <section id="trading" ref={sectionRef} style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', padding: "30px 16px", boxSizing: "border-box", position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.6, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        <polygon points="0,0 80,40 60,120" fill="#1f3b4d"/>
        <polygon points="80,40 160,0 140,90" fill="#29465b"/>
        <polygon points="60,120 80,40 140,90" fill="#1a3a4a"/>
        <polygon points="160,0 240,60 200,140" fill="#1f3b4d"/>
        <polygon points="140,90 200,140 100,180" fill="#29465b"/>
        <polygon points="240,60 320,0 300,100" fill="#1a3a4a"/>
        <polygon points="200,140 240,60 300,100" fill="#1f3b4d"/>
        <polygon points="300,100 320,0 400,50" fill="#29465b"/>
        <polygon points="320,160 300,100 400,50" fill="#1a3a4a"/>
        <polygon points="0,160 60,120 30,220" fill="#29465b"/>
        <polygon points="60,120 140,90 100,180" fill="#1a3a4a"/>
        <polygon points="100,180 200,140 160,240" fill="#1f3b4d"/>
        <polygon points="200,140 300,100 260,210" fill="#29465b"/>
        <polygon points="260,210 300,100 370,200" fill="#1a3a4a"/>
        <polygon points="0,220 30,220 0,320" fill="#1f3b4d"/>
        <polygon points="30,220 100,180 80,300" fill="#29465b"/>
        <polygon points="100,180 160,240 120,320" fill="#1a3a4a"/>
        <polygon points="160,240 260,210 220,320" fill="#1f3b4d"/>
        <polygon points="260,210 370,200 340,300" fill="#29465b"/>
        <polygon points="340,300 370,200 400,280" fill="#1a3a4a"/>
        <polygon points="0,320 80,300 60,400" fill="#29465b"/>
        <polygon points="80,300 120,320 100,420" fill="#1f3b4d"/>
        <polygon points="120,320 220,320 180,420" fill="#1a3a4a"/>
        <polygon points="220,320 340,300 300,400" fill="#29465b"/>
        <polygon points="340,300 400,280 400,380" fill="#1f3b4d"/>
        <polygon points="0,400 60,400 30,500" fill="#1a3a4a"/>
        <polygon points="60,400 100,420 80,520" fill="#29465b"/>
        <polygon points="100,420 180,420 160,520" fill="#1f3b4d"/>
        <polygon points="180,420 300,400 260,500" fill="#1a3a4a"/>
        <polygon points="300,400 400,380 380,480" fill="#29465b"/>
        <polygon points="0,500 30,500 0,600" fill="#1f3b4d"/>
        <polygon points="30,500 80,520 60,600" fill="#1a3a4a"/>
        <polygon points="80,520 160,520 130,600" fill="#29465b"/>
        <polygon points="160,520 260,500 230,600" fill="#1f3b4d"/>
        <polygon points="260,500 380,480 350,600" fill="#1a3a4a"/>
        <polygon points="350,600 380,480 400,600" fill="#29465b"/>
      </svg>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', minHeight: '200px', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: '0 0 40%', minWidth: 0 }}>
          <div style={{ color: '#6366f1', fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Trading Analysis
          </div>
          <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 'clamp(11px, 3vw, 15px)', margin: '0 0 8px 0', lineHeight: '1.3' }}>
            Advanced Technical <span style={{ color: '#6366f1' }}>Analysis</span> Tools
          </h2>
          <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
            Leverage advanced tools to analyze trading patterns and price movements with customizable indicators.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {['Access RSI, MACD indicators', 'Customizable chart views', 'Real-time data for trading'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.4' }}>{item}</span>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href='/signup'} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', background: 'transparent', border: '1px solid #6366f1', color: 'white', fontSize: 'clamp(7px, 1.8vw, 10px)', fontWeight: '700', cursor: 'pointer' }}>
            Start Analyzing Now
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </button>
        </div>

        <div style={{ width: '55%', flexShrink: 0, alignSelf: 'stretch', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <CryptoMarketOverview style={{ flex: 1, height: '100%' }} />
        </div>
      </div>
    </section>
  );
}
