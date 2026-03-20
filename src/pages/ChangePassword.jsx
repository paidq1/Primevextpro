import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) return setError('All fields are required.');
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match.');
    if (form.newPassword.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const res = await fetch('https://vertextrades.onrender.com/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed to change password.');
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/settings'), 2000);
    } catch(e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', sans-serif", padding: '0' }}>
      <div style={{ background: '#131b2e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard/settings')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <Lock size={18} color="#6366f1" />
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>Change Password</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Password Changed!</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Redirecting to settings...</div>
            </div>
          ) : (
            <>
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                <div key={field} style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', display: 'block', marginBottom: '6px' }}>
                    {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', padding: '10px 12px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box' }}
                    placeholder={field === 'currentPassword' ? 'Enter current password' : field === 'newPassword' ? 'Enter new password' : 'Confirm new password'}
                  />
                </div>
              ))}
              {error && <div style={{ color: '#ef4444', fontSize: '10px', marginBottom: '12px' }}>{error}</div>}
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '8px' }}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
