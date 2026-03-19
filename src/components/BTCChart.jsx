import React, { useEffect, useRef, useState } from 'react';

export default function BTCChart() {
  const containerRef = useRef(null);
  const [symbol, setSymbol] = useState('BINANCE:BTCUSDT');

  const coins = [
    { label: 'BTC / USDT', value: 'BINANCE:BTCUSDT' },
    { label: 'ETH / USDT', value: 'BINANCE:ETHUSDT' },
    { label: 'BNB / USDT', value: 'BINANCE:BNBUSDT' },
    { label: 'SOL / USDT', value: 'BINANCE:SOLUSDT' },
    { label: 'XRP / USDT', value: 'BINANCE:XRPUSDT' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#252d3d',
      gridColor: 'rgba(255,255,255,0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div style={{ marginBottom: '12px', border: '1px solid rgba(99,102,241,0.5)', background: '#252d3d', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#1e2538', overflowX: 'auto' }}>
        {coins.map(c => (
          <button key={c.value} onClick={() => setSymbol(c.value)} style={{ padding: '3px 8px', fontSize: '8px', background: symbol === c.value ? '#6366f1' : 'rgba(255,255,255,0.08)', border: 'none', color: 'white', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: '2px' }}>
            {c.label}
          </button>
        ))}
      </div>
      <div ref={containerRef} style={{ height: '350px', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
