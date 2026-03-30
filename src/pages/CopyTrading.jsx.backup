import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, FlaskConical, Heart, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getTraders, startCopyTrade } from '../services/api';

const TRADERS_DEFAULT = [
  { id: 1, name: 'Ross Cameron', location: 'Vermont, USA', flag: '🇺🇸', followers: '1.2k', risk: 6.5, favorite: 'AAPL', totalTrades: 300, totalLoss: 12, profitShare: 20.5, winRate: 75, img: 'https://ui-avatars.com/api/?name=Ross+Cameron&background=6366f1&color=fff&size=128', verified: true },
  { id: 2, name: 'Rayner Teo', location: 'Singapore', flag: '🇸🇬', followers: '3.4k', risk: 4.8, favorite: 'SPY', totalTrades: 820, totalLoss: 34, profitShare: 18.0, winRate: 82, img: 'https://ui-avatars.com/api/?name=Rayner+Teo&background=22c55e&color=fff&size=128', verified: true },
  { id: 3, name: 'Kathy Lien', location: 'New York, USA', flag: '🇺🇸', followers: '2.1k', risk: 5.4, favorite: 'EURUSD', totalTrades: 950, totalLoss: 21, profitShare: 15.2, winRate: 79, img: 'https://ui-avatars.com/api/?name=Kathy+Lien&background=ec4899&color=fff&size=128', verified: true },
  { id: 4, name: 'Nicola Duke', location: 'United Kingdom', flag: '🇬🇧', followers: '1.6k', risk: 5.2, favorite: 'GBPUSD', totalTrades: 540, totalLoss: 15, profitShare: 19.5, winRate: 81, img: 'https://ui-avatars.com/api/?name=Nicola+Duke&background=f59e0b&color=fff&size=128', verified: true },
  { id: 5, name: 'Anton Kreil', location: 'London, UK', flag: '🇬🇧', followers: '2.8k', risk: 7.1, favorite: 'ETH', totalTrades: 1200, totalLoss: 45, profitShare: 12.5, winRate: 88, img: 'https://ui-avatars.com/api/?name=Anton+Kreil&background=3b82f6&color=fff&size=128', verified: true },
  { id: 6, name: 'Timothy Sykes', location: 'Miami, USA', flag: '🇺🇸', followers: '4.1k', risk: 9.1, favorite: 'TSLA', totalTrades: 1800, totalLoss: 280, profitShare: 25.0, winRate: 65, img: 'https://ui-avatars.com/api/?name=Timothy+Sykes&background=ef4444&color=fff&size=128', verified: true },
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
  const [modal, setModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const filtered = traders.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase()) ||
    t.favorite.toLowerCase().includes(search.toLowerCase())
  );

  const riskColor = r => r <= 4 ? '#22c55e' : r <= 7 ? '#f59e0b' : '#ef4444';


  const handleCopy = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) < 10) { setCopyError("Minimum investment is $10"); return; }
    setCopying(true); setCopyError("");
    try {
      await startCopyTrade({ traderId: modal.id, traderName: modal.name, traderImg: modal.img, amount: parseFloat(amount), profitShare: modal.profitShare });
      setCopied(prev => new Set([...prev, modal.id]));
      setCopySuccess("Strategy copied successfully!");
      setTimeout(() => { setModal(null); setCopySuccess(""); }, 1500);
    } catch (err) { setCopyError(err.message || "Failed to copy. Check your balance."); }
    setCopying(false);
  };
  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Copy Trading" />
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '4px', height: '16px', background: '#6366f1' }} />
            <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Copy Expert Traders</span>
          </div>
          <button onClick={() => navigate('/dashboard/my-copy-trades')} style={{ padding: '5px 10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', fontSize: '8px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px' }}>My Copies</button>
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
            <button onClick={() => { setModal(t); setAmount(''); setCopyError(''); setCopySuccess(''); }} style={{ width: '100%', padding: '10px', background: copied.has(t.id) ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer', borderRadius: '6px' }}>
              {copied.has(t.id) ? '✓ Strategy Copied!' : 'Copy Trader Strategy'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>No traders found</div>}

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1a2e4a", borderRadius: "16px 16px 0 0", padding: "20px 16px", width: "100%", maxWidth: "480px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <img src={modal.img} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid rgba(99,102,241,0.5)" }} />
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700" }}>{modal.name}</div>
                <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>{modal.profitShare}% profit share • {modal.winRate}% win rate</div>
              </div>
            </div>
            <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>Investment Amount (min $10)</div>
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>$</span>
              <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setCopyError(""); }} placeholder="0.00" style={{ width: "100%", background: "#0e1628", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", fontWeight: "700", padding: "11px 10px 11px 22px", outline: "none", borderRadius: "8px", boxSizing: "border-box" }} />
            </div>
            {copyError && <div style={{ fontSize: "8px", color: "#ef4444", marginBottom: "10px", background: "rgba(239,68,68,0.1)", padding: "8px 10px", borderRadius: "6px" }}>{copyError}</div>}
            {copySuccess && <div style={{ fontSize: "8px", color: "#22c55e", marginBottom: "10px", background: "rgba(34,197,94,0.1)", padding: "8px 10px", borderRadius: "6px" }}>✓ {copySuccess}</div>}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.06)", border: "none", color: "white", fontSize: "10px", cursor: "pointer", borderRadius: "8px" }}>Cancel</button>
              <button onClick={handleCopy} disabled={copying} style={{ flex: 2, padding: "11px", background: copying ? "rgba(99,102,241,0.5)" : "#6366f1", border: "none", color: "white", fontSize: "10px", fontWeight: "700", cursor: copying ? "default" : "pointer", borderRadius: "8px" }}>{copying ? "Processing..." : "Confirm & Start Copying"}</button>
            </div>
          </div>
        </div>
      )}
        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '7px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px' }}>2020-2026 &copy; VertexTrade Pro</div>
      </div>
    </div>
  );
}
