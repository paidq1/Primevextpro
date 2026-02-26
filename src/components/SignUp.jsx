import { useState } from 'react';

const countries = [
  'US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)', 'Indian Rupee (INR)',
  'Nigerian Naira (NGN)', 'Canadian Dollar (CAD)', 'Australian Dollar (AUD)',
  'Japanese Yen (JPY)', 'Swiss Franc (CHF)', 'Chinese Yuan (CNY)',
];

const countryCodes = [
  { flag: '🇺🇸', code: '+1', name: 'United States' },
  { flag: '🇬🇧', code: '+44', name: 'United Kingdom' },
  { flag: '🇳🇬', code: '+234', name: 'Nigeria' },
  { flag: '🇮🇳', code: '+91', name: 'India' },
  { flag: '🇨🇦', code: '+1', name: 'Canada' },
  { flag: '🇦🇺', code: '+61', name: 'Australia' },
  { flag: '🇩🇪', code: '+49', name: 'Germany' },
  { flag: '🇫🇷', code: '+33', name: 'France' },
  { flag: '🇿🇦', code: '+27', name: 'South Africa' },
  { flag: '🇬🇭', code: '+233', name: 'Ghana' },
  { flag: '🇰🇪', code: '+254', name: 'Kenya' },
  { flag: '🇹🇿', code: '+255', name: 'Tanzania' },
  { flag: '🇺🇬', code: '+256', name: 'Uganda' },
  { flag: '🇪🇹', code: '+251', name: 'Ethiopia' },
  { flag: '🇨🇮', code: '+225', name: 'Ivory Coast' },
  { flag: '🇸🇳', code: '+221', name: 'Senegal' },
  { flag: '🇨🇲', code: '+237', name: 'Cameroon' },
  { flag: '🇦🇪', code: '+971', name: 'UAE' },
  { flag: '🇸🇦', code: '+966', name: 'Saudi Arabia' },
  { flag: '🇶🇦', code: '+974', name: 'Qatar' },
  { flag: '🇸🇬', code: '+65', name: 'Singapore' },
  { flag: '🇲🇾', code: '+60', name: 'Malaysia' },
  { flag: '🇮🇩', code: '+62', name: 'Indonesia' },
  { flag: '🇧🇷', code: '+55', name: 'Brazil' },
  { flag: '🇲🇽', code: '+52', name: 'Mexico' },
  { flag: '🇦🇷', code: '+54', name: 'Argentina' },
  { flag: '🇵🇰', code: '+92', name: 'Pakistan' },
  { flag: '🇧🇩', code: '+880', name: 'Bangladesh' },
  { flag: '🇵🇭', code: '+63', name: 'Philippines' },
  { flag: '🇯🇵', code: '+81', name: 'Japan' },
  { flag: '🇰🇷', code: '+82', name: 'South Korea' },
  { flag: '🇨🇳', code: '+86', name: 'China' },
  { flag: '🇷🇺', code: '+7', name: 'Russia' },
  { flag: '🇹🇷', code: '+90', name: 'Turkey' },
  { flag: '🇮🇹', code: '+39', name: 'Italy' },
  { flag: '🇪🇸', code: '+34', name: 'Spain' },
  { flag: '🇵🇹', code: '+351', name: 'Portugal' },
  { flag: '🇳🇱', code: '+31', name: 'Netherlands' },
  { flag: '🇧🇪', code: '+32', name: 'Belgium' },
  { flag: '🇨🇭', code: '+41', name: 'Switzerland' },
  { flag: '🇸🇪', code: '+46', name: 'Sweden' },
  { flag: '🇳🇴', code: '+47', name: 'Norway' },
  { flag: '🇩🇰', code: '+45', name: 'Denmark' },
  { flag: '🇵🇱', code: '+48', name: 'Poland' },
  { flag: '🇺🇦', code: '+380', name: 'Ukraine' },
  { flag: '🇳🇿', code: '+64', name: 'New Zealand' },
];

const SignUp = ({ onClose, onLoginClick }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', phone: '', currency: 'US Dollar (USD)', password: '', confirmPassword: '', agree: false });
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8899aa', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(180,190,205,0.2)', position: 'absolute' }} />
      </div>
      <div style={{ background: '#2d3748', borderRadius: '0px', width: '340px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#374151', padding: '16px', textAlign: 'center', borderRadius: '0px' }}>
          <svg viewBox="0 0 40 40" fill="none" width="32" height="32" style={{ margin: '0 auto 8px' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
          <div style={{ width: '100%', height: '1px', background: 'rgba(99,102,241,0.4)', marginBottom: '12px' }} />
          <h2 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Account Sign Up</h2>
          <p style={{ color: '#94a3b8', fontSize: '8px' }}>Don't have an account? Create your account, it takes less than a minute</p>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Firstname" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Lastname" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
              <select value={selectedCountry.code + selectedCountry.name} onChange={e => setSelectedCountry(countryCodes.find(c => c.code + c.name === e.target.value))} style={{ background: '#4b5563', border: 'none', color: 'white', fontSize: '8px', padding: '6px 2px', outline: 'none', cursor: 'pointer', maxWidth: '140px' }}>
                {countryCodes.map((c, i) => <option key={i} value={c.code + c.name}>{c.flag} {c.name} {c.code}</option>)}
              </select>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="0802 123 4567" style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '8px', outline: 'none', padding: '8px' }} />
            </div>
          </div>
          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Country Currency</label>
            <select name="currency" value={form.currency} onChange={handleChange} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }}>
              {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg> : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>} value={form.password} onChange={handleChange} placeholder="Enter password" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px 28px 8px 8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '10px' }}>{showPass ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg> : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>}</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input name="confirmPassword" type={showConfirm ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg> : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px 28px 8px 8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
                <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '10px' }}>{showConfirm ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg> : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>}</button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} style={{ accentColor: '#6366f1', width: '12px', height: '12px' }} />
            <span style={{ color: '#94a3b8', fontSize: '8px' }}>I agree to the <span style={{ color: '#6366f1', cursor: 'pointer' }}>terms</span> and <span style={{ color: '#6366f1', cursor: 'pointer' }}>conditions</span></span>
          </div>
          <button onClick={() => window.location.href="/dashboard"} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Register</button>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '8px', margin: 0 }}>Already have account? <span onClick={() => window.location.href='/signin'} style={{ color: 'white', fontWeight: '600', cursor: 'pointer' }}>Log In</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
