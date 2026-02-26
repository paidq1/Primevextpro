import { useRef } from 'react';

export default function TradingAnalysis() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', padding: "20px 12px", boxSizing: "border-box" }}
    >
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Trading Analysis
        </div>
        <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>
          Advanced Technical <span style={{ color: '#6366f1' }}>Analysis</span> Tools
        </h2>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: '#131722', width: '100%' }}>
        <iframe
          src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=BINANCE%3ABTCUSDT&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=131722&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=0&showpopupbutton=0&hide_top_toolbar=1&locale=en&scale=1"
          style={{ width: '100%', height: '280px', border: 'none', display: 'block' }}
          allowTransparency={true}
          scrolling="no"
          title="BTC/USD Chart"
        />
      </div>
    </section>
  );
}
