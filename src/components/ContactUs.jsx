import { useState, useEffect, useRef } from 'react';

const ContactUs = () => {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { setError('All fields are required'); setTimeout(() => setError(''), 3000); return; }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const res = await fetch('https://quantyrexs.onrender.com/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(r => r.json());
      if (res.success) {
        setSuccess('Message sent! We will get back to you soon.'); setTimeout(() => setSuccess(''), 4000);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(res.message || 'Failed to send message'); setTimeout(() => setError(''), 3000);
      }
    } catch { setError('Network error. Please try again.'); setTimeout(() => setError(''), 3000); }
    setSubmitting(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <><section id="contact" ref={ref} style={{ background: '#0e1420', width: '100%', boxSizing: 'border-box', padding: '12px', position: 'relative', overflow: 'hidden' }}>
      
            {/* Dotted World Map Background */}
      <img src='/world-map.png' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.15, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', position: 'relative', zIndex: 1 }}>

        {/* Left: Form */}
        <div className="scroll-anim" style={{ flex: '0 0 52%', minWidth: 0 }}>
          <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(13px, 3.5vw, 18px)', marginBottom: '4px' }}>Contact Us</h2>
          <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', marginBottom: '4px' }}>
            See how our platform has helped traders, investors, and crypto enthusiasts achieve their financial goals and experience secure, seamless trading.
          </p>

          {/* Full Name */}
          <div style={{ marginBottom: '4px' }}>
            <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="Full Name"
                style={{ width: '100%', background: 'rgba(44,62,80,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '6px 32px 6px 10px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', boxSizing: 'border-box', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '4px' }}>
            <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
              Your Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="email" value={form.email} onChange={handleChange}
                placeholder="Enter Email"
                style={{ width: '100%', background: 'rgba(44,62,80,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '6px 32px 6px 10px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', boxSizing: 'border-box', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '6px' }}>
            <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
              Your Message <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder="Enter Your Message"
                rows={2}
                style={{ width: '100%', background: 'rgba(44,62,80,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '6px 32px 6px 10px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', boxSizing: 'border-box', outline: 'none', resize: 'none' }}
              />
              <svg style={{ position: 'absolute', right: '8px', top: '12px', opacity: 0.4 }} width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>

          {/* Send Button */}
          {success && <div style={{ color: '#22c55e', fontSize: '9px', marginBottom: '8px', padding: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>{success}</div>}
          {error && <div style={{ color: '#ef4444', fontSize: '9px', marginBottom: '8px', padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
          <button onClick={handleSubmit} disabled={submitting} style={{
            width: '100%', padding: '7px', background: '#6366f1', border: 'none',
            borderRadius: '4px', color: 'white', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '600',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            Send Message
            <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* Right: Information */}
        <div style={{
          flex: 1, minWidth: 0, background: 'rgba(44,62,80,0.25)',
          borderRadius: '0px', padding: '12px',
          display: 'flex', flexDirection: 'column', gap: '12px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Dot grid background */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(12px, 3vw, 24px)', marginBottom: '4px' }}>Information</h3>
            <div style={{ width: '28px', height: '2px', background: '#6366f1', marginBottom: '4px' }} />
            <p style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', marginBottom: '6px' }}>
              Have questions or need support? Reach out to us anytime—we're here to assist you with all your trading, staking, and investment needs.
            </p>
            <div style={{ width: '28px', height: '1px', background: 'rgba(99,102,241,0.3)', marginBottom: '6px' }} />

            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'support@quantyrexprox.cc' },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+1 (558) 955 488 55' },
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', text: 'A108 Adam Street NY 535022, USA' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: '9:00 AM - 9:00 PM' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{
                  width: 'clamp(22px, 5vw, 28px)', height: 'clamp(22px, 5vw, 28px)', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" fill="none" stroke="#818cf8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section></>
  );
};

export default ContactUs;
