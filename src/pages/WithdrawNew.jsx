import { useState } from 'react';
import { createWithdrawal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const methods = [
  { id: 'crypto', label: 'Crypto (Recommended)', desc: 'Withdraw your funds to your cryptocurrency wallet.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' strokeWidth='2'><circle cx='12' cy='12' r='10'/><path d='M9.5 9a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-5 0V9z'/><path d='M12 6v2M12 16v2M9.5 14a2.5 2.5 0 0 0 5 0v-1a2.5 2.5 0 0 0-5 0v1z'/></svg> },
  { id: 'bank', label: 'Bank Transfer', desc: 'Transfer your funds directly to your bank account.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2'><rect x='3' y='10' width='18' height='11' rx='1'/><path d='M3 10l9-7 9 7'/><line x1='8' y1='14' x2='8' y2='17'/><line x1='12' y1='14' x2='12' y2='17'/><line x1='16' y1='14' x2='16' y2='17'/></svg> },
  { id: 'cashapp', label: 'Cashapp', desc: 'Withdraw your funds to your Cashapp account.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'/><path d='M14.5 8.5c-.5-.8-1.4-1.3-2.5-1.3-1.7 0-3 1.1-3 2.5 0 1.3.9 2 2.3 2.5 1.6.5 2.2 1 2.2 1.8 0 1-.9 1.7-2.2 1.7-1.1 0-2-.5-2.5-1.4M12 6v1.5M12 16.5V18'/></svg> },
  { id: 'paypal', label: 'Paypal', desc: 'Withdraw your funds via Paypal Account.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#3b82f6' strokeWidth='2'><path d='M7 11l1-7h6.5c2.5 0 4 1.5 3.5 4-1 4-4 4-6 4H10l-1 6H6l1-7z'/><path d='M10 11l-1 6'/></svg> },
  { id: 'western_union', label: 'Western Union', desc: 'Withdraw your funds via Western Union.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' strokeWidth='2'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
  { id: 'moneygram', label: 'Money Gram', desc: 'Withdraw your funds via Money Gram service.',
    icon: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M2 10h20'/><path d='M6 15h4M14 15h4'/></svg> },
];

export default function WithdrawNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = select method, 2 = fill form
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Form fields
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [coin, setCoin] = useState('BTC');
  const [network, setNetwork] = useState('TRC20');
  const [accountEmail, setAccountEmail] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = { width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  const handleProceed = () => {
    if (!selectedMethod) { setError('Please select a withdrawal method.'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (Number(amount) < 100) { setError('Minimum withdrawal amount is $100.'); return; }

    if (selectedMethod === 'crypto') {
      if (!coin) { setError('Please select a coin.'); return; }
      if (!network) { setError('Please select a network.'); return; }
      if (!walletAddress.trim()) { setError('Please enter your wallet address.'); return; }
      if (walletAddress.trim().length < 20) { setError('Please enter a valid wallet address.'); return; }
    }

    if (selectedMethod === 'cashapp') {
      if (!accountEmail.trim()) { setError('Please enter your Cashapp $Cashtag.'); return; }
      if (!accountEmail.startsWith('$')) { setError('Cashapp $Cashtag must start with $'); return; }
    }

    if (selectedMethod === 'paypal') {
      if (!accountEmail.trim()) { setError('Please enter your Paypal email.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail)) { setError('Please enter a valid Paypal email address.'); return; }
    }

    if (selectedMethod === 'western_union' || selectedMethod === 'moneygram') {
      if (!receiverName.trim()) { setError("Please enter receiver's full name."); return; }
      if (receiverName.trim().length < 3) { setError("Receiver's name must be at least 3 characters."); return; }
      if (!receiverAddress.trim()) { setError("Please enter receiver's address."); return; }
      if (receiverAddress.trim().length < 10) { setError("Please enter a complete receiver's address."); return; }
      if (selectedMethod === 'moneygram' && !receiverPhone.trim()) { setError("Please enter receiver's phone number."); return; }
      if (selectedMethod === 'moneygram' && receiverPhone.trim().length < 7) { setError("Please enter a valid phone number."); return; }
    }

    if (selectedMethod === 'bank') {
      if (!bankName.trim()) { setError('Please enter your bank name.'); return; }
      if (!accountNumber.trim()) { setError('Please enter your account number.'); return; }
      if (!/^\d{6,20}$/.test(accountNumber.trim())) { setError('Account number must be 6-20 digits.'); return; }
      if (!routingNumber.trim()) { setError('Please enter your routing/IFSC code.'); return; }
      if (routingNumber.trim().length < 6) { setError('Please enter a valid routing/IFSC code.'); return; }
      if (!accountName.trim()) { setError('Please enter the account holder name.'); return; }
    }

    setError('');
    setShowConfirm(true);
  };

  const methodLabel = methods.find(m => m.id === selectedMethod)?.label || '';

  const renderForm = () => (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><polyline points='15 18 9 12 15 6'/></svg> Back
        </button>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Method: <span style={{ color: '#6366f1' }}>{methodLabel}</span></span>
      </div>

      {/* Amount always shown */}
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Amount (USD)</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='0.00' style={inputStyle} />
      </div>

      {/* Crypto fields */}
      {selectedMethod === 'crypto' && <>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Coin</label>
          <select value={coin} onChange={e => setCoin(e.target.value)} style={{ ...inputStyle }}>
            {['BTC','ETH','USDT','BNB','XRP','SOL'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Network</label>
          <select value={network} onChange={e => setNetwork(e.target.value)} style={{ ...inputStyle }}>
            <option>TRC20</option><option>ERC20</option><option>BEP20</option>
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Wallet Address</label>
          <input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder='Enter wallet address' style={inputStyle} />
        </div>
      </>}

      {/* Cashapp / Paypal */}
      {(selectedMethod === 'cashapp' || selectedMethod === 'paypal') && <>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>{selectedMethod === 'cashapp' ? 'Cashapp $Cashtag' : 'Paypal Email'}</label>
          <input value={accountEmail} onChange={e => setAccountEmail(e.target.value)} placeholder={selectedMethod === 'cashapp' ? '$cashtag' : 'email@example.com'} style={inputStyle} />
        </div>
      </>}

      {/* Western Union / Money Gram */}
      {(selectedMethod === 'western_union' || selectedMethod === 'moneygram') && <>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Receiver's Full Name</label>
          <input value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder='Full name' style={inputStyle} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Receiver's Address</label>
          <textarea value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)} placeholder='Full address' rows={3} style={{ ...inputStyle, resize: 'none' }} />
        </div>
        {selectedMethod === 'moneygram' && <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Receiver's Phone</label>
          <input value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} placeholder='+1 000 000 0000' style={inputStyle} />
        </div>}
      </>}

      {/* Bank Transfer */}
      {selectedMethod === 'bank' && <>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Bank Name</label>
          <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder='e.g. Chase Bank, Barclays' style={inputStyle} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Account Holder Name</label>
          <input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder='Full name as on bank account' style={inputStyle} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Account Number</label>
          <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder='Enter account number (digits only)' style={inputStyle} type='tel' />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Routing Number / IFSC Code</label>
          <input value={routingNumber} onChange={e => setRoutingNumber(e.target.value)} placeholder='e.g. 021000021 or HDFC0001234' style={inputStyle} />
        </div>
      </>}

      <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>
      <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 28px', background: submitting ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
        {submitting ? 'Processing...' : 'REQUEST WITHDRAWAL'}
      </button>
    </div>
  );

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
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ New Withdrawal</span>
        <button onClick={() => navigate('/dashboard/withdraw')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      {/* KYC Warning */}
      {user && user.kycStatus !== 'approved' && (
        <div style={{ margin: '12px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <div>
            <div style={{ color: '#f59e0b', fontSize: '9px', fontWeight: '700' }}>KYC Verification Required</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginTop: '2px' }}>You must complete KYC verification before withdrawing. <span onClick={() => navigate('/dashboard/kyc')} style={{ color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}>Verify now →</span></div>
          </div>
        </div>
      )}

      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>New Withdrawal</span>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginTop: '3px' }}>Transfer Limit: <span style={{ color: '#ef4444', fontWeight: '700' }}>$100</span></div>
        </div>

        {step === 1 && <>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', marginBottom: '12px' }}>Select a withdrawal method to continue:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {methods.map(method => (
              <div key={method.id} onClick={() => setSelectedMethod(method.id)}
                style={{ background: selectedMethod === method.id ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedMethod === method.id ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, padding: '14px 12px', cursor: 'pointer', borderRadius: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                  {method.icon}
                  <span style={{ color: 'white', fontSize: '9px', fontWeight: '700' }}>{method.label}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', marginBottom: '12px', lineHeight: '1.5' }}>{method.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${selectedMethod === method.id ? '#6366f1' : 'rgba(255,255,255,0.25)'}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedMethod === method.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }}/>}
                  </div>
                  <span style={{ color: selectedMethod === method.id ? '#6366f1' : 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Select {method.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px', minHeight: '14px' }}>{error}</div>
          <button onClick={handleProceed} disabled={submitting} style={{ padding: '10px 28px', background: submitting ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
            Continue
          </button>
        </>}

     {step === 2 && renderForm()}
      </div>

      {/* Confirm Popup */}
      {showConfirm && (
        <>
          <div onClick={() => setShowConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Confirm Withdrawal</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '6px' }}>Amount: <strong>${amount}</strong></div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px' }}>Method: <strong>{methodLabel}</strong></div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '8px 20px', background: '#f1f5f9', border: 'none', color: '#555', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Cancel</button>
              <button onClick={() => {
                setShowConfirm(false);
                const payload = {
                  amount: Number(amount),
                  method: selectedMethod,
                  ...(selectedMethod === 'crypto' && { coin, network, walletAddress }),
                  ...(selectedMethod === 'cashapp' && { accountEmail }),
                  ...(selectedMethod === 'paypal' && { accountEmail }),
                  ...((selectedMethod === 'western_union' || selectedMethod === 'moneygram') && { receiverName, receiverAddress, receiverPhone }),
                  ...(selectedMethod === 'bank' && { bankName, accountName, accountNumber, routingNumber }),
                };
                navigate('/dashboard/withdraw/verify-code', { state: payload });
              }} style={{ padding: '8px 20px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Withdrawal Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Withdrawal request sent! Check history for details.</div>
            <button onClick={() => { setShowSuccess(false); navigate('/dashboard/withdraw'); }} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
    </div>
  );
}
