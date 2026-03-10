import { useRef } from 'react';

export default function CryptoMarketOverview() {
  return (
    <div style={{ background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)', overflow: 'hidden', height: '100%', minHeight: '0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '200%', transformOrigin: 'top left', transform: 'scale(0.5)', pointerEvents: 'auto' }}>
        <iframe
          src="https://s.tradingview.com/widgetembed/?symbol=BTCUSD&interval=30&theme=dark&style=1&locale=en&hide_top_toolbar=0&hide_legend=0&save_image=0&calendar=0"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowTransparency="true"
          scrolling="no"
        />
      </div>
    </div>
  );
}
