import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { User, Edit2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import { updateProfile } from '../services/api';

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸', minLen: 10, maxLen: 10 },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', minLen: 10, maxLen: 10 },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', minLen: 10, maxLen: 11 },
  { name: 'India', code: '+91', flag: '🇮🇳', minLen: 10, maxLen: 10 },
  { name: 'Canada', code: '+1', flag: '🇨🇦', minLen: 10, maxLen: 10 },
  { name: 'Germany', code: '+49', flag: '🇩🇪', minLen: 10, maxLen: 11 },
  { name: 'France', code: '+33', flag: '🇫🇷', minLen: 9, maxLen: 9 },
  { name: 'China', code: '+86', flag: '🇨🇳', minLen: 11, maxLen: 11 },
  { name: 'Japan', code: '+81', flag: '🇯🇵', minLen: 10, maxLen: 11 },
  { name: 'Russia', code: '+7', flag: '🇷🇺', minLen: 10, maxLen: 10 },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', minLen: 10, maxLen: 11 },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', minLen: 9, maxLen: 9 },
  { name: 'UAE', code: '+971', flag: '🇦🇪', minLen: 9, maxLen: 9 },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', minLen: 9, maxLen: 9 },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', minLen: 9, maxLen: 9 },
  { name: 'Australia', code: '+61', flag: '🇦🇺', minLen: 9, maxLen: 9 },
  { name: 'Italy', code: '+39', flag: '🇮🇹', minLen: 9, maxLen: 10 },
  { name: 'Spain', code: '+34', flag: '🇪🇸', minLen: 9, maxLen: 9 },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', minLen: 10, maxLen: 10 },
  { name: 'Argentina', code: '+54', flag: '🇦🇷', minLen: 10, maxLen: 10 },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', minLen: 10, maxLen: 10 },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', minLen: 10, maxLen: 10 },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩', minLen: 9, maxLen: 12 },
  { name: 'Turkey', code: '+90', flag: '🇹🇷', minLen: 10, maxLen: 10 },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', minLen: 9, maxLen: 9 },
  { name: 'Egypt', code: '+20', flag: '🇪🇬', minLen: 10, maxLen: 10 },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿', minLen: 9, maxLen: 9 },
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹', minLen: 9, maxLen: 9 },
  { name: 'Uganda', code: '+256', flag: '🇺🇬', minLen: 9, maxLen: 9 },
  { name: 'Cameroon', code: '+237', flag: '🇨🇲', minLen: 9, maxLen: 9 },
  { name: 'Senegal', code: '+221', flag: '🇸🇳', minLen: 9, maxLen: 9 },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', minLen: 9, maxLen: 9 },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', minLen: 9, maxLen: 9 },
  { name: 'Sweden', code: '+46', flag: '🇸🇪', minLen: 9, maxLen: 9 },
  { name: 'Norway', code: '+47', flag: '🇳🇴', minLen: 8, maxLen: 8 },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭', minLen: 9, maxLen: 9 },
  { name: 'Poland', code: '+48', flag: '🇵🇱', minLen: 9, maxLen: 9 },
  { name: 'Portugal', code: '+351', flag: '🇵🇹', minLen: 9, maxLen: 9 },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', minLen: 8, maxLen: 9 },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', minLen: 8, maxLen: 8 },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', minLen: 9, maxLen: 10 },
  { name: 'Philippines', code: '+63', flag: '🇵🇭', minLen: 10, maxLen: 10 },
  { name: 'Thailand', code: '+66', flag: '🇹🇭', minLen: 9, maxLen: 9 },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳', minLen: 9, maxLen: 10 },
  { name: 'South Korea', code: '+82', flag: '🇰🇷', minLen: 9, maxLen: 10 },
  { name: 'Israel', code: '+972', flag: '🇮🇱', minLen: 9, maxLen: 9 },
  { name: 'Iran', code: '+98', flag: '🇮🇷', minLen: 10, maxLen: 10 },
  { name: 'Iraq', code: '+964', flag: '🇮🇶', minLen: 10, maxLen: 10 },
  { name: 'Morocco', code: '+212', flag: '🇲🇦', minLen: 9, maxLen: 9 },
  { name: 'Algeria', code: '+213', flag: '🇩🇿', minLen: 9, maxLen: 9 },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [fileName, setFileName] = useState('No file chosen');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://quantyrexs.onrender.com/api/user/avatar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.user) {
        setAvatarPreview(null);
        setAvatarFile(null);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
      }
    } catch (e) {
      setError('Failed to remove avatar.');
    }
  };

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', currency: 'US Dollar (USD)',
    dob: '', phoneCode: '+234', phone: '', country: 'Nigeria',
    state: '', city: '', address: '',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        phoneCode: user.phoneCode || '+234',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        address: user.address || '',
        dob: user.dob ? user.dob.substring(0, 10) : '',
        currency: user.currency || 'US Dollar (USD)',
      }));
    }
  }, [user]);

  const getSelectedCountry = () =>
    COUNTRIES.find(c => c.code === form.phoneCode && c.name === form.country) ||
    COUNTRIES.find(c => c.code === form.phoneCode) ||
    COUNTRIES[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // When country changes, auto-update phone code
  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    const found = COUNTRIES.find(c => c.name === selectedName);
    setForm(prev => ({
      ...prev,
      country: selectedName,
      phoneCode: found ? found.code : prev.phoneCode,
      phone: '', // clear phone when country changes
    }));
    setErrors(prev => ({ ...prev, country: '', phone: '', phoneCode: '' }));
  };

  // When phone code changes manually
  const handlePhoneCodeChange = (e) => {
    setForm(prev => ({ ...prev, phoneCode: e.target.value, phone: '' }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFileName(f.name);
      setAvatarFile(f);
      setAvatarPreview(URL.createObjectURL(f));
    }
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
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(form.phone.trim())) {
      newErrors.phone = 'Phone number must contain digits only';
    } else {
      const selected = getSelectedCountry();
      const len = form.phone.trim().length;
      if (len < selected.minLen || len > selected.maxLen) {
        newErrors.phone = selected.minLen === selected.maxLen
          ? `${selected.name} numbers must be exactly ${selected.minLen} digits`
          : `${selected.name} numbers must be ${selected.minLen}-${selected.maxLen} digits`;
      }
    }
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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('phone', form.phone);
      formData.append('phoneCode', form.phoneCode);
      formData.append('country', form.country);
      formData.append('state', form.state);
      formData.append('city', form.city);
      formData.append('address', form.address);
      formData.append('dob', form.dob);
      formData.append('currency', form.currency);
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await updateProfile(formData);
      if (res.user) {
        updateUser(res.user);
        setSuccess(true);
        setAvatarFile(null);
        setAvatarPreview(null);
        setFileName('No file chosen');
        setTimeout(() => { setSuccess(false); setActiveTab('profile'); }, 2000);
      } else {
        setErrors({ general: res.message || 'Failed to update profile. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', background: '#0e1628',
    border: '1px solid ' + (errors[field] ? '#ef4444' : 'rgba(255,255,255,0.08)'),
    color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box'
  });
  const errStyle = { color: '#ef4444', fontSize: '7px', marginTop: '3px' };
  const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' };
  const avatarSrc = avatarPreview || (user?.avatar && user.avatar !== '' ? user.avatar : null);
  const selectedCountry = getSelectedCountry();

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Top Nav */}
      <PageHeader title="Profile" />

      <div style={{ padding: '14px' }}>
        {activeTab === 'profile' ? (
          <>
            <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '500', margin: '0 0 12px 0' }}>Manage Profile</h2>
            <div style={{ background: '#6366f1', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>{form.firstName} {form.lastName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{user?.email || ''}</div>
                </div>
                <button onClick={() => setActiveTab('edit')} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit2 size={9}/> Edit Profile
                </button>
                <button onClick={() => { logout(); navigate('/signin'); }} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer' }}>Logout</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  {avatarSrc ? <img src={avatarSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/> : null}<User size={26} color='rgba(255,255,255,0.7)' style={{ display: avatarSrc ? 'none' : 'block' }}/>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>Starter</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Plan</div></div>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>{form.currency?.split('(')[1]?.replace(')', '') || 'USD'}</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Currency</div></div>
                    <div><div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>—</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Gender</div></div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Email: {user?.email || 'N/A'}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: '#1a2035', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Edit Account</span>
              <button onClick={() => { setActiveTab('profile'); setErrors({}); setAvatarPreview(null); setAvatarFile(null); setFileName('No file chosen'); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Previous →</button>
            </div>

            {/* Success Modal */}
            {success && (
              <>
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}/>
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

            {/* General Error */}
            {errors.general && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '8px', padding: '8px 10px', marginBottom: '14px' }}>
                {errors.general}
              </div>
            )}

            {/* Profile Picture */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Profile Picture</label>
              {(avatarPreview || (user?.avatar && user.avatar !== '')) && (
                <div style={{ marginBottom: '8px' }}>
                  <img src={avatarPreview || user?.avatar} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}/>
                <button onClick={handleRemoveAvatar} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '7px', padding: '3px 8px', cursor: 'pointer', marginLeft: '8px' }}>Remove Photo</button>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', marginTop: '3px' }}>Preview — saved when you click Update Profile</div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Choose File
                  <input type='file' accept='image/*' style={{ display: 'none' }} onChange={handleFileChange}/>
                </label>
                <span style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '6px 12px', flex: 1 }}>{fileName}</span>
              </div>
            </div>

            {/* First & Last Name */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name *</label>
                <input name='firstName' value={form.firstName} onChange={handleChange} style={inputStyle('firstName')}/>
                {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name *</label>
                <input name='lastName' value={form.lastName} onChange={handleChange} style={inputStyle('lastName')}/>
                {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* Currency */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Country Currency</label>
              <select name='currency' value={form.currency} onChange={handleChange} style={{ width: '60%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none' }}>
                <option>US Dollar (USD)</option>
                <option>Euro (EUR)</option>
                <option>British Pound (GBP)</option>
                <option>Nigerian Naira (NGN)</option>
                <option>Indian Rupee (INR)</option>
                <option>Canadian Dollar (CAD)</option>
                <option>Australian Dollar (AUD)</option>
                <option>Japanese Yen (JPY)</option>
                <option>Chinese Yuan (CNY)</option>
                <option>Swiss Franc (CHF)</option>
                <option>South African Rand (ZAR)</option>
                <option>Kenyan Shilling (KES)</option>
                <option>Ghanaian Cedi (GHS)</option>
                <option>UAE Dirham (AED)</option>
                <option>Saudi Riyal (SAR)</option>
                <option>Brazilian Real (BRL)</option>
                <option>Mexican Peso (MXN)</option>
                <option>Singapore Dollar (SGD)</option>
                <option>Pakistani Rupee (PKR)</option>
                <option>Turkish Lira (TRY)</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* DOB & Phone */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Date of Birth *</label>
                <input type='date' name='dob' value={form.dob} onChange={handleChange} style={inputStyle('dob')}/>
                {errors.dob && <div style={errStyle}>{errors.dob}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone Number *</label>
                <div style={{ display: 'flex' }}>
                  <select
                    name='phoneCode'
                    value={form.phoneCode}
                    onChange={handlePhoneCodeChange}
                    style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none', color: 'white', fontSize: '8px', padding: '7px 4px', outline: 'none', maxWidth: '70px' }}
                  >
                    {COUNTRIES.map((c, i) => (
                      <option key={i} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={`${selectedCountry.minLen}-${selectedCountry.maxLen} digits`}
                    maxLength={selectedCountry.maxLen}
                    style={{ flex: 1, background: '#0e1628', border: '1px solid ' + (errors.phone ? '#ef4444' : 'rgba(255,255,255,0.08)'), color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {errors.phone
                  ? <div style={errStyle}>{errors.phone}</div>
                  : <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginTop: '3px' }}>
                      {selectedCountry.flag} {selectedCountry.name} — {selectedCountry.minLen === selectedCountry.maxLen ? `${selectedCountry.minLen} digits` : `${selectedCountry.minLen}-${selectedCountry.maxLen} digits`}
                    </div>
                }
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* Country dropdown */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Country *</label>
              <select
                name='country'
                value={form.country}
                onChange={handleCountryChange}
                style={{ width: '100%', background: '#0e1628', border: '1px solid ' + (errors.country ? '#ef4444' : 'rgba(255,255,255,0.08)'), color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none' }}
              >
                <option value=''>Select Country</option>
                {COUNTRIES.map((c, i) => (
                  <option key={i} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
              {errors.country && <div style={errStyle}>{errors.country}</div>}
            </div>

            {/* State & City */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>State *</label>
                <input name='state' value={form.state} onChange={handleChange} placeholder='Enter State' style={inputStyle('state')}/>
                {errors.state && <div style={errStyle}>{errors.state}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>City *</label>
                <input name='city' value={form.city} onChange={handleChange} placeholder='Enter City' style={inputStyle('city')}/>
                {errors.city && <div style={errStyle}>{errors.city}</div>}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Address *</label>
              <textarea name='address' value={form.address} onChange={handleChange} placeholder='Enter your address here' rows={3} style={{ width: '100%', background: '#0e1628', border: '1px solid ' + (errors.address ? '#ef4444' : 'rgba(255,255,255,0.08)'), color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}/>
              {errors.address && <div style={errStyle}>{errors.address}</div>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: '9px 20px', background: loading ? '#4b4e9b' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}