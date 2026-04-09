import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Shield } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const sendCode = async () => {
    if (!email) return setError('Please enter your email.');
    setLoading(true); setError('');
    try {
      const res = await fetch('https://quantyrexs.onrender.com/api/auth/send-change-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed to send code.');
      setStep(2);
    } catch(e) { setError('Network error.'); }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!code) return setError('Please enter the verification code.');
    setLoading(true); setError('');
    try {
      const res = await fetch('https://quantyrexs.onrender.com/api/auth/verify-change-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Invalid code.');
      setResetToken(data.token);
      setStep(3);
    } catch(e) { setError('Network error.'); }
    setLoading(false);
  };

  const changePassword = async () => {
    if (!form.newPassword || !form.confirmPassword) return setError('All fields required.');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.newPassword.length < 6) return setError('Min 6 characters.');
    setLoading(true); setError('');
    try {
      const res = await fetch(`https://quantyrexs.onrender.com/api/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.newPassword })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed.');
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/settings'), 2000);
    } catch(e) { setError('Network error.'); }
    setLoading(false);
  };

  const steps = [
    { icon: <Mail size={22} color="#6366f1" />, title: 'Confirm Email', desc: 'Enter your email to receive a verification code.' },
    { icon: <Shield size={22} color="#6366f1" />, title: 'Enter Code', desc: 'Check your email for the verification code.' },
    { icon: <Lock size={22} color="#6366f1" />, title: 'New Password', desc: 'Set your new password.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#131b2e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard/settings')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <Lock size={18} color="#6366f1" />
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Change Password</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: s <= step ? '#6366f1' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px 20px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Password Changed!</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Redirecting to settings...</div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  {steps[step-1].icon}
                </div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>{steps[step-1].title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{steps[step-1].desc}</div>
              </div>

              {step === 1 && (
                <>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', padding: '12px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '12px' }} />
                  {error && <div style={{ color: '#ef4444', fontSize: '10px', marginBottom: '12px' }}>{error}</div>}
                  <button onClick={sendCode} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer', borderRadius: '8px' }}>
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textAlign: 'center', marginBottom: '16px' }}>Code sent to <span style={{ color: '#6366f1' }}>{email}</span></div>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '18px', padding: '12px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '12px', textAlign: 'center', letterSpacing: '6px' }} />
                  {error && <div style={{ color: '#ef4444', fontSize: '10px', marginBottom: '12px' }}>{error}</div>}
                  <button onClick={verifyCode} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer', borderRadius: '8px' }}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <div onClick={sendCode} style={{ textAlign: 'center', marginTop: '12px', color: '#6366f1', fontSize: '10px', cursor: 'pointer' }}>Resend code</div>
                </>
              )}

              {step === 3 && (
                <>
                  {['newPassword', 'confirmPassword'].map(field => (
                    <div key={field} style={{ marginBottom: '14px' }}>
                      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', display: 'block', marginBottom: '6px' }}>
                        {field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <input type="password" value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={field === 'newPassword' ? 'Enter new password' : 'Confirm new password'}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', padding: '12px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  {error && <div style={{ color: '#ef4444', fontSize: '10px', marginBottom: '12px' }}>{error}</div>}
                  <button onClick={changePassword} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer', borderRadius: '8px' }}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
