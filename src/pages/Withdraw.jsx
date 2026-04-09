import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { createWithdrawal, getWithdrawals } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';

const methods = [
  { id: 'crypto', label: 'Crypto (Recommended)', desc: 'Withdraw your funds to your cryptocurrency wallet.', select: 'Select Crypto', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'bank', label: 'Bank Transfer', desc: 'Transfer your funds directly to your bank account.', select: 'Select Bank Transfer', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'cashapp', label: 'Cashapp', desc: 'Withdraw your funds to your Cashapp account.', select: 'Select Cashapp', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'paypal', label: 'Paypal', desc: 'Withdraw your funds via Paypal Account.', select: 'Select Paypal', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'westernunion', label: 'Western Union', desc: 'Withdraw your funds via Western Union.', select: 'Select Western Union', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'moneygram', label: 'Money Gram', desc: 'Withdraw your funds via Money Gram service.', select: 'Select Money Gram', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

export default function Withdraw() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [selected, setSelected] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(10);
  const perPage = show;
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [coin, setCoin] = useState('USDT');
  const [network, setNetwork] = useState('TRC20');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [withdrawalCode, setWithdrawalCode] = useState('');

  const inputStyle = { width: '100%', background: '#2d3748', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '10px 12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '9px', display: 'block', marginBottom: '6px', fontWeight: '600' };

  useEffect(() => {
    getWithdrawals().then(data => {
      if (Array.isArray(data)) setWithdrawals(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const validate = () => {
    if (!amount || isNaN(amount) || Number(amount) < 100) { setError('Minimum withdrawal is $100.00'); return false; }
    if (selected === 'crypto' && (!address || address.length < 20)) { setError('Please enter a valid wallet address.'); return false; }
    if (selected === 'bank') {
      if (!bankName) { setError('Please enter your bank name.'); return false; }
      if (!accountName) { setError('Please enter your account name.'); return false; }
      if (!accountNumber || !/^\d+$/.test(accountNumber)) { setError('Please enter a valid account number.'); return false; }
      if (!swiftCode) { setError('Please enter your SWIFT/BIC code.'); return false; }
    }
    if (selected === 'cashapp' && (!address || address.length < 3)) { setError('Please enter a valid CashApp account.'); return false; }
    if (selected === 'paypal' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setError('Please enter a valid PayPal email.'); return false; }
    if (['westernunion','moneygram'].includes(selected)) {
      if (!receiverName) { setError("Please enter receiver's name."); return false; }
      if (!receiverAddress) { setError("Please enter receiver's address."); return false; }
    }
    setError(''); return true;
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    const body = {
      amount: parseFloat(amount),
      method: selected,
      ...(selected === 'crypto' && { coin, network, walletAddress: address }),
      ...((selected === 'cashapp' || selected === 'paypal') && { accountEmail: address }),
      ...((selected === 'westernunion' || selected === 'moneygram') && { receiverName, receiverAddress, receiverPhone }),
      ...(selected === 'bank' && { bankName, accountName, accountNumber, routingNumber: swiftCode }),
    };
    navigate('/dashboard/withdraw/verify-code', { state: body });
  };

  const statusColor = s => s === 'approved' ? '#22c55e' : s === 'pending' ? '#f59e0b' : '#ef4444';
  const totalPages = Math.ceil(withdrawals.length / perPage);
  const filtered = withdrawals.filter(w =>
    w.method?.toLowerCase().includes(search.toLowerCase()) ||
    w.status?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, show);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Method Selector Modal */}
      {showMethodSelector && !showForm && (
        <>
          <div onClick={() => setShowMethodSelector(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: '#0e1628', padding: '20px', width: '340px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Transfer Limit: </span>
                <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '700' }}>$100</span>
              </div>
              <button onClick={() => setShowMethodSelector(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {methods.map(m => (
                <div key={m.id} onClick={() => { setSelected(m.id); setShowForm(true); setError(''); }} style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                    <svg width="13" height="13" fill="none" stroke="#818cf8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={m.icon} />
                    </svg>
                    <span style={{ color: 'white', fontSize: '8px', fontWeight: '700' }}>{m.label}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', lineHeight: '1.5', marginBottom: '8px' }}>{m.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px' }}>{m.select}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Withdrawal Form Modal */}
      {showForm && (
        <>
          <div onClick={() => { setShowForm(false); setShowMethodSelector(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: '#0e1628', padding: '20px', width: '320px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => { setShowForm(false); }} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '9px', cursor: 'pointer' }}>← Back</button>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>{methods.find(m => m.id === selected)?.label}</span>
              </div>
              <button onClick={() => { setShowForm(false); setShowMethodSelector(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            {selected === 'crypto' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Select Coin</label>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {['BTC','ETH','USDT','BNB','XRP','SOL'].map(c => <button key={c} onClick={() => setCoin(c)} style={{ padding: '4px 8px', background: coin === c ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', fontWeight: '700', cursor: 'pointer' }}>{c}</button>)}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Select Network</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {['TRC20','ERC20','BEP20'].map(n => <button key={n} onClick={() => setNetwork(n)} style={{ padding: '4px 8px', background: network === n ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: '7px', fontWeight: '700', cursor: 'pointer' }}>{n}</button>)}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Wallet Address ({network})</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder={'Enter your ' + coin + ' wallet address'} style={inputStyle} />
                </div>
              </>
            )}
            {selected === 'bank' && (
              <>
                {[['Bank Name', bankName, setBankName, 'Enter your bank name'],['Account Name', accountName, setAccountName, 'Enter account name'],['Account Number', accountNumber, setAccountNumber, 'Digits only'],['SWIFT / BIC Code', swiftCode, setSwiftCode, 'e.g. BOFAUS3N']].map(([lbl, val, set, ph]) => (
                  <div key={lbl} style={{ marginBottom: '10px' }}>
                    <label style={labelStyle}>{lbl}</label>
                    <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={inputStyle} />
                  </div>
                ))}
              </>
            )}
            {['cashapp','paypal'].includes(selected) && (
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>{selected === 'cashapp' ? 'CashApp $Cashtag or Email' : 'PayPal Email'}</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder={selected === 'cashapp' ? 'Enter $cashtag or email' : 'Enter PayPal email'} style={inputStyle} />
              </div>
            )}
            {['westernunion','moneygram'].includes(selected) && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <label style={labelStyle}>Receiver's Full Name</label>
                  <input value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="Full name" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={labelStyle}>Receiver's Address</label>
                  <textarea value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)} placeholder="Street, city, country" style={{...inputStyle, height: '60px', resize: 'none'}} />
                </div>
                {selected === 'moneygram' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={labelStyle}>Receiver's Phone</label>
                    <input value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} placeholder="Phone number" style={inputStyle} />
                  </div>
                )}
              </>
            )}

            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>Amount (USD)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='Enter amount' style={inputStyle} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px', marginBottom: '8px' }}>Available balance: {formatAmount(user?.balance || 0, user?.currency)}</div>
            <div style={{ background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', marginBottom: '12px' }}>
              {[['Withdrawal Fee','1%'],['Minimum','$100.00'],['Processing','1-3 Business Days']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{k}</span>
                  <span style={{ color: 'white', fontSize: '8px', fontWeight: '600' }}>{v}</span>
                </div>
              ))}
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '8px', marginBottom: '8px' }}>{error}</div>}
            <button onClick={() => { if (validate()) setShowConfirm(true); }} style={{ width: '100%', padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
              REQUEST WITHDRAWAL
            </button>
          </div>
        </>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <>
          <div onClick={() => setShowConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='22' height='22' fill='none' stroke='#6366f1' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 10l7-7m0 0l7 7m-7-7v18'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Confirm Withdrawal</div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '4px' }}>Amount: <strong>${amount}</strong></div>
            <div style={{ color: '#555', fontSize: '9px', marginBottom: '20px' }}>Method: <strong>{methods.find(m => m.id === selected)?.label}</strong></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', color: '#111', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='22' height='22' fill='none' stroke='#22c55e' viewBox='0 0 24 24' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Withdrawal Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your withdrawal request has been submitted successfully and is being processed.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>Okay</button>
          </div>
        </>
      )}

      {/* Header */}
      <PageHeader title="Withdraw" />

      

      <div style={{ padding: '16px' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => navigate('/dashboard/withdraw/new')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '8px 14px', cursor: 'pointer' }}>
            + New Withdrawal
          </button>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>Recent Withdrawals</span>
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
              <input value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '90px' }} />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Amount','Method','Status','Date Created'].map((h,i) => (
                  <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 10px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h} ↕</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan='4' style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan='4' style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</td></tr>
              ) : filtered.map((w, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px 10px', color: '#ec4899', fontSize: '8px', fontWeight: '700', borderRight: '1px solid rgba(255,255,255,0.06)' }}>-${w.amount?.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)', fontSize: '8px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>{w.method}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ background: statusColor(w.status) + '20', color: statusColor(w.status), fontSize: '7px', padding: '2px 6px', display: 'inline-block', textTransform: 'capitalize' }}>{w.status}</span>
                  </td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>{new Date(w.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>Showing {filtered.length} of {withdrawals.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page === 1 ? 'default' : 'pointer' }}>«</button>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page === 1 ? 'default' : 'pointer' }}>‹</button>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px' }}>Page {page} of {totalPages || 1}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '10px', padding: '2px 8px', cursor: page >= totalPages ? 'default' : 'pointer' }}>›</button>
              <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '8px', padding: '2px 6px', cursor: page >= totalPages ? 'default' : 'pointer' }}>»</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}