import { useState, useEffect } from 'react';

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC,ETH,Trading&excludeCategories=Sponsored')
      .then(r => r.json())
      .then(data => {
        if (data.Data) {
          setNews(data.Data.slice(0, 8));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() / 1000) - ts);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ background: '#252d3d', border: '1px solid rgba(99,102,241,0.5)', padding: '8px', marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: 'white', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em' }}>CRYPTO NEWS</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>via CryptoCompare</span>
      </div>

      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>
          Loading news...
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>
          Unable to load news
        </div>
      )}

      {!loading && !error && news.map((item, i) => (
        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {item.imageurl && (
              <img src={item.imageurl} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', flexShrink: 0, borderRadius: '2px' }} 
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '8px', fontWeight: '600', lineHeight: '1.4', marginBottom: '4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6366f1', fontSize: '7px' }}>{item.source_info?.name || item.source}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>{timeAgo(item.published_on)}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
