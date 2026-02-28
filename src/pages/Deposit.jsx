import { useState, useEffect } from 'react';
import { getDeposits } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function Deposit() {
  const navigate = useNavigate();
  const [depositMethod, setDepositMethod] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [coin, setCoin] = useState('BTC');
  const [network, setNetwork] = useState('TRC20');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    getDeposits().then(data => { if (Array.isArray(data)) setDeposits(data); });
  }, []);

  const walletAddress = 'TRLEtqXxtP9VV49nzvEuLhpo8S1UVFwGkS';
  const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'SOL'];

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

  const inputStyle = { width: '100%', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#1e2538', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div style={{ background: '#141824', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>PRIMEVEST <span style={{ color: '#6366f1' }}>PRO</span></span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>/ Deposit</span>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '8px', cursor: 'pointer' }}>Back</button>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <button onClick={() => navigate('/dashboard/deposit-funds')} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', padding: '7px 14px', cursor: 'pointer' }}>+ New Deposit</button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Recent Deposits</span>
        </div>

{/* Table */}
<div style={{ background: '#252d3d' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Show</span>
      <select style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 5px', outline: 'none' }}>
        <option>10</option><option>25</option><option>50</option>
      </select>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>entries</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px' }}>Search:</span>
      <input style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '3px 8px', outline: 'none', width: '80px' }} />
    </div>
  </div>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
        {['Amount','Method','Status','Deposit Date'].map((h,i) => (
          <th key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', fontWeight: '700', padding: '8px 10px', borderRight: '1px solid #6366f1', borderBottom: '1px solid #6366f1', textAlign: 'left' }}>{h} ↕</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {deposits.length === 0 ? (
        <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '8px' }}>No data available in table</td></tr>
      ) : deposits.map((d, i) => (
        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <td style={{ padding: '8px 6px', fontSize: '8px', color: '#22c55e' }}>${Number(d.amount).toFixed(2)}</td>
          <td style={{ padding: '8px 6px', fontSize: '8px', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{d.method || 'crypto'}</td>
          <td style={{ padding: '8px 6px', fontSize: '8px' }}>
            <span style={{ background: d.status === 'approved' ? '#22c55e' : d.status === 'rejected' ? '#ef4444' : '#f59e0b', color: 'white', fontSize: '7px', padding: '2px 6px' }}>{d.status}</span>
          </td>
          <td style={{ padding: '8px 6px', fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* New Deposit Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: '#1e2538', border: '1px solid rgba(99,102,241,0.3)', padding: '16px', width: '320px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Deposit Funds:</span>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Form */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Payment Method</label>
                  <select value={depositMethod} onChange={e => setDepositMethod(e.target.value)}
                    style={{ width: '100%', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }}>
                    <option value='crypto'>Crypto</option>
                    <option value='bank'>Bank Transfer</option>
                  </select>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Amount to deposit</label>
                  <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='100.00' style={inputStyle} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Payment Proof</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#252d3d', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 8px' }}>
                    <label style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '7px', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Choose File<input type='file' style={{ display: 'none' }} />
                    </label>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}>No file chosen</span>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '9px', background: '#22c55e', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>
                  Submit Payment
                </button>
              </div>

              {/* QR Panel */}
              <div style={{ width: '120px', flexShrink: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '6px', marginBottom: '3px', textAlign: 'left' }}>USDT Address:</div>
                <div style={{ color: '#6366f1', fontSize: '6px', wordBreak: 'break-all', marginBottom: '6px', textAlign: 'left' }}>{walletAddress}</div>
                <div style={{ color: 'white', fontSize: '7px', fontWeight: '700', marginBottom: '6px' }}>Deposit USDT to PrimeVest Pro</div>
                <img src='/qrcode.jpg' alt='QR' style={{ width: '80px', height: '80px', margin: '0 auto 6px', display: 'block' }} />
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '6px', marginBottom: '3px' }}>Network: TRC20 (Tron)</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '5px', marginBottom: '4px' }}>*Do not deposit assets other than USDT.</div>
                <div style={{ color: '#22c55e', fontSize: '7px', fontWeight: '700' }}>✦ Bitget</div>
              </div>
            </div>
          </div>
</>
      )}
      </div>
    </div>
  );
}
