import React, { useEffect, useState, useRef } from 'react';

export default function BTCChart() {
  const canvasRef = useRef(null);
  const [candles, setCandles] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeInterval, setActiveInterval] = useState('1D');
  const [activeCoin, setActiveCoin] = useState({ symbol: 'BTCUSDT', label: 'BTC', name: 'BTC', color: '#f7931a', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' });
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [stats, setStats] = useState({ high: null, low: null, volume: null });

  const COINS = [
    { symbol: 'BTCUSDT', label: 'BTC', name: 'BTC', color: '#f7931a', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { symbol: 'ETHUSDT', label: 'ETH', name: 'ETH', color: '#627eea', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { symbol: 'BNBUSDT', label: 'BNB', name: 'BNB', color: '#f3ba2f', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { symbol: 'SOLUSDT', label: 'SOL', name: 'SOL', color: '#9945ff', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { symbol: 'XRPUSDT', label: 'XRP', name: 'XRP', color: '#00aae4', logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  ];

  const intervals = ['1m', '30m', '1h', '1D'];

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${activeCoin.symbol.toLowerCase()}@ticker`);
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      setCurrentPrice(parseFloat(d.c));
      setChange(parseFloat(d.P).toFixed(2));
    };
    return () => ws.close();
  }, [activeCoin]);

  const fetchStats = () => {
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${activeCoin.symbol}`)
      .then(r => r.json())
      .then(d => setStats({ high: parseFloat(d.highPrice), low: parseFloat(d.lowPrice), volume: parseFloat(d.quoteVolume) }));
  };

  const fetchCandles = () => {
    const ivMap = { '1m': '1m', '30m': '30m', '1h': '1h', '1D': '1d' };
    const limitMap = { '1m': 60, '30m': 60, '1h': 60, '1D': 90 };
    fetch(`https://api.binance.com/api/v3/klines?symbol=${activeCoin.symbol}&interval=${ivMap[activeInterval]}&limit=${limitMap[activeInterval]}`)
      .then(r => r.json())
      .then(data => {
        const parsed = data.map(d => ({
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        setCandles(parsed);
        setCurrentPrice(parsed[parsed.length - 1].close);
        const last = parsed[parsed.length - 1];
        const prev = parsed[parsed.length - 2];
        setChange(((last.close - prev.close) / prev.close * 100).toFixed(2));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandles();
    fetchStats();
    const interval = setInterval(fetchCandles, 30000);
    const statsInterval = setInterval(fetchStats, 30000);
    return () => { clearInterval(interval); clearInterval(statsInterval); };
  }, [activeInterval, activeCoin]);

  useEffect(() => {
    if (!canvasRef.current || candles.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 8, bottom: 8, left: 4, right: 4 };
    const allHighs = candles.map(c => c.high);
    const allLows = candles.map(c => c.low);
    const min = Math.min(...allLows);
    const max = Math.max(...allHighs);
    const range = max - min || 1;

    const totalW = W - pad.left - pad.right;
    const totalH = H - pad.top - pad.bottom;
    const candleW = Math.max(2, Math.floor(totalW / candles.length) - 1);

    const toY = v => pad.top + (1 - (v - min) / range) * totalH;
    const toX = i => pad.left + i * (totalW / candles.length) + (totalW / candles.length) / 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * totalH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    // Draw candles
    candles.forEach((c, i) => {
      const x = toX(i);
      const isUp = c.close >= c.open;
      const color = isUp ? '#22c55e' : '#ef4444';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.stroke();

      // Body
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBot = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBot - bodyTop);
      ctx.fillStyle = color;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });
  }, [candles]);

  return (
    <div style={{ marginBottom: '12px', border: '1px solid rgba(99,102,241,0.5)', background: '#252d3d', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#1e2538' }}>
        {intervals.map(iv => (
          <button key={iv} onClick={() => setActiveInterval(iv)} style={{ padding: '2px 6px', fontSize: '8px', background: activeInterval === iv ? '#6366f1' : 'transparent', border: 'none', color: activeInterval === iv ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{iv}</button>
        ))}
        <div style={{ marginLeft: '6px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
          <button onClick={() => setShowCoinPicker(!showCoinPicker)} style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 5px', cursor: 'pointer' }}>
            <img src={activeCoin.logo} style={{ width: '10px', height: '10px', borderRadius: '50%' }} />
            <span style={{ color: 'white', fontSize: '8px' }}>{activeCoin.label} / USDT</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>▼</span>
          </button>
          {showCoinPicker && (
            <div style={{ position: 'absolute', top: '22px', left: 0, background: '#1e2538', border: '1px solid rgba(99,102,241,0.5)', zIndex: 100, minWidth: '130px' }}>
              {COINS.map(coin => (
                <button key={coin.symbol} onClick={() => { setActiveCoin(coin); setShowCoinPicker(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', padding: '5px 8px', background: activeCoin.symbol === coin.symbol ? 'rgba(99,102,241,0.2)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '8px' }}>
                  <img src={coin.logo} style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                  {coin.name}
                </button>
              ))}
            </div>
          )}
          {change && <span style={{ color: parseFloat(change) >= 0 ? '#22c55e' : '#ef4444', fontSize: '7px' }}>{parseFloat(change) >= 0 ? '+' : ''}{change}%</span>}
        </div>
        {currentPrice && <span style={{ marginLeft: 'auto', color: parseFloat(change) >= 0 ? '#22c55e' : '#ef4444', fontSize: '7px', fontWeight: '700' }}>${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>}
      </div>
      {loading ? (
        <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
      ) : (
        <canvas ref={canvasRef} width={600} height={150} style={{ width: '100%', height: '150px', display: 'block' }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 8px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#252d3d' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '6px', marginBottom: '1px' }}>24H HIGH</div>
          <div style={{ color: '#22c55e', fontSize: '7px', fontWeight: '700' }}>{stats.high ? '$' + stats.high.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '6px', marginBottom: '1px' }}>24H LOW</div>
          <div style={{ color: '#ef4444', fontSize: '7px', fontWeight: '700' }}>{stats.low ? '$' + stats.low.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '6px', marginBottom: '1px' }}>24H VOL</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', fontWeight: '700' }}>{stats.volume ? (stats.volume >= 1e9 ? '$' + (stats.volume / 1e9).toFixed(2) + 'B' : '$' + (stats.volume / 1e6).toFixed(2) + 'M') : '--'}</div>
        </div>
      </div>
    </div>
  );
}
