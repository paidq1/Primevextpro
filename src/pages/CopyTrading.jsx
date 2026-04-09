import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, FlaskConical, Heart, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getTraders } from '../services/api';

const TRADERS_DEFAULT = [
  { id: 1, name: 'Ross Cameron',
    bio: 'A full-time day trader and the founder of Warrior Trading, a trading education platform and community that teaches people how to trade stocks. Ross is known for his small account challenge and momentum trading strategy. He has been trading for over 10 years and specializes in low-priced, high-volume stocks. His strategy focuses on breakouts, momentum, and volume analysis. Ross\'s trading style is aggressive with a high win rate but also carries higher risk. He trades daily and shares his live trades with his community.', location: 'Vermont, USA', flag: '🇺🇸', followers: '1.2k', risk: 6.5, favorite: 'AAPL', totalTrades: 300, totalLoss: 12, profitShare: 20.5, winRate: 75, img: 'https://ui-avatars.com/api/?name=Ross+Cameron&background=6366f1&color=fff&size=128', verified: true },
  { id: 2, name: 'Rayner Teo',
    bio: 'A professional trader and author from Singapore. Rayner specializes in price action trading, candlestick patterns, and support/resistance strategies. He is the founder of TradingwithRayner and has taught over 10,000 students worldwide. His trading style is conservative with a focus on risk management and consistent returns. Rayner\'s strategy focuses on high-probability setups and he emphasizes the importance of patience and discipline in trading.', location: 'Singapore', flag: '🇸🇬', followers: '3.4k', risk: 4.8, favorite: 'SPY', totalTrades: 820, totalLoss: 34, profitShare: 18.0, winRate: 82, img: 'https://ui-avatars.com/api/?name=Rayner+Teo&background=22c55e&color=fff&size=128', verified: true },
  { id: 3, name: 'Kathy Lien',
    bio: 'Managing Director of FX Strategy at BK Asset Management, Kathy is a renowned forex expert and author of several trading books including "Day Trading the Currency Market" and "The Little Book of Currency Trading". She specializes in forex trading with a focus on fundamental analysis and central bank policies. Her trading approach combines technical and fundamental analysis for high-probability trades.', location: 'New York, USA', flag: '🇺🇸', followers: '2.1k', risk: 5.4, favorite: 'EURUSD', totalTrades: 950, totalLoss: 21, profitShare: 15.2, winRate: 79, img: 'https://ui-avatars.com/api/?name=Kathy+Lien&background=ec4899&color=fff&size=128', verified: true },
  { id: 4, name: 'Nicola Duke', location: 'United Kingdom', flag: '🇬🇧', followers: '1.6k', risk: 5.2, favorite: 'GBPUSD', totalTrades: 540, totalLoss: 15, profitShare: 19.5, winRate: 81, img: 'https://ui-avatars.com/api/?name=Nicola+Duke&background=f59e0b&color=fff&size=128', verified: true },
  { id: 5, name: 'Anton Kreil', location: 'London, UK', flag: '🇬🇧', followers: '2.8k', risk: 7.1, favorite: 'ETH', totalTrades: 1200, totalLoss: 45, profitShare: 12.5, winRate: 88, img: 'https://ui-avatars.com/api/?name=Anton+Kreil&background=3b82f6&color=fff&size=128', verified: true },
  { id: 6, name: 'Timothy Sykes',
    bio: 'A well-known penny stock trader and entrepreneur. Timothy turned $12,415 into over $1 million trading penny stocks. He runs a trading education platform and is known for his aggressive short-selling strategies. His style is high-risk, high-reward with a focus on momentum and news catalysts in small-cap stocks. He emphasizes the importance of studying past stock charts and learning from failures.', location: 'Miami, USA', flag: '🇺🇸', followers: '4.1k', risk: 9.1, favorite: 'TSLA', totalTrades: 1800, totalLoss: 280, profitShare: 25.0, winRate: 65, img: 'https://ui-avatars.com/api/?name=Timothy+Sykes&background=ef4444&color=fff&size=128', verified: true },
  { id: 7, name: 'Nial Fuller', location: 'Australia', flag: '🇦🇺', followers: '1.8k', risk: 5.1, favorite: 'GBPUSD', totalTrades: 610, totalLoss: 18, profitShare: 22.3, winRate: 84, img: 'https://ui-avatars.com/api/?name=Nial+Fuller&background=8b5cf6&color=fff&size=128', verified: true },
  { id: 8, name: 'Anne-Marie Baiynd', location: 'Texas, USA', flag: '🇺🇸', followers: '1.4k', risk: 4.9, favorite: 'SPX', totalTrades: 720, totalLoss: 22, profitShare: 17.8, winRate: 80, img: 'https://ui-avatars.com/api/?name=Anne-Marie+Baiynd&background=06b6d4&color=fff&size=128', verified: true },
];

export default function CopyTrading() {
  const navigate = useNavigate();
  const [traders, setTraders] = useState(TRADERS_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTraders().then(data => {
      if (Array.isArray(data) && data.length > 0) setTraders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const [copied, setCopied] = useState(new Set());

  const filtered = traders.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase()) ||
    t.favorite.toLowerCase().includes(search.toLowerCase())
  );

  const riskColor = r => r <= 4 ? '#22c55e' : r <= 7 ? '#f59e0b' : '#ef4444';


  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Copy Trading" />
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <div style={{ width: '4px', height: '16px', background: '#6366f1' }} />
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Copy Expert Traders</span>
        </div>
        <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', margin: '0 0 14px' }}>Copy expert traders from all over the world and enhance your investment portfolio.</p>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={12} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expert traders" style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '9px 10px 9px 28px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {filtered.map(t => (
          <div key={t.id} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '20px' }}>{t.flag}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.5)', marginBottom: '8px' }}>
                <img src={t.img} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'auto' }} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + t.name + '&background=6366f1&color=fff'} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{t.name}</span>
                {t.verified && (
                  <svg width="18" height="18" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50.0,3.0 L 57.4,12.7 L 68.0,6.6 L 71.1,18.4 L 83.2,16.8 L 81.6,28.9 L 93.4,32.0 L 87.3,42.6 L 97.0,50.0 L 87.3,57.4 L 93.4,68.0 L 81.6,71.1 L 83.2,83.2 L 71.1,81.6 L 68.0,93.4 L 57.4,87.3 L 50.0,97.0 L 42.6,87.3 L 32.0,93.4 L 28.9,81.6 L 16.8,83.2 L 18.4,71.1 L 6.6,68.0 L 12.7,57.4 L 3.0,50.0 L 12.7,42.6 L 6.6,32.0 L 18.4,28.9 L 16.8,16.8 L 28.9,18.4 L 32.0,6.6 L 42.6,12.7 Z" fill="#3b82f6"/>
                    <path d="M32 51l12 12 24-26" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                <MapPin size={9} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{t.location}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
                <Users size={9} color="rgba(255,255,255,0.6)" />
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{t.followers}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
                <FlaskConical size={9} color={riskColor(t.risk)} />
                <span style={{ fontSize: '8px', color: riskColor(t.risk) }}>{t.risk}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.07)', padding: '4px 8px', borderRadius: '20px' }}>
                <Heart size={9} color="#ef4444" fill="#ef4444" />
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>{t.favorite}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
              {[{ label: 'Total trades', value: t.totalTrades, color: 'white' }, { label: 'Total loss', value: t.totalLoss, color: '#ef4444' }, { label: 'Profit share', value: t.profitShare + '%', color: '#22c55e' }, { label: 'Win rate', value: t.winRate + '%', color: '#22c55e' }].map((s, i) => (
                <div key={i} style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard/copy-trading/setup', { state: { trader: t } })} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer', borderRadius: '6px' }}>
              Copy Trader Strategy
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>No traders found</div>}

        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px' }}>2020-2026 &copy; Quantyrex Markets</div>
      </div>
    </div>
  );
}
