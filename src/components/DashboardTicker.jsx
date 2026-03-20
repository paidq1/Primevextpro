import { useState, useEffect } from 'react';

const coins = [
  { id: 'bitcoin', symbol: 'BTC', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'binancecoin', symbol: 'BNB', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'solana', symbol: 'SOL', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'dogecoin', symbol: 'DOGE', logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'tether', symbol: 'USDT', logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
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

  const tickerItems = coins.map((coin) => {
    const data = prices[coin.id];
    if (!data) return null;
    const change = data.usd_24h_change?.toFixed(2);
    const isPos = parseFloat(change) >= 0;
    return (
      <div key={coin.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, padding: '0 14px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <img src={coin.logo} style={{ width: '12px', height: '12px', borderRadius: '50%' }} alt={coin.symbol} onError={e => e.target.style.display='none'} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px' }}>{coin.symbol} to USD</span>
        <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>${data.usd?.toLocaleString()}</span>
        <span style={{ color: isPos ? '#22c55e' : '#ef4444', fontSize: '7px' }}>{isPos ? '+' : ''}{change}%</span>
      </div>
    );
  }).filter(Boolean);

  return (
    <div style={{ background: 'transparent', padding: '5px 0', display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <style>{`
        @keyframes dashTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      {loading ? (
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '0 12px' }}>Loading...</span>
      ) : (
        <div style={{ display: 'flex', animation: 'dashTicker 30s linear infinite', width: 'max-content' }}>
          {tickerItems}
          {tickerItems}
        </div>
      )}
    </div>
  );
}
