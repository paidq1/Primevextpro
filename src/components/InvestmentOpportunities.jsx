import { useEffect, useRef, useState } from 'react';

const fallbackData = [
  { name: 'Bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400', market_cap: 1284174515883, fully_diluted_valuation: 1284177727238, current_price: 64170, price_change_percentage_24h: -0.89 },
  { name: 'Ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628', market_cap: 224446850963, fully_diluted_valuation: 224446850963, current_price: 1858, price_change_percentage_24h: 0.05 },
  { name: 'Tether', image: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661', market_cap: 183640688879, fully_diluted_valuation: 189108115941, current_price: 1.0, price_change_percentage_24h: 0.02 },
  { name: 'XRP', image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442', market_cap: 82492246167, fully_diluted_valuation: 135172688380, current_price: 1.35, price_change_percentage_24h: -0.22 },
  { name: 'BNB', image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970', market_cap: 79807813171, fully_diluted_valuation: 79807812235, current_price: 584.98, price_change_percentage_24h: -2.08 },
  { name: 'USDC', image: 'https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602', market_cap: 74939035871, fully_diluted_valuation: 74943283237, current_price: 1.0, price_change_percentage_24h: 0.01 },
  { name: 'Solana', image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756', market_cap: 45227208847, fully_diluted_valuation: 49394399037, current_price: 79.53, price_change_percentage_24h: 2.05 },
  { name: 'TRON', image: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193', market_cap: 26839197118, fully_diluted_valuation: 26839313613, current_price: 0.283, price_change_percentage_24h: 0.71 },
  { name: 'Dogecoin', image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409', market_cap: 15440000000, fully_diluted_valuation: 15440000000, current_price: 0.0914, price_change_percentage_24h: 1.2 },
  { name: 'Cardano', image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png?1696502090', market_cap: 14200000000, fully_diluted_valuation: 14200000000, current_price: 0.40, price_change_percentage_24h: -1.5 },
  { name: 'Avalanche', image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369', market_cap: 12000000000, fully_diluted_valuation: 12000000000, current_price: 29.5, price_change_percentage_24h: 2.3 },
  { name: 'Shiba Inu', image: 'https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800', market_cap: 9800000000, fully_diluted_valuation: 9800000000, current_price: 0.0000168, price_change_percentage_24h: -0.8 },
  { name: 'Polkadot', image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png?1696512008', market_cap: 8500000000, fully_diluted_valuation: 8500000000, current_price: 5.8, price_change_percentage_24h: 1.1 },
  { name: 'Chainlink', image: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009', market_cap: 7200000000, fully_diluted_valuation: 7200000000, current_price: 13.5, price_change_percentage_24h: 0.6 },
  { name: 'Litecoin', image: 'https://coin-images.coingecko.com/coins/images/2/large/litecoin.png?1696501400', market_cap: 6800000000, fully_diluted_valuation: 6800000000, current_price: 92.0, price_change_percentage_24h: -0.4 },
  { name: 'Uniswap', image: 'https://coin-images.coingecko.com/coins/images/12504/large/uni.jpg?1696512319', market_cap: 5900000000, fully_diluted_valuation: 5900000000, current_price: 7.8, price_change_percentage_24h: 1.8 },
  { name: 'Stellar', image: 'https://coin-images.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png?1696501482', market_cap: 5100000000, fully_diluted_valuation: 5100000000, current_price: 0.19, price_change_percentage_24h: 0.3 },
  { name: 'Monero', image: 'https://coin-images.coingecko.com/coins/images/69/large/monero_logo.png?1696501460', market_cap: 4800000000, fully_diluted_valuation: 4800000000, current_price: 162.0, price_change_percentage_24h: -1.2 },
  { name: 'Ethereum Classic', image: 'https://coin-images.coingecko.com/coins/images/453/large/ethereum-classic-logo.png?1696501534', market_cap: 3900000000, fully_diluted_valuation: 3900000000, current_price: 19.8, price_change_percentage_24h: 0.9 },
];
export default function InvestmentOpportunities() {
  const ref = useRef(null);
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false', { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => { setCryptos(data); setLoading(false); })
      .catch(() => { setCryptos(fallbackData); setLoading(false); });
  }, []);

  const fmt = (n) => {
    if (!n) return 'N/A';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + ' T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' M';
    return n.toFixed(2);
  };

  return (
    <>
      
      <section className="scroll-anim" ref={ref} style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', width: '100%', boxSizing: 'border-box', padding: '16px', overflow: 'hidden', position: 'relative' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '52%', height: '100%', opacity: 0.6, zIndex: 0 }}
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
          <polygon points="230,320 370,200 340,320" fill="#29465b"/>
          <polygon points="340,320 400,280 400,400" fill="#1a3a4a"/>
          <polygon points="130,340 230,320 180,400" fill="#29465b"/>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'stretch', position: 'relative', zIndex: 1 }}>

          {/* Left Panel */}
          <div className="scroll-anim" style={{ flex: '0 0 40%', minWidth: 0 }}>
            <p style={{ color: '#6366f1', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', margin: '0 0 6px 0' }}>Investment Opportunities</p>
            <h2 style={{ color: 'white', fontSize: 'clamp(12px, 3.2vw, 16px)', fontWeight: '800', margin: '0 0 8px 0', lineHeight: 1.3 }}>
              Discover Profitable Investment <span style={{ color: '#6366f1' }}>Opportunities</span>
            </h2>
            <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
              Identify potential investments with our live screener tool. Filter by performance, trading volume, and market trends to find the best options for your portfolio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {['Cryptocurrency performance filters', 'Volume and liquidity analysis', 'Trend detection and investment signals'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="8" height="8" fill="none" stroke="white" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" strokeWidth="3"/></svg>
                  </div>
                  <span style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)' }}>{item}</span>
                </div>
              ))}
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "1px solid #6366f1", color: "white", padding: "7px 12px", fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', cursor: 'pointer' }} onClick={() => window.location.href="/signup"}>
              View Investment Options
              <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </button>
          </div>

          {/* Right Panel - Live Table */}
          <div className="scroll-anim delay-2" style={{ flex: 1, minWidth: 0, background: '#0d1117', borderRadius: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '8px 10px', borderBottom: '2px solid #6366f1' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(6px, 1.5vw, 7px)', fontWeight: '600' }}>NAME</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(5px, 1.3vw, 6px)' }}>{cryptos.length} MATCHES</div>
              </div>
              {['MKT CAP', 'FD MKT CAP', 'PRICE', '24H %'].map((h, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(6px, 1.5vw, 7px)', fontWeight: '600', textAlign: 'right' }}>{h}</div>
              ))}
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '160px' }}>{loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Loading live data...</div>
            ) : (
              cryptos.map((c, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={c.image} alt={c.name} style={{ width: '14px', height: '14px', borderRadius: '50%' }} />
                    <span style={{ color: '#6366f1', fontSize: 'clamp(6px, 1.5vw, 7px)', fontWeight: '500' }}>{c.name}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(6px, 1.5vw, 7px)', textAlign: 'right' }}>{fmt(c.market_cap)}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(6px, 1.5vw, 7px)', textAlign: 'right' }}>{fmt(c.fully_diluted_valuation)}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(6px, 1.5vw, 7px)', textAlign: 'right' }}>${c.current_price?.toLocaleString()}</div>
                  <div style={{ color: c.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444', fontSize: 'clamp(6px, 1.5vw, 7px)', textAlign: 'right', fontWeight: '600' }}>
                    {c.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              ))
            )}
          </div></div>

        </div>
      </section>
    </>
  );
}
