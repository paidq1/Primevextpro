import { useState, useEffect } from 'react';

const coins = [
  { id: 'bitcoin', symbol: 'BTC', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', color: '#627eea' },
  { id: 'binancecoin', symbol: 'BNB', color: '#f3ba2f' },
  { id: 'solana', symbol: 'SOL', color: '#9945ff' },
  { id: 'ripple', symbol: 'XRP', color: '#00aae4' },
  { id: 'cardano', symbol: 'ADA', color: '#0033ad' },
];

export default function MarketTicker() {
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

  return (
    <div style={{ background: '#131722', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: '600' }}>LIVE</span>
      </div>
      {loading ? (
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</span>
      ) : (
        coins.map(coin => {
          const data = prices[coin.id];
          if (!data) return null;
          const change = data.usd_24h_change?.toFixed(2);
          const isPos = change >= 0;
          return (
            <div key={coin.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
              <span style={{ color: coin.color, fontSize: '8px', fontWeight: '700' }}>{coin.symbol}:</span>
              <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>${data.usd?.toLocaleString()}</span>
              <span style={{ color: isPos ? '#22c55e' : '#ef4444', fontSize: '7px' }}>{isPos ? '+' : ''}{change}%</span>
            </div>
          );
        })
      )}
    </div>
  );
}
