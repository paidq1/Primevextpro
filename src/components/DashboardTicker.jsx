import { useState, useEffect } from 'react';

const coins = [
  { id: 'bitcoin', symbol: 'BTC', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', color: '#627eea' },
  { id: 'binancecoin', symbol: 'BNB', color: '#f3ba2f' },
  { id: 'solana', symbol: 'SOL', color: '#9945ff' },
  { id: 'ripple', symbol: 'XRP', color: '#00aae4' },
  { id: 'cardano', symbol: 'ADA', color: '#0033ad' },
  { id: 'tether', symbol: 'USDT', color: '#26a17b' },
  { id: 'dogecoin', symbol: 'DOGE', color: '#c2a633' },
];

export default function DashboardTicker() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = () => {
      const ids = coins.map(c => c.id).join(',');
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
        .then(r => r.json())
        .then(data => { setPrices(data); setLoading(false); })
        .catch(() => setLoading(false));
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = coins.map(coin => {
    const data = prices[coin.id];
    if (!data) return null;
    const change = data.usd_24h_change?.toFixed(2);
    const isPos = change >= 0;
    return (
      <div key={coin.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, marginRight: '24px' }}>
        <span style={{ color: coin.color, fontSize: '8px', fontWeight: '700' }}>{coin.symbol}</span>
        <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>${data.usd?.toLocaleString()}</span>
        <span style={{ color: isPos ? '#22c55e' : '#ef4444', fontSize: '7px' }}>{isPos ? '+' : ''}{change}%</span>
      </div>
    );
  }).filter(Boolean);

  return (
    <div style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6px 0', display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, padding: '0 10px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: '600' }}>LIVE</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        {loading ? (
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '0 12px' }}>Loading...</span>
        ) : (
          <div style={{ display: 'flex', animation: 'ticker 20s linear infinite', width: 'max-content' }}>
            {tickerItems}
            {tickerItems}
          </div>
        )}
      </div>
    </div>
  );
}
