import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { User, Edit2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', currency: 'US Dollar (USD)',
    dob: '', phoneCode: '+1', phone: '', country: '', state: '', city: '', address: ''
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        country: user.country || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) newErrors.firstName = 'Must be at least 2 characters';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) newErrors.lastName = 'Must be at least 2 characters';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    else {
      const age = (new Date() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18) newErrors.dob = 'You must be at least 18 years old';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{7,15}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid phone number (7-15 digits)';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    else if (form.address.trim().length < 10) newErrors.address = 'Please enter a complete address';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('phone', form.phone);
      formData.append('country', form.country);
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await updateProfile(formData);
      if (res.user) {
        updateUser(res.user);
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setActiveTab('profile'); }, 2000);
      }
    } catch (err) {
      setErrors({ firstName: 'Failed to update profile' });
    }
  };

  const inputStyle = (field) => ({
    width: '100%', background: '#1e2538',
    border: '1px solid ' + (errors[field] ? '#ef4444' : 'rgba(255,255,255,0.08)'),
    color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box'
  });

  const errStyle = { color: '#ef4444', fontSize: '7px', marginTop: '3px' };
  const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: '#1e2538', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px' }}>
            <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
              <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
              <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
              <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
            </svg>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b', fontSize: '8px', cursor: 'pointer' }}>&#8383; 0.00</button>
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={9}/> Trade</button>
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#22c55e', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={9}/> $0.00</button>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {avatarPreview || user?.avatar ? <img src={avatarPreview || 'https://primevextpro.onrender.com' + user?.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={14} color='rgba(255,255,255,0.6)'/>}
          </div>
        </div>
      </div>

   <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ padding: '14px' }}>
        {activeTab === 'profile' ? (
          <>
            <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '500', margin: '0 0 12px 0' }}>Manage Profile</h2>
            <div style={{ background: '#6366f1', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>{form.firstName} {form.lastName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Ung</div>
                </div>
                <button onClick={() => setActiveTab('edit')} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit2 size={9}/> Edit Profile
                </button>
                <button onClick={() => { logout(); navigate('/signin'); }} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Logout</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  {avatarPreview || user?.avatar ? <img src={avatarPreview || 'https://primevextpro.onrender.com' + user?.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={26} color='rgba(255,255,255,0.7)'/>}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>Starter</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Plan</div></div>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>USD</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Currency</div></div>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>—</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Gender</div></div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Email: johndoe@email.com</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: '#1a2035', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Edit Account</span>
              <button onClick={() => { setActiveTab('profile'); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Previous →</button>
            </div>

            {success && (
              <>
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
                  </div>
                  <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Profile Updated!</div>
                  <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Your profile has been updated successfully.</div>
                  <button onClick={() => { setSuccess(false); setActiveTab('profile'); }} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
                </div>
              </>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ background: '#252d3d', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Choose File
                  <input type='file' accept='image/*' style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if(f){ setFileName(f.name); setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); } }} />
                </label>
                <span style={{ background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '6px 12px', flex: 1 }}>{fileName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name *</label>
                <input name='firstName' value={form.firstName} onChange={handleChange} style={inputStyle('firstName')} />
                {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name *</label>
                <input name='lastName' value={form.lastName} onChange={handleChange} style={inputStyle('lastName')} />
                {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Country Currency</label>
              <select name='currency' value={form.currency} onChange={handleChange} style={{ width: '50%', background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none' }}>
                <option>US Dollar (USD)</option><option>Euro (EUR)</option><option>British Pound (GBP)</option>
                <option>Nigerian Naira (NGN)</option><option>Indian Rupee (INR)</option><option>Canadian Dollar (CAD)</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Date of Birth *</label>
                <input type='date' name='dob' value={form.dob} onChange={handleChange} style={inputStyle('dob')} />
                {errors.dob && <div style={errStyle}>{errors.dob}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone Number *</label>
                <div style={{ display: 'flex' }}>
                  <select name='phoneCode' value={form.phoneCode} onChange={handleChange} style={{ background: '#1e2538', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none', color: 'white', fontSize: '8px', padding: '7px 4px', outline: 'none' }}>
                    <option value='+1'>+1</option><option value='+44'>+44</option><option value='+91'>+91</option>
                    <option value='+234'>+234</option><option value='+49'>+49</option><option value='+33'>+33</option>
                    <option value='+86'>+86</option><option value='+81'>+81</option><option value='+7'>+7</option>
                    <option value='+55'>+55</option><option value='+27'>+27</option><option value='+971'>+971</option>
                    <option value='+254'>+254</option><option value='+233'>+233</option>
                  </select>
                  <input name='phone' value={form.phone} onChange={handleChange} placeholder='Phone number' style={{ flex: 1, background: '#1e2538', border: '1px solid ' + (errors.phone ? '#ef4444' : 'rgba(255,255,255,0.08)'), color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {errors.phone && <div style={errStyle}>{errors.phone}</div>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {[['country','Country'],['state','State'],['city','City']].map(([name, label]) => (
                <div key={name} style={{ flex: 1 }}>
                  <label style={labelStyle}>{label} *</label>
                  <input name={name} value={form[name]} onChange={handleChange} placeholder={'Enter ' + label} style={inputStyle(name)} />
                  {errors[name] && <div style={errStyle}>{errors[name]}</div>}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Address *</label>
              <textarea name='address' value={form.address} onChange={handleChange} placeholder='Enter your address here' rows={3} style={{ width: '100%', background: '#1e2538', border: '1px solid ' + (errors.address ? '#ef4444' : 'rgba(255,255,255,0.08)'), color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              {errors.address && <div style={errStyle}>{errors.address}</div>}
            </div>

            <button onClick={handleSubmit} style={{ padding: '9px 20px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
