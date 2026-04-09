import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

const countries = [
  'US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)', 'Indian Rupee (INR)',
  'Nigerian Naira (NGN)', 'Canadian Dollar (CAD)', 'Australian Dollar (AUD)',
  'Japanese Yen (JPY)', 'Swiss Franc (CHF)', 'Chinese Yuan (CNY)',
];

const SignUp = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', phone: '', currency: 'US Dollar (USD)', password: '', confirmPassword: '', agree: false });
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || '';
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) newErrors.firstName = 'At least 2 characters';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) newErrors.lastName = 'At least 2 characters';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    else if (form.username.trim().length < 3) newErrors.username = 'At least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) newErrors.username = 'Only letters, numbers, underscores';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d+$/.test(form.phone.trim())) newErrors.phone = 'Phone number must contain digits only';
    else {
      const phoneLengths = {
        '+1': [10], '+44': [10], '+234': [10], '+91': [10], '+61': [9],
        '+49': [10,11], '+33': [9], '+27': [9], '+233': [9], '+254': [9],
        '+255': [9], '+256': [9], '+251': [9], '+225': [8,10], '+221': [9],
        '+237': [9], '+971': [9], '+966': [9], '+974': [8], '+65': [8],
        '+60': [9,10], '+62': [9,10,11], '+55': [10,11], '+52': [10],
        '+54': [10], '+92': [10], '+880': [10], '+63': [10], '+81': [10,11],
        '+82': [9,10], '+86': [11], '+7': [10], '+90': [10], '+39': [10],
        '+34': [9], '+351': [9], '+31': [9], '+32': [9], '+41': [9],
        '+46': [9], '+47': [8], '+45': [8], '+48': [9], '+380': [9], '+64': [9]
      };
      const code = selectedCountry.code;
      const len = form.phone.trim().length;
      const validLengths = phoneLengths[code];
      if (validLengths && !validLengths.includes(len)) {
        newErrors.phone = 'Phone number must be ' + validLengths.join(' or ') + ' digits for ' + selectedCountry.name;
      }
    }
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'At least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) newErrors.password = 'Must include uppercase, lowercase and number';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.agree) newErrors.agree = 'You must agree to the terms';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      const res = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: selectedCountry.code + form.phone,
        country: selectedCountry.name,
        password: form.password,
        referralCode: form.referralCode,
      });
      if (res.token) {
        login(res.token, res.user);
        setSuccess(true);
        setTimeout(() => { window.location.replace('/signin'); }, 2000);
      } else {
        setErrors({ email: res.message || "Registration failed" });
      }
    } catch (err) {
      setErrors({ email: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', background: '#374151',
    border: '1px solid ' + (errors[field] ? '#ef4444' : 'transparent'),
    borderRadius: '4px', padding: '8px', color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)',
    boxSizing: 'border-box', outline: 'none'
  });

  const errStyle = { color: '#ef4444', fontSize: 'clamp(6px, 1.6vw, 8px)', marginTop: '2px' };

  if (checkEmail) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e1628' }}>
      <div style={{ background: '#1a2e4a', width: '340px', padding: '40px 24px', textAlign: 'center', borderRadius: '4px' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ margin: '0 auto' }}>
            <rect width='64' height='64' rx='8' fill='#f59e0b' opacity='0.15'/>
            <path d='M12 20h40v28H12V20z' fill='#f59e0b' opacity='0.3'/>
            <path d='M12 20l20 18 20-18' stroke='#f59e0b' strokeWidth='2' fill='none'/>
            <circle cx='32' cy='32' r='10' fill='#f59e0b' opacity='0.8'/>
            <text x='32' y='37' textAnchor='middle' fill='white' fontSize='14' fontWeight='bold'>@</text>
          </svg>
        </div>
        <h2 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Check your mailbox!</h2>
        <p style={{ color: '#94a3b8', fontSize: '9px', marginBottom: '24px', lineHeight: '1.8' }}>
          Hello! <strong style={{ color: 'white' }}>{form.firstName} {form.lastName}</strong>, an email has been sent to <strong style={{ color: 'white' }}>{form.email.replace(/(.{1})(.*)(@.*)/, '$1**********$3')}</strong>. Please click on the included link to confirm your email.
        </p>
        <button onClick={() => window.location.href='/signin'} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width='12' height='12' fill='none' stroke='white' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8'/></svg>
          Resend email
        </button>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
          <button onClick={() => window.location.href='/signin'} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
            ← Return to login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8899aa', padding: '8px', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(180,190,205,0.2)', position: 'absolute' }} />
      </div>

      <div style={{ background: '#2d3748', width: '92vw', maxWidth: '360px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#374151', padding: '16px', textAlign: 'center' }}>
          <svg viewBox="0 0 40 40" fill="none" width="32" height="32" style={{ margin: '0 auto 8px' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
          <div style={{ width: '100%', height: '1px', background: 'rgba(99,102,241,0.4)', marginBottom: '12px' }} />
          <h2 style={{ color: 'white', fontWeight: '600', fontSize: 'clamp(12px, 3.5vw, 16px)', marginBottom: '4px' }}>Account Sign Up</h2>
          <p style={{ color: '#94a3b8', fontSize: 'clamp(7px, 1.8vw, 15px)' }}>Don't have an account? Create your account, it takes less than a minute</p>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {success && (
            <>
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
                </div>
                <div style={{ color: '#111827', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Account Created!</div>
                <div style={{ color: '#6b7280', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Welcome to Quantyrex Markets! Your account has been successfully created.</div>
                <button onClick={() => window.location.replace('/signin')} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Firstname" style={inputStyle('firstName')} />
              {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Lastname" style={inputStyle('lastName')} />
              {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Username *</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={inputStyle('username')} />
              {errors.username && <div style={errStyle}>{errors.username}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" style={inputStyle('email')} />
              {errors.email && <div style={errStyle}>{errors.email}</div>}
            </div>
          </div>

          <div>
            <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#374151', borderRadius: '4px', overflow: 'hidden', border: '1px solid ' + (errors.phone ? '#ef4444' : 'transparent') }}>
              <select value={selectedCountry.code + selectedCountry.name} onChange={e => setSelectedCountry(countryCodes.find(c => c.code + c.name === e.target.value))} style={{ background: '#4b5563', border: 'none', color: 'white', fontSize: '8px', padding: '6px 2px', outline: 'none', cursor: 'pointer', maxWidth: '140px' }}>
                {countryCodes.map((c, i) => <option key={i} value={c.code + c.name}>{c.flag} {c.name} {c.code}</option>)}
              </select>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '8px', outline: 'none', padding: '8px' }} />
            </div>
            {errors.phone && <div style={errStyle}>{errors.phone}</div>}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }}>
                {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Referral Code <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span></label>
              <input name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="Enter code" style={{ width: '100%', background: '#374151', border: '1px solid transparent', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter password" style={{ ...inputStyle('password'), paddingRight: '28px' }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass
                    ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg>
                    : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>
                  }
                </button>
              </div>
              {errors.password && <div style={errStyle}>{errors.password}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'white', fontSize: 'clamp(7px, 1.8vw, 15px)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" style={{ ...inputStyle('confirmPassword'), paddingRight: '28px' }} />
                <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showConfirm
                    ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg>
                    : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>
                  }
                </button>
              </div>
              {errors.confirmPassword && <div style={errStyle}>{errors.confirmPassword}</div>}
            </div>
          </div>



          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} style={{ accentColor: '#6366f1', width: '12px', height: '12px' }} />
              <span style={{ color: '#94a3b8', fontSize: '8px' }}>I agree to the <span style={{ color: '#6366f1', cursor: 'pointer' }}>terms</span> and <span style={{ color: '#6366f1', cursor: 'pointer' }}>conditions</span></span>
            </div>
            {errors.agree && <div style={errStyle}>{errors.agree}</div>}
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#4b4f9e' : '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {loading ? (
              <>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' style={{ animation: 'spin 1s linear infinite' }}><path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83'/></svg>
                Creating Account...
              </>
            ) : 'Register'}
          </button>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(7px, 1.8vw, 15px)', margin: 0 }}>
            Already have account? <span onClick={() => window.location.href='/signin'} style={{ color: 'white', fontWeight: '600', cursor: 'pointer' }}>Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
