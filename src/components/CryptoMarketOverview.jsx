import React, { useEffect, useState, useRef } from 'react';

const COINS = [
  { symbol: 'BTCUSDT', label: 'BTC', name: 'Bitcoin', color: '#f7931a', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'ETHUSDT', label: 'ETH', name: 'Ethereum', color: '#627eea', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'BNBUSDT', label: 'BNB', name: 'BNB', color: '#f3ba2f', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { symbol: 'SOLUSDT', label: 'SOL', name: 'Solana', color: '#9945ff', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
];

function Sparkline({ prices, color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !prices.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const x = i => (i / (prices.length - 1)) * W;
    const y = v => H - 2 - ((v - min) / (max - min || 1)) * (H - 4);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '55');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(x(0), y(prices[0]));
    for (let i = 1; i < prices.length; i++) {
      const cpx = (x(i-1) + x(i)) / 2;
      ctx.bezierCurveTo(cpx, y(prices[i-1]), cpx, y(prices[i]), x(i), y(prices[i]));
    }
    ctx.lineTo(x(prices.length-1), H);
    ctx.lineTo(x(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x(0), y(prices[0]));
    for (let i = 1; i < prices.length; i++) {
      const cpx = (x(i-1) + x(i)) / 2;
      ctx.bezierCurveTo(cpx, y(prices[i-1]), cpx, y(prices[i]), x(i), y(prices[i]));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [prices, color]);
  return <canvas ref={canvasRef} width={50} height={20} style={{ width: '50px', height: '20px', display: 'block' }} />;
}

export default function CryptoMarketOverview() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = () => {
    Promise.all(
      COINS.map(coin =>
        Promise.all([
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin.symbol}`).then(r => r.json()),
          fetch(`https://api.binance.com/api/v3/klines?symbol=${coin.symbol}&interval=1h&limit=24`).then(r => r.json()),
        ]).then(([ticker, klines]) => ({
          symbol: coin.symbol,
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChangePercent),
          volume: parseFloat(ticker.quoteVolume),
          high: parseFloat(ticker.highPrice),
          low: parseFloat(ticker.lowPrice),
          sparkline: klines.map(k => parseFloat(k[4])),
        }))
      )
    ).then(results => {
      const map = {};
      results.forEach(r => { map[r.symbol] = r; });
      setData(map);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) return '$' + price.toLocaleString('en', { maximumFractionDigits: 2 });
    if (price >= 1) return '$' + price.toFixed(4);
    return '$' + price.toFixed(6);
  };

  const formatVolume = (vol) => {
    if (vol >= 1e9) return '$' + (vol / 1e9).toFixed(2) + 'B';
    if (vol >= 1e6) return '$' + (vol / 1e6).toFixed(2) + 'M';
    return '$' + vol.toLocaleString();
  };

  return (
    <div style={{ background: '#1a2035', border: '1px solid rgba(99,102,241,0.3)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 6px', background: '#141824', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          <span style={{ color: 'white', fontSize: '7px', fontWeight: '700', letterSpacing: '0.08em' }}>LIVE MARKET</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lastUpdated && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px' }}>Updated {lastUpdated}</span>}
          <button onClick={fetchData} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '6px', padding: '1px 5px', cursor: 'pointer' }}>↻ Refresh</button>
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 50px 1fr', padding: '2px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {['Asset', 'Price', '24h Change', 'Chart', 'Volume'].map((h, i) => (
          <span key={i} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '7px', fontWeight: '600', textTransform: 'uppercase', textAlign: i > 1 ? 'center' : 'left' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading market data...</div>
      ) : (
        COINS.map(coin => {
          const d = data[coin.symbol];
          if (!d) return null;
          const isUp = d.change >= 0;
          return (
            <div key={coin.symbol} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 50px 1fr', padding: '2px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
              {/* Asset */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={coin.logo} alt={coin.label} style={{ width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'white', fontSize: '7px', fontWeight: '700' }}>{coin.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '5px' }}>{coin.name}</div>
                </div>
              </div>
              {/* Price */}
              <div style={{ color: 'white', fontSize: '7px', fontWeight: '600' }}>{formatPrice(d.price)}</div>
              {/* Change */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ background: isUp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: isUp ? '#22c55e' : '#ef4444', fontSize: '6px', fontWeight: '700', padding: '1px 4px', border: '1px solid ' + (isUp ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') }}>
                  {isUp ? '▲' : '▼'} {Math.abs(d.change).toFixed(2)}%
                </span>
              </div>
              {/* Sparkline */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Sparkline prices={d.sparkline} color={isUp ? '#22c55e' : '#ef4444'} />
              </div>
              {/* Volume */}
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '6px' }}>{formatVolume(d.volume)}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
