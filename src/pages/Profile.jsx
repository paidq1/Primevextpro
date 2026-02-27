import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { User, Edit2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#2e3545', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ background: '#2e3545', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>&#8383;</span> 0.00
          </button>
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={9}/> Trade
          </button>
          <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#22c55e', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={9}/> $0.00
          </button>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} color='rgba(255,255,255,0.6)'/>
          </div>
        </div>
      </div>

      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ padding: '14px' }}>
        {activeTab === 'profile' ? (
          <>
            <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '500', margin: '0 0 12px 0' }}>Manage Profile</h2>
            {/* Profile Card */}
            <div style={{ background: '#6366f1', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>John Doe</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Ung</div>
                </div>
                <button onClick={() => setActiveTab('edit')} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit2 size={9}/> Edit Profile
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }}>
                  <User size={26} color='rgba(255,255,255,0.7)'/>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>Starter</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Plan</div>
                    </div>
                    <div>
                      <div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>USD</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Currency</div>
                    </div>
                    <div>
                      <div style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>—</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>Gender</div>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Email: johndoe@email.com</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: '#1a2035', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Edit Ung's Account</span>
              <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '8px', cursor: 'pointer' }}>Previous →</button>
            </div>

            {/* Profile Picture */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '6px' }}>Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <label style={{ background: '#3d4558', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '8px', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Choose File
                  <input type='file' accept='image/*' style={{ display: 'none' }} onChange={e => {}} />
                </label>
                <span style={{ background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '6px 12px', flex: 1 }}>No file chosen</span>
              </div>
            </div>

            {/* First Name + Last Name */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>First Name</label>
                <input defaultValue='John' style={{ width: '100%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Last Name</label>
                <input defaultValue='Doe' style={{ width: '100%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* Currency */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Country Currency</label>
              <select style={{ width: '50%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none' }}>
                <option>US Dollar (USD)</option>
                <option>Euro (EUR)</option>
                <option>British Pound (GBP)</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* DOB + Phone */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Date of Birth</label>
                <input type='date' style={{ width: '100%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Phone number</label>
                <div style={{ display: 'flex' }}>
                  <select style={{ background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none', color: 'white', fontSize: '8px', padding: '7px 4px', outline: 'none' }}>
                    <option value='+1'>🇺🇸 +1</option>
                    <option value='+44'>🇬🇧 +44</option>
                    <option value='+91'>🇮🇳 +91</option>
                    <option value='+234'>🇳🇬 +234</option>
                    <option value='+49'>🇩🇪 +49</option>
                    <option value='+33'>🇫🇷 +33</option>
                    <option value='+86'>🇨🇳 +86</option>
                    <option value='+81'>🇯🇵 +81</option>
                    <option value='+7'>🇷🇺 +7</option>
                    <option value='+55'>🇧🇷 +55</option>
                    <option value='+27'>🇿🇦 +27</option>
                    <option value='+971'>🇦🇪 +971</option>
                    <option value='+966'>🇸🇦 +966</option>
                    <option value='+62'>🇮🇩 +62</option>
                    <option value='+92'>🇵🇰 +92</option>
                    <option value='+880'>🇧🇩 +880</option>
                    <option value='+20'>🇪🇬 +20</option>
                    <option value='+254'>🇰🇪 +254</option>
                    <option value='+233'>🇬🇭 +233</option>
                  </select>
                  <input placeholder='Enter phone number' style={{ flex: 1, background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}/>

            {/* Country State City */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {['Country', 'State', 'City'].map((f, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>{f}</label>
                  <input placeholder={'Enter ' + f} style={{ width: '100%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 6px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>

            {/* Address */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', display: 'block', marginBottom: '4px' }}>Address</label>
              <textarea placeholder='Enter your address here' rows={3} style={{ width: '100%', background: '#2e3545', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '7px 10px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>

            <button style={{ padding: '9px 20px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
              Update profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
