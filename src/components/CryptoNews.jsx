import { useState, useEffect } from 'react';

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss')
      .then(r => r.json())
      .then(data => {
        if (data.items) {
          const items = data.items.slice(0, 8).map(item => {
            // Try to extract image from content if thumbnail missing
            let thumbnail = item.thumbnail;
            if (!thumbnail || thumbnail.includes('placeholder')) {
              const match = item.content?.match(/<img[^>]+src=["']([^"']+)["']/);
              if (match) thumbnail = match[1];
            }
            return { ...item, thumbnail };
          });
          setNews(items);
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99,102,241,0.3)', padding: '8px', marginTop: '12px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginLeft: '8px', marginRight: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: 'white', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em' }}>CRYPTO NEWS</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>via CoinTelegraph</span>
      </div>

      {loading && <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading news...</div>}
      {error && <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Unable to load news</div>}

      {!loading && !error && news.map((item, i) => (
        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {item.thumbnail && (
              <img src={item.thumbnail} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', flexShrink: 0, borderRadius: '2px' }}
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '8px', fontWeight: '600', lineHeight: '1.4', marginBottom: '4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6366f1', fontSize: '7px' }}>{item.author || 'CoinTelegraph'}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>{timeAgo(item.pubDate)}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
