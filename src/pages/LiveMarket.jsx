import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { BarChart2, TrendingUp, Bitcoin } from 'lucide-react';

export default function LiveMarket() {
  const [activeTab, setActiveTab] = useState('overview');
  const [symbol, setSymbol] = useState('BTCUSD');
  const overviewRef = useRef(null);
  const chartRef = useRef(null);
  const screenerRef = useRef(null);
  const overviewLoaded = useRef(false);
  const chartLoaded = useRef(false);
  const screenerLoaded = useRef(false);

  const symbols = ['BTCUSD','ETHUSD','SOLUSD','BNBUSD','XRPUSD','ADAUSD','DOGEUSD','AVAXUSD'];

  useEffect(() => {
    if (activeTab === 'overview' && overviewRef.current && !overviewLoaded.current) {
      overviewLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: 'dark',
        dateRange: '12M',
        showChart: true,
        locale: 'en',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        width: '100%',
        height: '660',
        plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
        plotLineColorFalling: 'rgba(41, 98, 255, 1)',
        gridLineColor: 'rgba(42, 46, 57, 0)',
        scaleFontColor: 'rgba(209, 212, 220, 1)',
        belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
        belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
        symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
        tabs: [
          {
            title: 'Indices',
            symbols: [
              { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
              { s: 'FOREXCOM:NSXUSD', d: 'US 100' },
              { s: 'FOREXCOM:DJI', d: 'Dow 30' },
              { s: 'INDEX:NKY', d: 'Nikkei 225' },
              { s: 'INDEX:DEU40', d: 'DAX Index' },
              { s: 'FOREXCOM:UKXGBP', d: 'UK 100' },
            ],
            originalTitle: 'Indices',
          },
          {
            title: 'Futures',
            symbols: [
              { s: 'CME_MINI:ES1!', d: 'S&P 500 E-Mini' },
              { s: 'CME:6E1!', d: 'Euro' },
              { s: 'COMEX:GC1!', d: 'Gold' },
              { s: 'NYMEX:CL1!', d: 'Oil' },
              { s: 'NYMEX:NG1!', d: 'Gas' },
              { s: 'CBOT:ZC1!', d: 'Corn' },
            ],
            originalTitle: 'Futures',
          },
            {
            title: 'Crypto',
            symbols: [
              { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
              { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
              { s: 'BINANCE:SOLUSDT', d: 'Solana' },
              { s: 'BINANCE:BNBUSDT', d: 'BNB' },
              { s: 'BINANCE:XRPUSDT', d: 'XRP' },
              { s: 'BINANCE:ADAUSDT', d: 'Cardano' },
              { s: 'BINANCE:DOGEUSDT', d: 'Dogecoin' },
              { s: 'BINANCE:AVAXUSDT', d: 'Avalanche' },
              { s: 'BINANCE:DOTUSDT', d: 'Polkadot' },
              { s: 'BINANCE:MATICUSDT', d: 'Polygon' },
              { s: 'BINANCE:LINKUSDT', d: 'Chainlink' },
              { s: 'BINANCE:LTCUSDT', d: 'Litecoin' },
            ],
            originalTitle: 'Crypto',
          },
          {
            title: 'Forex',
            symbols: [
              { s: 'FX:EURUSD', d: 'EUR/USD' },
              { s: 'FX:GBPUSD', d: 'GBP/USD' },
              { s: 'FX:USDJPY', d: 'USD/JPY' },
              { s: 'FX:USDCAD', d: 'USD/CAD' },
              { s: 'FX:AUDUSD', d: 'AUD/USD' },
              { s: 'FX:USDCHF', d: 'USD/CHF' },
            ],
            originalTitle: 'Forex',
          },
        ],
      });
      overviewRef.current.appendChild(script);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'chart' && chartRef.current && !chartLoaded.current) {
      chartLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: 'BINANCE:' + symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        backgroundColor: '#0e1628',
        hide_top_toolbar: false,
        save_image: false,
      });
      chartRef.current.appendChild(script);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'screener' && screenerRef.current && !screenerLoaded.current) {
      screenerLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: 550,
        defaultColumn: 'overview',
        defaultScreen: 'general',
        market: 'crypto',
        showToolbar: true,
        colorTheme: 'dark',
        locale: 'en',
        isTransparent: true,
      });
      screenerRef.current.appendChild(script);
    }
  }, [activeTab]);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Header */}
      <PageHeader title="Live Market" />


      <div style={{ padding: '14px 16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp size={10}/> },
            { id: 'chart', label: 'Chart', icon: <BarChart2 size={10}/> },
            { id: 'screener', label: 'Screener', icon: <Bitcoin size={10}/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 14px', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === tab.id ? '#818cf8' : 'rgba(255,255,255,0.4)',
              fontSize: '8px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {/* Symbol Selector for Chart */}
        {activeTab === 'chart' && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {symbols.map(s => (
              <button key={s} onClick={() => setSymbol(s)} style={{
                padding: '4px 8px',
                background: symbol === s ? '#6366f1' : 'rgba(255,255,255,0.06)',
                border: 'none', color: 'white', fontSize: '7px', fontWeight: '700', cursor: 'pointer',
              }}>{s.replace('USD', '')}</button>
            ))}
          </div>
        )}

{/* Overview Widget */}
        <div style={{ display: activeTab === 'overview' ? 'block' : 'none', transform: 'scale(0.65)', transformOrigin: 'top left', width: '154%' }}>
          <div className='tradingview-widget-container' ref={overviewRef}>
            <div className='tradingview-widget-container__widget'></div>
          </div>
        </div>

        {/* Chart Widget */}
        <div style={{ display: activeTab === 'chart' ? 'block' : 'none', transform: 'scale(0.65)', transformOrigin: 'top left', width: '154%', height: '500px' }}>
          <div className='tradingview-widget-container' ref={chartRef} style={{ height: '100%' }}>
            <div className='tradingview-widget-container__widget' style={{ height: '100%' }}></div>
          </div>
        </div>

        {/* Screener Widget */}
        <div style={{ display: activeTab === 'screener' ? 'block' : 'none', transform: 'scale(0.65)', transformOrigin: 'top left', width: '154%' }}>
          <div className='tradingview-widget-container' ref={screenerRef}>
            <div className='tradingview-widget-container__widget'></div>
          </div>
        </div>

      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}