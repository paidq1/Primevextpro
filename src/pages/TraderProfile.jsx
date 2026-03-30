import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, FlaskConical, Heart, TrendingUp, BarChart2, Copy, UserCheck, Shield, Star, Clock, DollarSign, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { startCopyTrade } from '../services/api';

const TRADERS_DEFAULT = [
  { id: 1, name: 'Ross Cameron', location: 'Vermont, USA', flag: '🇺🇸', followers: '1.2k', risk: 6.5, favorite: 'AAPL', totalTrades: 300, totalLoss: 12, profitShare: 20.5, winRate: 75, img: 'https://ui-avatars.com/api/?name=Ross+Cameron&background=6366f1&color=fff&size=128', verified: true, bio: 'Full-time momentum trader with 10+ years experience. Specializes in small-cap breakouts and large-cap momentum plays.', joined: 'Jan 2019', avgReturn: '+34.2%', totalFollowers: 1243, topAssets: ['AAPL', 'TSLA', 'AMZN', 'NVDA', 'MSFT'] },
  { id: 2, name: 'Rayner Teo', location: 'Singapore', flag: '🇸🇬', followers: '3.4k', risk: 4.8, favorite: 'SPY', totalTrades: 820, totalLoss: 34, profitShare: 18.0, winRate: 82, img: 'https://ui-avatars.com/api/?name=Rayner+Teo&background=22c55e&color=fff&size=128', verified: true, bio: 'Professional forex & equities trader. Author of "The Complete Trading Guide." Known for systematic trend-following strategies.', joined: 'Mar 2017', avgReturn: '+28.7%', totalFollowers: 3412, topAssets: ['SPY', 'EUR/USD', 'GBP/USD', 'BTC', 'QQQ'] },
  { id: 3, name: 'Kathy Lien', location: 'New York, USA', flag: '🇺🇸', followers: '2.1k', risk: 5.4, favorite: 'EURUSD', totalTrades: 950, totalLoss: 21, profitShare: 15.2, winRate: 79, img: 'https://ui-avatars.com/api/?name=Kathy+Lien&background=ec4899&color=fff&size=128', verified: true, bio: 'Managing Director of FX Strategy. Expert in G10 currencies and macroeconomic analysis. Bestselling author and CNBC contributor.', joined: 'Jun 2018', avgReturn: '+22.1%', totalFollowers: 2134, topAssets: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'USD/CHF'] },
  { id: 4, name: 'Nicola Duke', location: 'United Kingdom', flag: '🇬🇧', followers: '1.6k', risk: 5.2, favorite: 'GBPUSD', totalTrades: 540, totalLoss: 15, profitShare: 19.5, winRate: 81, img: 'https://ui-avatars.com/api/?name=Nicola+Duke&background=f59e0b&color=fff&size=128', verified: true, bio: 'Forex educator and professional trader. Specializes in price action and technical analysis on major pairs.', joined: 'Sep 2019', avgReturn: '+31.5%', totalFollowers: 1589, topAssets: ['GBP/USD', 'EUR/GBP', 'GBP/JPY', 'FTSE', 'EUR/USD'] },
  { id: 5, name: 'Anton Kreil', location: 'London, UK', flag: '🇬🇧', followers: '2.8k', risk: 7.1, favorite: 'ETH', totalTrades: 1200, totalLoss: 45, profitShare: 12.5, winRate: 88, img: 'https://ui-avatars.com/api/?name=Anton+Kreil&background=3b82f6&color=fff&size=128', verified: true, bio: 'Former Goldman Sachs trader. Aggressive multi-asset strategy with focus on crypto and equity derivatives.', joined: 'Feb 2016', avgReturn: '+41.8%', totalFollowers: 2801, topAssets: ['ETH', 'BTC', 'SPX', 'AAPL', 'AMZN'] },
  { id: 6, name: 'Timothy Sykes', location: 'Miami, USA', flag: '🇺🇸', followers: '4.1k', risk: 9.1, favorite: 'TSLA', totalTrades: 1800, totalLoss: 280, profitShare: 25.0, winRate: 65, img: 'https://ui-avatars.com/api/?name=Timothy+Sykes&background=ef4444&color=fff&size=128', verified: true, bio: 'Turned $12k into $7M trading penny stocks. High-risk, high-reward strategy for experienced traders.', joined: 'Jan 2015', avgReturn: '+52.3%', totalFollowers: 4102, topAssets: ['TSLA', 'GME', 'AMC', 'NVDA', 'RIVN'] },
  { id: 7, name: 'Nial Fuller', location: 'Australia', flag: '🇦🇺', followers: '1.8k', risk: 5.1, favorite: 'GBPUSD', totalTrades: 610, totalLoss: 18, profitShare: 22.3, winRate: 84, img: 'https://ui-avatars.com/api/?name=Nial+Fuller&background=8b5cf6&color=fff&size=128', verified: true, bio: 'Price action specialist. Conservative approach with focus on key levels and clean chart setups over 12 years.', joined: 'May 2018', avgReturn: '+26.9%', totalFollowers: 1821, topAssets: ['GBP/USD', 'EUR/USD', 'AUD/USD', 'USD/JPY', 'NZD/USD'] },
  { id: 8, name: 'Anne-Marie Baiynd', location: 'Texas, USA', flag: '🇺🇸', followers: '1.4k', risk: 4.9, favorite: 'SPX', totalTrades: 720, totalLoss: 22, profitShare: 17.8, winRate: 80, img: 'https://ui-avatars.com/api/?name=Anne-Marie+Baiynd&background=06b6d4&color=fff&size=128', verified: true, bio: 'Author of "The Trading Book" and senior market strategist. Combines technical analysis with behavioral finance.', joined: 'Aug 2020', avgReturn: '+19.4%', totalFollowers: 1432, topAssets: ['SPX', 'QQQ', 'AAPL', 'AMZN', 'GOOG'] },
];

const MOCK_TRADES = [
  { asset: 'AAPL', type: 'BUY', profit: '+6.47%', date: 'Mar 18, 2026', duration: '3d' },
  { asset: 'TSLA', type: 'SELL', profit: '+6.69%', date: 'Mar 14, 2026', duration: '5d' },
  { asset: 'NVDA', type: 'BUY', profit: '+4.03%', date: 'Mar 10, 2026', duration: '2d' },
  { asset: 'EUR/USD', type: 'BUY', profit: '-0.53%', date: 'Mar 7, 2026', duration: '1d' },
  { asset: 'BTC', type: 'BUY', profit: '+6.47%', date: 'Mar 3, 2026', duration: '4d' },
  { asset: 'SPY', type: 'BUY', profit: '+2.44%', date: 'Feb 28, 2026', duration: '6d' },
];

const MOCK_FOLLOWERS = [
  { name: 'Alex M.', avatar: 'https://ui-avatars.com/api/?name=Alex+M&background=6366f1&color=fff&size=64', joined: '2 days ago', profit: '+12.4%' },
  { name: 'Sarah K.', avatar: 'https://ui-avatars.com/api/?name=Sarah+K&background=22c55e&color=fff&size=64', joined: '1 week ago', profit: '+8.1%' },
  { name: 'Raj P.', avatar: 'https://ui-avatars.com/api/?name=Raj+P&background=f59e0b&color=fff&size=64', joined: '2 weeks ago', profit: '+19.7%' },
  { name: 'Liu W.', avatar: 'https://ui-avatars.com/api/?name=Liu+W&background=ec4899&color=fff&size=64', joined: '1 month ago', profit: '+31.2%' },
  { name: 'Omar H.', avatar: 'https://ui-avatars.com/api/?name=Omar+H&background=3b82f6&color=fff&size=64', joined: '2 months ago', profit: '+44.6%' },
];

const riskColor = r => r <= 4 ? '#22c55e' : r <= 7 ? '#f59e0b' : '#ef4444';
const riskLabel = r => r <= 4 ? 'Low' : r <= 7 ? 'Medium' : 'High';

function PerfChart() {
  const pts = [12,28,22,38,32,48,42,55,50,62,58,72].map((v,i) => `${(i/11)*280+10},${70-(v/80)*60}`).join(' ');
  return (
    <svg width="100%" viewBox="0 0 300 80" preserveAspectRatio="none" style={{display:'block'}}>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs>
      <polygon points={`10,70 ${pts} 290,70`} fill="url(#pg)"/>
      <polyline points={pts} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="290" cy={70-(72/80)*60} r="3" fill="#22c55e"/>
    </svg>
  );
}

export default function TraderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const trader = TRADERS_DEFAULT.find(t => t.id === parseInt(id));

  if (!trader) return (
    <div style={{minHeight:'100vh',background:'#0e1628',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Trader not found</p>
        <button onClick={() => navigate('/dashboard/copy-trading')} style={{marginTop:'12px',background:'#6366f1',border:'none',color:'white',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',fontSize:'10px'}}>Go Back</button>
      </div>
    </div>
  );

  const handleCopy = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) < 10) { setCopyError('Minimum investment is $10'); return; }
    setCopying(true); setCopyError('');
    try {
      await startCopyTrade({ traderId: trader.id, traderName: trader.name, traderImg: trader.img, amount: parseFloat(amount), profitShare: trader.profitShare });
      setCopySuccess('Strategy copied successfully!');
      setTimeout(() => { setModal(false); setCopySuccess(''); }, 1500);
    } catch (err) { setCopyError(err.message || 'Failed. Check your balance.'); }
    setCopying(false);
  };

  const trades = showAllTrades ? MOCK_TRADES : MOCK_TRADES.slice(0, 3);

  return (
    <div style={{minHeight:'100vh',background:'#0e1628',fontFamily:"'Segoe UI', sans-serif",color:'white',paddingBottom:'40px'}}>
      <PageHeader title="Trader Profile" />
      <div style={{padding:'12px 14px 0'}}>
        <button onClick={() => navigate('/dashboard/copy-trading')} style={{display:'flex',alignItems:'center',gap:'5px',background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'9px',padding:'0'}}>
          <ArrowLeft size={12}/> Back to Copy Trading
        </button>
      </div>

      {/* Hero */}
      <div style={{margin:'12px 14px 0',background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'20px 16px 16px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'12px',right:'12px',fontSize:'22px'}}>{trader.flag}</div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'14px'}}>
          <div style={{width:'76px',height:'76px',borderRadius:'50%',overflow:'hidden',border:'3px solid rgba(99,102,241,0.6)',marginBottom:'10px'}}>
            <img src={trader.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <span style={{fontSize:'15px',fontWeight:'800'}}>{trader.name}</span>
            {trader.verified && <svg width="18" height="18" viewBox="0 0 100 100"><path d="M50,3L57.4,12.7L68,6.6L71.1,18.4L83.2,16.8L81.6,28.9L93.4,32L87.3,42.6L97,50L87.3,57.4L93.4,68L81.6,71.1L83.2,83.2L71.1,81.6L68,93.4L57.4,87.3L50,97L42.6,87.3L32,93.4L28.9,81.6L16.8,83.2L18.4,71.1L6.6,68L12.7,57.4L3,50L12.7,42.6L6.6,32L18.4,28.9L16.8,16.8L28.9,18.4L32,6.6L42.6,12.7Z" fill="#3b82f6"/><path d="M32 51l12 12 24-26" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'4px'}}>
            <MapPin size={9} color="rgba(255,255,255,0.4)"/>
            <span style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{trader.location}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'4px'}}>
            <Clock size={9} color="rgba(255,255,255,0.3)"/>
            <span style={{fontSize:'8px',color:'rgba(255,255,255,0.3)'}}>Member since {trader.joined}</span>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:'6px',marginBottom:'14px'}}>
          {[{icon:<Users size={9} color="rgba(255,255,255,0.6)"/>,val:trader.followers+' followers',col:'rgba(255,255,255,0.6)'},{icon:<FlaskConical size={9} color={riskColor(trader.risk)}/>,val:riskLabel(trader.risk)+' Risk',col:riskColor(trader.risk)},{icon:<Heart size={9} color="#ef4444" fill="#ef4444"/>,val:trader.favorite,col:'rgba(255,255,255,0.6)'}].map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'3px',background:'rgba(255,255,255,0.07)',padding:'4px 10px',borderRadius:'20px'}}>
              {p.icon}<span style={{fontSize:'8px',color:p.col}}>{p.val}</span>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'14px'}}>
          {[{label:'Win Rate',value:trader.winRate+'%',color:'#22c55e'},{label:'Avg Return',value:trader.avgReturn,color:'#22c55e'},{label:'Total Trades',value:trader.totalTrades,color:'white'}].map((s,i)=>(
            <div key={i} style={{background:'#0e1628',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
              <div style={{fontSize:'11px',fontWeight:'800',color:s.color}}>{s.value}</div>
              <div style={{fontSize:'7px',color:'rgba(255,255,255,0.35)',marginTop:'2px'}}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setModal(true); setAmount(''); setCopyError(''); }} style={{width:'100%',padding:'11px',background:'#6366f1',border:'none',color:'white',fontSize:'10px',fontWeight:'700',cursor:'pointer',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
          <Copy size={12}/> Copy Trader Strategy
        </button>
      </div>

      {/* Tabs */}
      <div style={{margin:'14px 14px 0',display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#1a2e4a',borderRadius:'10px',padding:'3px',border:'1px solid rgba(255,255,255,0.06)'}}>
        {['overview','trades','followers','copy'].map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:'7px 4px',background:activeTab===tab?'#6366f1':'transparent',border:'none',color:activeTab===tab?'white':'rgba(255,255,255,0.4)',fontSize:'8px',fontWeight:activeTab===tab?'700':'400',cursor:'pointer',borderRadius:'7px',textTransform:'capitalize'}}>
            {tab==='copy'?'Copy Info':tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{margin:'12px 14px 0'}}>
        {activeTab==='overview' && (
          <div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'14px',marginBottom:'10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}><div style={{width:'3px',height:'12px',background:'#6366f1',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>ABOUT</span></div>
              <p style={{fontSize:'8.5px',color:'rgba(255,255,255,0.55)',lineHeight:'1.6',margin:0}}>{trader.bio}</p>
            </div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'14px',marginBottom:'10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}><div style={{width:'3px',height:'12px',background:'#22c55e',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>PERFORMANCE (6 months)</span></div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                {['Oct','Nov','Dec','Jan','Feb','Mar'].map(m=><span key={m} style={{fontSize:'7px',color:'rgba(255,255,255,0.25)'}}>{m}</span>)}
              </div>
              <PerfChart/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px'}}>
                <span style={{fontSize:'8px',color:'rgba(255,255,255,0.35)'}}>Avg monthly return</span>
                <span style={{fontSize:'9px',fontWeight:'700',color:'#22c55e'}}>+{(parseFloat(trader.avgReturn)/6).toFixed(1)}%</span>
              </div>
            </div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'10px'}}><div style={{width:'3px',height:'12px',background:'#f59e0b',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>TOP ASSETS</span></div>
              {trader.topAssets.map((a,i)=>{const p=[65,54,42,31,22][i];const c=['#6366f1','#22c55e','#f59e0b','#3b82f6','#ec4899'][i];return(
                <div key={a} style={{marginBottom:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}><span style={{fontSize:'8px',fontWeight:'600',color:'rgba(255,255,255,0.7)'}}>{a}</span><span style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{p}%</span></div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px'}}><div style={{height:'100%',width:p+'%',background:c,borderRadius:'2px'}}/></div>
                </div>
              );})}
            </div>
          </div>
        )}

        {activeTab==='trades' && (
          <div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'3px',height:'12px',background:'#6366f1',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>TRADE HISTORY</span></div>
                <span style={{fontSize:'8px',color:'rgba(255,255,255,0.3)'}}>{trader.totalTrades} total</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 50px 50px 55px',gap:'4px',padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                {['Asset','Type','Dur.','P&L'].map(h=><span key={h} style={{fontSize:'7px',color:'rgba(255,255,255,0.25)',fontWeight:'600'}}>{h}</span>)}
              </div>
              {trades.map((t,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 50px 50px 55px',gap:'4px',padding:'9px 14px',borderBottom:'1px solid rgba(255,255,255,0.03)',alignItems:'center'}}>
                  <span style={{fontSize:'9px',fontWeight:'700'}}>{t.asset}</span>
                  <span style={{fontSize:'8px',color:t.type==='BUY'?'#22c55e':'#ef4444',fontWeight:'600'}}>{t.type}</span>
                  <span style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{t.duration}</span>
                  <span style={{fontSize:'9px',fontWeight:'700',color:t.profit.startsWith('+')?'#22c55e':'#ef4444'}}>{t.profit}</span>
                </div>
              ))}
              <button onClick={()=>setShowAllTrades(!showAllTrades)} style={{width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'8px',padding:'10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
                {showAllTrades?<><ChevronUp size={10}/>Show less</>:<><ChevronDown size={10}/>View all</>}
              </button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginTop:'10px'}}>
              {[{label:'Total Trades',value:trader.totalTrades,color:'white'},{label:'Total Loss',value:trader.totalLoss,color:'#ef4444'},{label:'Profit Share',value:trader.profitShare+'%',color:'#22c55e'},{label:'Win Rate',value:trader.winRate+'%',color:'#22c55e'}].map((s,i)=>(
                <div key={i} style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'8px',padding:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{s.label}</span>
                  <span style={{fontSize:'10px',fontWeight:'700',color:s.color}}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='followers' && (
          <div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'3px',height:'12px',background:'#6366f1',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>FOLLOWERS</span></div>
                <span style={{fontSize:'8px',color:'#6366f1',fontWeight:'600'}}>{trader.totalFollowers.toLocaleString()} total</span>
              </div>
              {MOCK_FOLLOWERS.map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <img src={f.avatar} style={{width:'32px',height:'32px',borderRadius:'50%'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'9px',fontWeight:'600'}}>{f.name}</div>
                    <div style={{fontSize:'7.5px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>Joined {f.joined}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'9px',fontWeight:'700',color:'#22c55e'}}>{f.profit}</div>
                    <div style={{fontSize:'7px',color:'rgba(255,255,255,0.3)'}}>returns</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='copy' && (
          <div>
            <div style={{background:'#1a2e4a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'14px',marginBottom:'10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'12px'}}><div style={{width:'3px',height:'12px',background:'#6366f1',borderRadius:'2px'}}/><span style={{fontSize:'9px',fontWeight:'700',color:'rgba(255,255,255,0.7)'}}>COPY INFO</span></div>
              {[{label:'Profit Share',value:trader.profitShare+'%',color:'#22c55e'},{label:'Risk Level',value:riskLabel(trader.risk)+' ('+trader.risk+'/10)',color:riskColor(trader.risk)},{label:'Min. Investment',value:'$10',color:'#6366f1'},{label:'Favorite Asset',value:trader.favorite,color:'#f59e0b'}].map((item,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none'}}>
                  <span style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{item.label}</span>
                  <span style={{fontSize:'9px',fontWeight:'700',color:item.color}}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
              <div style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
                <Shield size={12} color="#ef4444" style={{flexShrink:0,marginTop:'1px'}}/>
                <p style={{margin:0,fontSize:'7.5px',color:'rgba(255,255,255,0.45)',lineHeight:'1.5'}}>Copy trading involves risk. Past performance is not indicative of future results.</p>
              </div>
            </div>
            <button onClick={()=>{ setModal(true); setAmount(''); setCopyError(''); }} style={{width:'100%',padding:'12px',background:'#6366f1',border:'none',color:'white',fontSize:'11px',fontWeight:'700',cursor:'pointer',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              <Copy size={13}/> Copy {trader.name}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={()=>setModal(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#1a2e4a',borderRadius:'16px 16px 0 0',padding:'20px 16px',width:'100%',maxWidth:'480px',border:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
              <img src={trader.img} style={{width:'44px',height:'44px',borderRadius:'50%',border:'2px solid rgba(99,102,241,0.5)'}}/>
              <div>
                <div style={{fontSize:'12px',fontWeight:'700'}}>{trader.name}</div>
                <div style={{fontSize:'8px',color:'rgba(255,255,255,0.4)'}}>{trader.profitShare}% profit share • {trader.winRate}% win rate</div>
              </div>
            </div>
            <div style={{fontSize:'8px',color:'rgba(255,255,255,0.4)',marginBottom:'6px'}}>Investment Amount (min $10)</div>
            <div style={{position:'relative',marginBottom:'12px'}}>
              <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>$</span>
              <input type="number" value={amount} onChange={e=>{setAmount(e.target.value);setCopyError('');}} placeholder="0.00" style={{width:'100%',background:'#0e1628',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:'13px',fontWeight:'700',padding:'11px 10px 11px 22px',outline:'none',borderRadius:'8px',boxSizing:'border-box'}}/>
            </div>
            {copyError && <div style={{fontSize:'8px',color:'#ef4444',marginBottom:'10px',background:'rgba(239,68,68,0.1)',padding:'8px 10px',borderRadius:'6px'}}>{copyError}</div>}
            {copySuccess && <div style={{fontSize:'8px',color:'#22c55e',marginBottom:'10px',background:'rgba(34,197,94,0.1)',padding:'8px 10px',borderRadius:'6px'}}>✓ {copySuccess}</div>}
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>setModal(false)} style={{flex:1,padding:'11px',background:'rgba(255,255,255,0.06)',border:'none',color:'white',fontSize:'10px',cursor:'pointer',borderRadius:'8px'}}>Cancel</button>
              <button onClick={handleCopy} disabled={copying} style={{flex:2,padding:'11px',background:copying?'rgba(99,102,241,0.5)':'#6366f1',border:'none',color:'white',fontSize:'10px',fontWeight:'700',cursor:copying?'default':'pointer',borderRadius:'8px'}}>
                {copying?'Processing...':'Confirm & Start Copying'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
