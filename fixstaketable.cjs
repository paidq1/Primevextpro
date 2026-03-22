const fs = require('fs');
let f = fs.readFileSync('src/pages/Stake.jsx', 'utf8');

const oldTable = `          {loadingStakes ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
          ) : stakes.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No stakes found</div>                                                     ) : stakes.slice((page-1)*perPage, page*perPage).map((s, i) => {
            const totalDays = parseInt(s.duration) || 30;                                             const elapsed = Math.floor((Date.now() - new Date(s.createdAt)) / (1000 * 60 * 60 * 24));                                                                                           const daysLeft = Math.max(0, totalDays - elapsed);                                        const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));                 const earned = s.earned || 0;                                                             const roi = s.amount > 0 ? ((earned / s.amount) * 100).toFixed(2) : '0.00';
            const color = statusColor(s.status);                                                      return (                                                                                    <div key={i} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>                               {/* Row 1: Plan + Status */}                                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>                                                                         <span style={{ color: '#6366f1', fontSize: '9px', fontWeight: '800' }}>{s.plan}</span>
                  <span style={{ background: color+'20', color, fontSize: '7px', padding: '2px 8px', textTransform: 'capitalize', fontWeight: '700' }}>{s.status}</span>                            </div>
                {/* Row 2: Stats */}                                                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <div>                                                                                       <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Staked</div>                                                                                                       <div style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>${s.amount?.toFixed(2)}</div>
                  </div>                                                                                    <div>                                                                                       <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>APY</div>
                    <div style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>{s.apy}</div>                                                                                               </div>                                                                                    <div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>Earned</div>                                                                                                       <div style={{ color: '#f59e0b', fontSize: '9px', fontWeight: '700' }}>${earned.toFixed(4)}</div>                                                                                  </div>
                  <div>                                                                                       <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>ROI</div>                                                                                                          <div style={{ color: parseFloat(roi) >= 0 ? '#22c55e' : '#ef4444', fontSize: '9px', fontWeight: '700' }}>{roi}%</div>                                                             </div>                                                                                  </div>                                                                                    {/* Row 3: Progress Bar */}                                                               <div style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{elapsed} / {totalDays} days</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{daysLeft} days left</span>
                  </div>                                                                                    <div style={{ background: 'rgba(255,255,255,0.08)', height: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: progress + '%', height: '100%', background: s.status === 'completed' ? '#22c55e' : '#6366f1', borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>                                                                                    <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginTop: '2px' }}>{progress.toFixed(0)}% complete</div>                                      </div>                                                                                    {/* Row 4: Dates */}                                                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>Start: {new Date(s.createdAt).toLocaleDateString()}</span>                                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>End: {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '-'}</span>                                    </div>
              </div>                                                                                  );
          })}`;

const newTable = `          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Plan','Amount','APY','Earned','Duration','Status'].map((h,i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 10px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h} ↕</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingStakes ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</td></tr>
              ) : stakes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No stakes found</td></tr>
              ) : stakes.slice((page-1)*perPage, page*perPage).map((s, i) => {
                const color = statusColor(s.status);
                const earned = s.earned || 0;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '8px 10px', color: '#6366f1', fontSize: '8px', fontWeight: '700' }}>{s.plan}</td>
                    <td style={{ padding: '8px 10px', color: 'white', fontSize: '8px', fontWeight: '700' }}>{formatAmount(s.amount||0, user?.currency)}</td>
                    <td style={{ padding: '8px 10px', color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>{s.apy}</td>
                    <td style={{ padding: '8px 10px', color: '#f59e0b', fontSize: '8px', fontWeight: '700' }}>{formatAmount(earned, user?.currency)}</td>
                    <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{s.duration} days</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ background: color+'20', color, fontSize: '7px', padding: '2px 6px', display: 'inline-block', textTransform: 'capitalize' }}>{s.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>`;

if (f.includes('loadingStakes ? (')) {
  f = f.replace(/\s*\{loadingStakes[\s\S]*?;\s*\}\)\}/m, '\n' + newTable);
  fs.writeFileSync('src/pages/Stake.jsx', f);
  console.log('Done!');
} else {
  console.log('Pattern not found');
}
