import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Download, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { createDeposit, getDeposits, createWithdrawal, getWithdrawals } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';

export default function WithdrawDeposit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const urlTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'deposit');

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [coin, setCoin] = useState('USDT');
  const [network, setNetwork] = useState('TRC20');
  const [withdrawNetwork, setWithdrawNetwork] = useState('TRC20');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [proofFile, setProofFile] = useState(null);
  const [proofName, setProofName] = useState('No file chosen');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [loadingDeposits, setLoadingDeposits] = useState(true);

  const walletAddress = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';
  const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'SOL'];

  useEffect(() => {
    getDeposits().then(data => {
      if (Array.isArray(data)) setDeposits(data);
      setLoadingDeposits(false);
    }).catch(() => setLoadingDeposits(false));
    getWithdrawals().then(data => {
      if (Array.isArray(data)) setWithdrawals(data);
      setLoadingWithdrawals(false);
    }).catch(() => setLoadingWithdrawals(false));
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

  const handleSubmitDeposit = async () => {
    if (!amount || parseFloat(amount) < 10) { setSubmitError('Minimum deposit is $10'); return; }
    if (!paymentMethod) { setSubmitError('Please select a payment method'); return; }
    setSubmitting(true);
    setSubmitError('');
    setSubmitMsg('');
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('method', paymentMethod === 'crypto' ? coin + ' (' + network + ')' : 'Bank Transfer');
      if (proofFile) formData.append('proof', proofFile);
      const res = await createDeposit(formData);
      if (res.transaction) {
        setSubmitMsg('Deposit submitted successfully! Awaiting confirmation.');
        setAmount('');
        setProofFile(null);
        setProofName('No file chosen');
        setDeposits(prev => [res.transaction, ...prev]);
      } else {
        setSubmitError(res.message || 'Submission failed');
      }
    } catch (e) {
      setSubmitError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

const handleWithdraw = async () => {
    setWithdrawSubmitting(true); setWithdrawError(''); setWithdrawMsg('');
    try {
      const body = {
        amount: parseFloat(amount),
        method: withdrawMethod === 'crypto' ? coin + ' (' + withdrawNetwork + ')' : 'Bank Transfer',
        walletAddress: withdrawMethod === 'crypto' ? address : '',
        bankDetails: withdrawMethod === 'bank' ? { bankName, accountName, accountNumber, swiftCode } : null,
      };
      const res = await createWithdrawal(body);
      if (res.transaction) {
        setWithdrawMsg('Withdrawal request submitted! Processing in 1-3 business days.');
        setAmount(''); setAddress('');
        setWithdrawals(prev => [res.transaction, ...prev]);
      } else {
        setWithdrawError(res.message || 'Request failed');
      }
    } catch (e) { setWithdrawError('Network error. Please try again.'); }
    setWithdrawSubmitting(false);
  };

  const inputStyle = {
    width: '100%', background: '#2a3347',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white', fontSize: '9px',
    padding: '8px 10px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.6)', fontSize: '8px',
    display: 'block', marginBottom: '5px'
  };

  const statusColor = (s) => s === 'completed' ? '#22c55e' : s === 'pending' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#132035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '16px', height: '16px' }}>
          <svg viewBox='0 0 40 40' fill='none' style={{ width: '100%', height: '100%' }}>
            <path d='M20 2L4 10V22L20 38L36 22V10L20 2Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.5'/>
            <path d='M20 8L8 14V22L20 34L32 22V14L20 8Z' fill='#0d1117' stroke='#6366F1' strokeWidth='1.2'/>
            <path d='M20 14L12 18V23L20 30L28 23V18L20 14Z' fill='#6366F1' stroke='#6366F1' strokeWidth='1'/>
          </svg>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>VERTEXTRADE <span style={{ color: '#6366f1' }}>PRO</span></span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      {/* Deposit Header */}
      <div style={{ background: '#132035', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Download size={11} color="#22c55e"/>
        <span style={{ color: '#22c55e', fontSize: '9px', fontWeight: '700' }}>DEPOSIT</span>
      </div>

      <div style={{ padding: '14px 16px' }}>

        {/* DEPOSIT TAB */}
        {activeTab === 'deposit' && (
          <div>
            <div style={{ color: 'white', fontSize: '11px', fontWeight: '600', marginBottom: '14px' }}>Deposit Funds:</div>

            {submitMsg && <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '8px', padding: '8px 12px', marginBottom: '12px' }}>{submitMsg}</div>}
            {submitError && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '8px', padding: '8px 12px', marginBottom: '12px' }}>{submitError}</div>}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Left Form */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Payment Method</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value=''>Select Payment Method</option>
                    <option value='crypto'>Crypto</option>
                    <option value='bank'>Bank Transfer</option>
                  </select>
                </div>
                {paymentMethod === 'crypto' && (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={labelStyle}>Select Coin</label>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {coins.map(c => (
                          <button key={c} onClick={() => setCoin(c)} style={{ padding: '4px 8px', background: coin === c ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', fontWeight: '700', cursor: 'pointer' }}>{c}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={labelStyle}>Select Network</label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {['TRC20','ERC20','BEP20'].map(n => (
                          <button key={n} onClick={() => setNetwork(n)} style={{ padding: '4px 8px', background: network === n ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', fontWeight: '700', cursor: 'pointer' }}>{n}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Amount to deposit</label>
                  <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='Enter amount (min $10)' style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Payment Proof</label>
                  <div style={{ display: 'flex' }}>
                    <label style={{ background: '#3a4255', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '8px', padding: '7px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Choose File
                      <input type='file' accept='image/*' style={{ display: 'none' }} onChange={e => { setProofFile(e.target.files[0]); setProofName(e.target.files[0]?.name || 'No file chosen'); }} />
                    </label>
                    <span style={{ background: '#2a3347', border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '8px', padding: '7px 10px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proofName}</span>
                  </div>
                </div>
                <button onClick={handleSubmitDeposit} disabled={submitting} style={{ padding: '8px 20px', background: submitting ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>

              {/* Right QR */}
              <div style={{ width: '140px', flexShrink: 0 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', marginBottom: '4px' }}>{coin} Address:</div>
                <div style={{ color: '#818cf8', fontSize: '7px', wordBreak: 'break-all', marginBottom: '8px', lineHeight: '1.5' }}>{walletAddress}</div>
                <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '10px' }}>
                  <div style={{ color: 'white', fontSize: '7px', fontWeight: '600', textAlign: 'center', marginBottom: '8px' }}>Deposit {coin}</div>
                  <img src='/qrcode.jpg' alt='QR Code' style={{ width: '100%', display: 'block', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '6px' }}>Address</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '6px' }}>{walletAddress.slice(0,10)}...</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '6px' }}>Network</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '6px' }}>{network}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6px', textAlign: 'center', marginBottom: '6px' }}>*Do not deposit assets other than {coin}.</div>
                  <button onClick={handleCopy} style={{ width: '100%', padding: '5px', background: copied ? '#22c55e' : '#6366f1', border: 'none', color: 'white', fontSize: '7px', cursor: 'pointer' }}>
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
              </div>
            </div>

            {/* Deposits Table */}
            <div style={{ marginTop: '20px', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>Recent Deposits</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Amount','Method','Status','Date'].map((h,i) => (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '7px', fontWeight: '700' }}>{h} ↕</span>
                ))}
              </div>
              {loadingDeposits ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</div>
              ) : deposits.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</div>
              ) : (
                deposits.map((d, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <span style={{ color: '#22c55e', fontSize: '7px', fontWeight: '700' }}>+{formatAmount(d.amount || 0, user?.currency)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px' }}>{d.method}</span>
                    <span style={{ color: statusColor(d.status), fontSize: '7px', fontWeight: '600', textTransform: 'capitalize' }}>{d.status}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {deposits.length} of {deposits.length} entries</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8249;</button>
                  <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: 'pointer' }}>&#8250;</button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}