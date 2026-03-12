import { useEffect, useState, useRef } from 'react';

const buildPath = (prices) => {
  const w = 500, h = 100;
  const min = Math.min(...prices), max = Math.max(...prices);
  const coords = prices.map((p, i) => ({
    x: (i / (prices.length - 1)) * w,
    y: h - ((p - min) / (max - min)) * (h - 10) - 5,
  }));
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1], curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
  }
  const area = d + ` L ${coords[coords.length-1].x} ${h} L 0 ${h} Z`;
  return { line: d, area };
};

const MarketOverview = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Indices');
  const [timeRange, setTimeRange] = useState('1Y');
  const [chartPath, setChartPath] = useState({ line: '', area: '' });

  const [marketData, setMarketData] = useState([
    { symbol: 'SPXUSD', name: 'S&P 500 Index', price: '6,872.2', change: '+15.40', percent: '+0.22%', up: true, badge: '500', badgeColor: '#e53e3e' },
    { symbol: 'NSXUSD', name: 'US 100 Cash CFD', price: '24,841.7', change: '+70.70', percent: '+0.29%', up: true, badge: '100', badgeColor: '#0bc5ea' },
    { symbol: 'DJI', name: 'Dow Jones Industrial Average Index', price: '49,437.9', change: '+81.00', percent: '+0.16%', up: true, badge: '30', badgeColor: '#4299e1' },
  ]);

  const symbolMap = { Indices: '^GSPC', Futures: 'ES=F', Bonds: '^TNX', Forex: 'EURUSD=X' };
  const tabs = ['Indices', 'Futures', 'Bonds', 'Forex'];
  const timeRanges = ['1D', '1M', '3M', '1Y', '5Y', 'All'];
  const features = [
    'Live price updates for top cryptocurrencies',
    'Volume analysis for better trading insights',
    'Market cap and performance tracking',
  ];

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const symbol = encodeURIComponent(symbolMap[activeTab]);
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1wk&range=1y`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        const parsed = JSON.parse(json.contents);
        const closes = parsed.chart.result[0].indicators.quote[0].close.filter(Boolean);
        setChartPath(buildPath(closes));
      } catch (e) {
        console.error('Chart fetch failed', e);
      }
    };
    fetchChart();
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev =>
        prev.map(item => {
          const priceNum = parseFloat(item.price.replace(/,/g, ''));
          const change = (Math.random() - 0.5) * priceNum * 0.001;
          const newPrice = priceNum + change;
          const percent = ((change / newPrice) * 100).toFixed(2);
          const changeAbs = Math.abs(change).toFixed(2);
          return {
            ...item,
            price: newPrice.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
            change: (change > 0 ? '+' : '-') + changeAbs,
            percent: (change > 0 ? '+' : '') + percent + '%',
            up: change > 0,
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .market-visible { animation: popIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .market-hidden { opacity: 0; transform: translateY(40px) scale(0.97); }
      `}</style>
      <section id="market"
        ref={sectionRef}
        style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', padding: '16px 12px', width: '100%', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
      >
        <svg style={{ position: 'absolute', top: 0, right: 0, width: '52%', height: '100%', opacity: 0.25 }}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
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
          <polygon points="0,220 30,220 0,300" fill="#1f3b4d"/>
          <polygon points="30,220 100,180 80,280" fill="#29465b"/>
          <polygon points="80,280 160,240 130,340" fill="#1a3a4a"/>
          <polygon points="160,240 260,210 230,320" fill="#1f3b4d"/>
          <polygon points="230,320 370,200 340,320" fill="#29465b"/>
          <polygon points="340,320 400,280 400,400" fill="#1a3a4a"/>
          <polygon points="0,300 80,280 40,380" fill="#1f3b4d"/>
          <polygon points="130,340 230,320 180,400" fill="#29465b"/>
          <polygon points="230,320 340,320 280,400" fill="#1a3a4a"/>
        </svg>
        <div className="scroll-anim" style={{ width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'stretch' }}>
            {/* Left: Trading Card */}
            <div style={{
              flex: '0 0 48%', minWidth: 0,
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              padding: '10px',
              boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '4px 8px', fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: '500',
                    borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    background: activeTab === tab ? '#3b5bdb' : 'transparent',
                    color: activeTab === tab ? 'white' : '#64748b',
                  }}>
                    {tab}
                  </button>
                ))}
              </div>
              {/* SVG Chart */}
              <div style={{ width: '100%', marginBottom: '4px', background: 'transparent', overflow: 'hidden' }}>
                <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{ width: '100%', height: '45px', display: 'block' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chartPath.area} fill="url(#chartGrad)" />
                  <path d={chartPath.line} fill="none" stroke="#60a5fa" strokeWidth="2" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0px' }}>
                  {['Mar', 'Jun', 'Sep', '2026'].map(label => (
                    <span key={label} style={{ color: '#64748b', fontSize: '8px', fontWeight: label === '2026' ? '700' : '400' }}>{label}</span>
                  ))}
                </div>
              </div>
              {/* Time Range */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                {timeRanges.map(range => (
                  <button key={range} onClick={() => setTimeRange(range)} style={{
                    padding: '3px 6px', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '500',
                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                    background: timeRange === range ? '#3b5bdb' : 'transparent',
                    color: timeRange === range ? 'white' : '#64748b',
                  }}>
                    {range}
                  </button>
                ))}
              </div>
              {/* Market List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {marketData.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: item.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(5px, 1.4vw, 7px)' }}>{item.badge}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: 'clamp(8px, 2vw, 15px)' }}>{item.symbol}</div>
                        <div style={{ color: '#64748b', fontSize: 'clamp(6px, 1.6vw, 8px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>{item.name}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: 'clamp(8px, 2vw, 15px)' }}>{item.price}</div>
                      <div style={{ fontSize: 'clamp(6px, 1.6vw, 8px)', color: item.up ? '#48bb78' : '#fc8181', whiteSpace: 'nowrap' }}>
                        {item.change} {item.percent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '6px' }}>
              <div style={{ color: '#2dd4bf', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '600', letterSpacing: '0.06em' }}>
                Market Overview
              </div>
              <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(11px, 3vw, 15px)', lineHeight: '1.25', margin: 0 }}>
                Stay Ahead with <span style={{ color: '#818cf8' }}>Real-Time</span> Market Data
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.6', margin: 0 }}>
                Get an overview of the cryptocurrency market with live updates on major coins. Monitor price trends, trading volumes, and market capitalization, all in one place.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                      background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg style={{ width: '9px', height: '9px', color: '#818cf8' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span style={{ color: '#cbd5e1', fontSize: 'clamp(7px, 1.8vw, 10px)', lineHeight: '1.4' }}>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'transparent', border: '1px solid #6366f1', color: 'white',
                  padding: '10px 12px', borderRadius: '0px', fontSize: 'clamp(8px, 2vw, 15px)',
                  fontWeight: '500', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Explore More Markets
                <svg style={{ width: '12px', height: '12px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketOverview;
