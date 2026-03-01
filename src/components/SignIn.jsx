import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [verifyPopup, setVerifyPopup] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username or email is required';
    else if (form.username.trim().length < 3) newErrors.username = 'At least 3 characters required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email: form.username, password: form.password });
      if (res.token) {
        login(res.token, res.user);
        setSuccess(true);
        setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
      } else if (res.message && res.message.toLowerCase().includes('verify')) {
        setVerifyPopup(true);
        setVerifyEmail(form.username);
      } else {
        setErrors({ username: res.message || 'Invalid credentials' });
      }
    } catch (err) {
      setErrors({ username: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', background: '#374151',
    border: '1px solid ' + (errors[field] ? '#ef4444' : 'transparent'),
    borderRadius: '4px', padding: '8px', color: 'white', fontSize: '8px',
    boxSizing: 'border-box', outline: 'none'
  });

  const errStyle = { color: '#ef4444', fontSize: '7px', marginTop: '2px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8899aa', padding: '20px', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
        <div style={{ width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(180,190,205,0.2)', position: 'absolute' }} />
      </div>

      {/* Verify Email Popup */}
      {verifyPopup && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Success!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>You need to verify your email address first.</div>
            <button onClick={() => navigate('/check-email', { state: { email: verifyEmail } })} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}

      {/* Success Popup */}
      {success && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Login Successful!</div>
            <div style={{ color: '#555', fontSize: '9px', lineHeight: '1.6' }}>Redirecting to your dashboard...</div>
          </div>
        </>
      )}

      <div style={{ background: '#2d3748', width: '340px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#374151', padding: '16px', textAlign: 'center' }}>
          <svg viewBox="0 0 40 40" fill="none" width="32" height="32" style={{ margin: '0 auto 8px' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
          <div style={{ width: '100%', height: '1px', background: 'rgba(99,102,241,0.4)', marginBottom: '12px' }} />
          <h2 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Sign In</h2>
          <p style={{ color: '#94a3b8', fontSize: '8px' }}>Enter your email or username and password to access your dashboard.</p>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Username | Email *</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Enter Username or Email" style={inputStyle('username')} />
            {errors.username && <div style={errStyle}>{errors.username}</div>}
          </div>

          <div>
            <label style={{ color: 'white', fontSize: '8px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter password"
                style={{ ...inputStyle('password'), paddingRight: '28px' }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass
                  ? <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'/></svg>
                  : <svg width='12' height='12' fill='none' stroke='#94a3b8' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>
                }
              </button>
            </div>
            {errors.password && <div style={errStyle}>{errors.password}</div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} style={{ accentColor: '#6366f1', width: '12px', height: '12px' }} />
              <span style={{ color: 'white', fontSize: '8px' }}>Remember me</span>
            </div>
            <span style={{ color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#4b4f9e' : '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '9px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '8px', margin: 0 }}>
            Don't have an account? <span onClick={() => window.location.href='/signup'} style={{ color: 'white', fontWeight: '600', cursor: 'pointer' }}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
