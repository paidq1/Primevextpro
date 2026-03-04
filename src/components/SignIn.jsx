import { useState } from 'react';
import { loginUser, forgotPassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotLink, setForgotLink] = useState('');
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
        setTimeout(() => { window.location.replace('/dashboard'); }, 1500);
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

  const errStyle = { color: '#ef4444', fontSize: '7px', marginTop: '3px' };

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8899aa', padding: '20px', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
          <div style={{ width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(180,190,205,0.25)', position: 'absolute' }} />
          <div style={{ width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(180,190,205,0.2)', position: 'absolute' }} />
        </div>

        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '28px 24px', width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '40px', height: '40px', margin: '0 auto 10px' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>Welcome Back</h2>
            <p style={{ color: '#94a3b8', fontSize: '8px' }}>Enter your email or username and password to access your dashboard.</p>
          </div>

          {success && (
            <>
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>
                </div>
                <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Login Successful!</div>
                <div style={{ color: '#555', fontSize: '9px', lineHeight: '1.6' }}>Redirecting to your dashboard...</div>
              </div>
            </>
          )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#94a3b8', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Email or Username</label>
                <input name='username' value={form.username} onChange={handleChange} placeholder='Enter email or username' style={inputStyle('username')} />
                {errors.username && <div style={errStyle}>{errors.username}</div>}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#94a3b8', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name='password' type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder='Enter password'
                    style={{ ...inputStyle('password'), paddingRight: '28px' }} />
                  <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '8px' }}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <div style={errStyle}>{errors.password}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input type='checkbox' name='remember' checked={form.remember} onChange={handleChange} style={{ accentColor: '#6366f1' }} />
                  <span style={{ color: '#94a3b8', fontSize: '8px' }}>Remember me</span>
                </label>
                <span onClick={() => setShowForgot(true)} style={{ color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#4b4f9e' : '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '9px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>

              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '8px', margin: 0 }}>
                Don't have an account? <span onClick={() => window.location.href='/signup'} style={{ color: 'white', fontWeight: '600', cursor: 'pointer' }}>Sign Up</span>
              </p>
        </div>
      </div>

      {showForgot && (
        <>
          <div onClick={() => { setShowForgot(false); setForgotMsg(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: '#1e2538', padding: '28px 24px', width: '300px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Forgot Password?</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', marginBottom: '16px' }}>Enter your email and we'll send a reset link.</div>
            <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder='Enter your email'
              style={{ width: '100%', background: '#374151', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '9px', color: 'white', fontSize: '9px', boxSizing: 'border-box', outline: 'none', marginBottom: '10px' }} />
            {forgotMsg && <div style={{ color: '#22c55e', fontSize: '8px', marginBottom: '10px' }}>{forgotMsg}{forgotLink && <a href={forgotLink} style={{ display: 'block', color: '#6366f1', marginTop: '6px', wordBreak: 'break-all' }}>Click to Reset Password</a>}</div>}
            <button onClick={async () => {
              if (!forgotEmail) { setForgotMsg('Please enter your email'); return; }
              setForgotLoading(true);
              try {
                const res = await forgotPassword(forgotEmail);
                if (res.resetUrl) {
                  setForgotMsg('Click here to reset your password');
                  setForgotLink(res.resetUrl);
                } else {
                  setForgotMsg(res.message || 'Request submitted!');
                }
              } catch(e) {
                setForgotMsg('Server error. Please try again.');
              } finally {
                setForgotLoading(false);
              }
            }} disabled={forgotLoading} style={{ width: '100%', padding: '9px', background: '#6366f1', border: 'none', borderRadius: '4px', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button onClick={() => { setShowForgot(false); setForgotMsg(''); }} style={{ width: '100%', padding: '9px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'rgba(255,255,255,0.5)', fontSize: '9px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </>
      )}
    </>
  );
};

export default SignIn;
