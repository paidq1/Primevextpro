import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing and using Quantyrex Markets, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our platform.' },
    { title: '2. Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
    { title: '3. Investment Risk Disclosure', content: 'Trading and investing in cryptocurrencies and forex carries significant risk. Past performance is not indicative of future results. You may lose some or all of your invested capital. Only invest what you can afford to lose.' },
    { title: '4. Deposits & Withdrawals', content: 'All deposits are processed within 24 hours of confirmation. Withdrawals are processed within 1-3 business days subject to KYC verification. Minimum withdrawal amount is $50. We reserve the right to request additional verification.' },
    { title: '5. KYC & AML Policy', content: 'Quantyrex Markets complies with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. Users must complete identity verification before making withdrawals. We may request government-issued ID and proof of address.' },
    { title: '6. Prohibited Activities', content: 'Users are prohibited from engaging in fraudulent activities, money laundering, market manipulation, or any illegal activities. Violations will result in immediate account termination and may be reported to relevant authorities.' },
    { title: '7. Platform Availability', content: 'We strive to maintain 24/7 platform availability but do not guarantee uninterrupted service. We reserve the right to suspend or terminate services for maintenance, security, or legal reasons.' },
    { title: '8. Privacy Policy', content: 'We collect and process personal data in accordance with applicable data protection laws. Your information is used solely for providing our services and will not be sold to third parties. See our Privacy Policy for full details.' },
    { title: '9. Intellectual Property', content: 'All content, trademarks, and intellectual property on Quantyrex Markets are owned by or licensed to us. You may not copy, reproduce, or distribute any content without prior written permission.' },
    { title: '10. Limitation of Liability', content: 'Quantyrex Markets shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability shall not exceed the amount deposited in your account.' },
    { title: '11. Governing Law', content: 'These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through arbitration before resorting to court proceedings.' },
    { title: '12. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the platform constitutes acceptance of the modified terms.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', color: 'white', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#132035', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: '800', fontSize: '13px', cursor: 'pointer' }} onClick={() => navigate('/')}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '10px', cursor: 'pointer' }}>Home</button>
          <button onClick={() => navigate('/signup')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Get Started</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Terms & Conditions</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '32px' }}>Last updated: March 2026</p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', lineHeight: '1.8', marginBottom: '32px', background: '#1a2e4a', padding: '16px', borderLeft: '3px solid #6366f1' }}>
          Please read these Terms and Conditions carefully before using Quantyrex Markets. These terms govern your use of our platform and services.
        </p>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '24px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>{s.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', lineHeight: '1.8', margin: 0 }}>{s.content}</p>
          </div>
        ))}
        <div style={{ background: '#1a2e4a', padding: '20px', marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '12px' }}>Have questions about our terms?</p>
          <button onClick={() => navigate('/#contact')} style={{ background: '#6366f1', border: 'none', color: 'white', padding: '10px 24px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>Contact Us</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#132035', padding: '16px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '40px' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>© 2026 Quantyrex Markets. All rights reserved.</span>
      </div>
    </div>
  );
}
