import { useState, useEffect } from 'react';
import { createDeposit, getDeposits } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

export default function Deposit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositMethod, setDepositMethod] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [coin, setCoin] = useState('USDT');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);

  const walletAddresses = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    USDT: 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS',
    BNB: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
    XRP: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    SOL: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  };
  const walletAddress = walletAddresses[coin] || walletAddresses['USDT'];

  useEffect(() => {
    getDeposits().then(data => {
      if (Array.isArray(data)) setDeposits(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {
      const el = document.createElement('textarea');
      el.value = walletAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) < 10) { setError('Minimum deposit is $10.'); return; }
    if (!fileData) { setError('Please upload payment proof.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', Number(amount));
      formData.append('method', depositMethod);
      formData.append('proof', fileData);
      const res = await createDeposit(formData);
      if (res.transaction) {
        setDeposits(prev => [res.transaction, ...prev]);
        setShowForm(false);
        setAmount('');
        setFileData(null);
        setFileName('No file chosen');
        setShowSuccess(true);
      } else {
        setError(res.message || 'Failed to submit deposit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = s => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b';
  const statusLabel = s => s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Pending';

  const filtered = deposits.filter(d =>
    d.method?.toLowerCase().includes(search.toLowerCase()) ||
    d.status?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, show);

  const inputStyle = { width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Deposit</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      {/* New Deposit Form Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#0e1628', border: '1px solid rgba(99,102,241,0.3)', padding: '16px', width: '320px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Deposit Funds</span>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Form */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Payment Method</label>
                  <select value={depositMethod} onChange={e => setDepositMethod(e.target.value)}
                    style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }}>
                    <option value='crypto'>Crypto (USDT)</option>
                    <option value='bank'>Bank Transfer</option>
                  </select>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Amount (USD)</label>
                  <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='Min. $10.00' style={inputStyle}/>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Payment Proof</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 8px' }}>
                    <label style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '7px', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Choose File
                      <input type='file' accept='image/*' style={{ display: 'none' }} onChange={e => { if(e.target.files[0]){ setFileData(e.target.files[0]); setFileName(e.target.files[0].name); }}}/>
                    </label>
                    <span style={{ color: fileData ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
                  </div>
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px' }}>{error}</div>}
                <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '9px', background: submitting ? '#4b4e9b' : '#22c55e', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Submitting...' : 'Submit Deposit'}
                </button>
              </div>

              {/* QR Panel */}
              <div style={{ width: '120px', flexShrink: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '6px', marginBottom: '3px', textAlign: 'left' }}>USDT Address:</div>
                <div style={{ color: '#6366f1', fontSize: '6px', wordBreak: 'break-all', marginBottom: '4px', textAlign: 'left' }}>{walletAddress}</div>
                <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '3px', background: copied ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '6px', padding: '3px 6px', cursor: 'pointer', marginBottom: '6px', width: '100%', justifyContent: 'center' }}>
                  <Copy size={8}/> {copied ? 'Copied!' : 'Copy'}
                </button>
                <div style={{ color: 'white', fontSize: '7px', fontWeight: '700', marginBottom: '6px' }}>Deposit USDT to VertexTrade Pro</div>
                <img src='/qrcode.jpg' alt='QR' style={{ width: '80px', height: '80px', margin: '0 auto 6px', display: 'block' }}/>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '6px', marginBottom: '3px' }}>Network: TRC20</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '5px' }}>*USDT only</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: 'white', padding: '28px 20px', width: '260px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Deposit Submitted!</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px', lineHeight: '1.6' }}>Your deposit is pending approval. We'll notify you once confirmed.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}

      <div style={{ padding: '16px' }}>
        {/* Balance + New Deposit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 14px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>Available Balance</div>
            <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: '700' }}>${(user?.balance || 0).toFixed(2)}</div>
          </div>
          <button onClick={() => navigate('/dashboard/deposit-funds')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '8px 14px', cursor: 'pointer' }}>+ New Deposit</button>
        </div>

        {/* Table */}
        <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
              <select value={show} onChange={e => setShow(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
              <input value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }}/>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Amount', 'Method', 'Status', 'Date'].map((h, i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 10px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h} ↕</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No deposits found</td></tr>
              ) : filtered.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px 10px', color: '#22c55e', fontSize: '8px', fontWeight: '700' }}>+${d.amount?.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)', fontSize: '8px', textTransform: 'capitalize' }}>{d.method || 'crypto'}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: statusColor(d.status) + '20', color: statusColor(d.status), fontSize: '7px', padding: '2px 6px', display: 'inline-block' }}>{statusLabel(d.status)}</span>
                  </td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length > 0 ? 1 : 0} to {filtered.length} of {deposits.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
