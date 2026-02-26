import { ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const features = [
  'Access multiple technical indicators (e.g., RSI, MACD)',
  'Customizable chart views for personalized analysis',
  'Real-time data for accurate trading decisions',
];

const generateCandles = () => {
  const candles = [];
  let price = 96000;
  for (let i = 0; i < 60; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * 2000;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 800;
    const low = Math.min(open, close) - Math.random() * 800;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
};

const candles = generateCandles();

function CandleChart() {
  const [activeTime, setActiveTime] = useState('D');
  const times = ['1m', '30m', '1h', 'D'];

  const W = 500, H = 320;
  const padL = 8, padR = 55, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP;

  const toY = (p) => padT + chartH - ((p - minP) / range) * chartH;
  const candleW = chartW / candles.length;

  const priceLabels = Array.from({ length: 6 }, (_, i) => Math.round(minP + (range / 5) * i));
  const lastClose = candles[candles.length - 1].close;
  const firstClose = candles[0].close;
  const priceDiff = lastClose - firstClose;
  const pricePct = ((priceDiff / firstClose) * 100).toFixed(2);
  const isUp = priceDiff >= 0;

  const dateLabels = ['2026', 'Feb', 'Mar'];

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0px', overflow: 'hidden', background: '#131722' }}>
      <div style={{ background: '#131722', padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ color: 'white', fontSize: '7px', fontWeight: '700' }}>BTCUSD</span>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '8px', lineHeight: 1 }}>+</span>
        </div>
        <div style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.15)' }}/>
        {times.map(t => (
          <span key={t} onClick={() => setActiveTime(t)} style={{
            color: activeTime === t ? 'white' : '#6b7280', fontSize: '7px', fontWeight: activeTime === t ? '700' : '400',
            background: activeTime === t ? '#3b5bdb' : 'transparent', padding: '1px 3px', borderRadius: '2px', cursor: 'pointer',
          }}>{t}</span>
        ))}
        <div style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.15)' }}/>
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '2px', padding: '1px 2px' }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="7" width="5" height="10"/><rect x="9" y="4" width="5" height="16"/><rect x="16" y="9" width="5" height="8"/></svg>
        </div>
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style={{ color: '#9ca3af', fontSize: '6px' }}>Indicators</span>
        </div>
      </div>

      <div style={{ background: '#131722', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f7931a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '6px', fontWeight: '700' }}>₿</span>
        </div>
        <span style={{ color: '#9ca3af', fontSize: '6px' }}>Bitcoin / U.S. Dollar · 1D · Bitstamp</span>
        <span style={{ color: isUp ? '#26a69a' : '#ef5350', fontSize: '7px', fontWeight: '700', marginLeft: '4px' }}>
          {Math.round(lastClose).toLocaleString()} {priceDiff > 0 ? '+' : ''}{Math.round(priceDiff).toLocaleString()} ({pricePct}%)
        </span>
      </div>

      <svg width="100%" viewBox={"0 0 " + W + " " + H} style={{ display: 'block', background: '#131722' }}>
        {priceLabels.map((p, i) => (
          <g key={i}>
            <line x1={padL} y1={toY(p)} x2={W - padR} y2={toY(p)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2,2"/>
            <text x={W - padR + 4} y={toY(p) + 3} fill="#9ca3af" fontSize="6" textAnchor="start">
              {(p / 1000).toFixed(0)},000
            </text>
          </g>
        ))}
        <line x1={padL} y1={toY(lastClose)} x2={W - padR} y2={toY(lastClose)} stroke="#ef5350" strokeWidth="0.5" strokeDasharray="3,2"/>
        <rect x={W - padR} y={toY(lastClose) - 5} width={padR - 2} height="10" fill="#ef5350" rx="1"/>
        <text x={W - padR + 2} y={toY(lastClose) + 3} fill="white" fontSize="6" fontWeight="bold">
          {Math.round(lastClose).toLocaleString()}
        </text>
        {candles.map((c, i) => {
          const x = padL + i * candleW + candleW * 0.1;
          const w = candleW * 0.8;
          const up = c.close >= c.open;
          const color = up ? '#26a69a' : '#ef5350';
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH = Math.max(bodyBot - bodyTop, 1);
          return (
            <g key={i}>
              <line x1={x + w / 2} y1={toY(c.high)} x2={x + w / 2} y2={toY(c.low)} stroke={color} strokeWidth="0.5"/>
              <rect x={x} y={bodyTop} width={w} height={bodyH} fill={color} opacity="0.9"/>
            </g>
          );
        })}
        {candles.map((c, i) => {
          const x = padL + i * candleW + candleW * 0.1;
          const w = candleW * 0.8;
          const up = c.close >= c.open;
          const vol = Math.abs(c.close - c.open) / 2000;
          const barH = Math.max(vol * 20, 2);
          return (
            <rect key={i} x={x} y={H - padB - barH} width={w} height={barH}
              fill={up ? '#26a69a' : '#ef5350'} opacity="0.4"/>
          );
        })}
        {dateLabels.map((label, i) => (
          <text key={i} x={padL + (chartW / (dateLabels.length)) * i + 20} y={H - 8} fill="#9ca3af" fontSize="7" textAnchor="middle">{label}</text>
        ))}
      </svg>
    </div>
  );
}

export default function TradingAnalysis() {
  const sectionRef = useRef(null);

  return (
    <>
      <style>{`
        @keyframes taPop {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ta-visible { animation: taPop 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .ta-hidden { opacity: 0; transform: translateY(40px) scale(0.97); }
      `}</style>
      <section
        ref={sectionRef}
        style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #29465b 100%)', paddingLeft: "12px", paddingRight: "12px", boxSizing: "border-box" }}
      >
        <div className="relative z-10 px-4">
          <div className="flex flex-row gap-4" style={{ alignItems: "stretch" }}>
            <div className="w-1/2 flex flex-col space-y-2">
              <div style={{ color: '#6366f1', fontSize: '9px', fontWeight: '600', letterSpacing: '0.05em' }}>
                Trading Analysis
              </div>
              <h2 className="text-white font-bold leading-tight" style={{ fontSize: '14px' }}>
                Advanced Technical <span style={{ color: '#6366f1' }}>Analysis</span> Tools
              </h2>
              <p className="text-gray-200 leading-relaxed" style={{ fontSize: '8px' }}>
                Leverage advanced tools to analyze trading patterns and price movements. Our platform provides charting solutions with customizable indicators for deeper insights.
              </p>
              <div className="space-y-1">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                      style={{ width: '14px', height: '14px', background: 'rgba(99,102,241,0.2)' }}>
                      <svg style={{ width: '7px', height: '7px', color: '#6366f1' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-200" style={{ fontSize: '8px' }}>{feature}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 font-medium transition-all w-fit mt-2"
                style={{ background: 'transparent', border: '1px solid #6366f1', color: 'white', padding: "6px 14px", borderRadius: '4px', fontSize: '8px' }}>
                Start Analyzing Now <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="w-1/2" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CandleChart />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
