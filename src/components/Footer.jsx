import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#151c27', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.15)' }} />

      {/* Main Footer */}
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Top row: Contact + Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>

          {/* Contact */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(9px, 2.2vw, 17px)', marginBottom: '6px' }}>Contact</h3>
            <div style={{ width: '28px', height: '2px', background: '#6366f1', marginBottom: '12px' }} />
            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: 'support@quantyrexprox.cc' },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Phone Number', value: '+14705427729' },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Address', value: 'A108 Adam Street NY 535022, USA' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '22px', height: '22px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" fill="none" stroke="#818cf8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600' }}>{item.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: 'clamp(6px, 1.5vw, 13px)' }}>{item.value}</div>
                </div>
              </div>
            ))}
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {[
                'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12.07h2.54V9.845c0-2.522 1.492-3.919 3.776-3.919 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.775-1.63 1.57v1.877h2.773l-.443 2.89h-2.33V21.88C20.343 21.128 24 16.99 24 12.073z',
                'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z',
              ].map((path, i) => (
                <div key={i} style={{ width: '22px', height: '22px', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="11" height="11" fill="#818cf8" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(9px, 2.2vw, 17px)', marginBottom: '6px' }}>Quick Links</h3>
            <div style={{ width: '28px', height: '2px', background: '#6366f1', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[['Home','#home'],['About Us','#why'],['Trading','/trading-info'],['Staking','/staking-info'],['Investing','/investing-info'],['Investment Plans','#plans'],['Terms & Conditions','/terms']].map(([link,href], i) => (
                  <a key={i} href={href} style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', textDecoration: 'none' }}>{link}</a>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[['Market','#market'],['How It Works','#how'],['Benefits of Trading','#why'],['Customer Reviews','#reviews'],['Contact Us','#contact'],["FAQ's",'#faq']].map(([link,href], i) => (
                  <a key={i} href={href} style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', textDecoration: 'none' }}>{link}</a>
                ))}
              </div>
            </div>
          </div>

        </div>{/* end top row */}

        {/* Newsletter - full width */}
        <div style={{ width: '100%' }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(9px, 2.2vw, 17px)', marginBottom: '6px' }}>Newsletter</h3>
          <div style={{ width: '28px', height: '2px', background: '#6366f1', marginBottom: '12px' }} />
          <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', marginBottom: '12px' }}>
            Subscribe to our newsletter to receive the latest updates, exclusive content, and special offers directly in your inbox.
          </p>
          <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Your Email <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ display: 'flex', maxWidth: '300px' }}>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              style={{ flex: 1, background: '#1a2535', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', padding: '6px 8px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', outline: 'none', minWidth: 0 }}
            />
            <button onClick={() => window.location.href='/signup'} style={{ background: '#6366f1', border: 'none', padding: '6px 10px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg viewBox="0 0 40 40" fill="none" width="16" height="16">
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
          <span style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '700', letterSpacing: '2px' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
          <span style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)' }}>© 2025 Quantyrex Markets All rights reserved</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
