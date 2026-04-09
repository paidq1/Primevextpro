import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { submitKyc, getKycStatus } from '../services/api';

export default function KYC() {
  const navigate = useNavigate();
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idFront, setIdFront] = useState(null);
  const [idFrontName, setIdFrontName] = useState('No file chosen');
  const [idBack, setIdBack] = useState(null);
  const [idBackName, setIdBackName] = useState('No file chosen');
  const [selfie, setSelfie] = useState(null);
  const [selfieName, setSelfieName] = useState('No file chosen');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = { width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '8px', display: 'block', marginBottom: '6px' };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getKycStatus();
      if (data && data.kycStatus) setKycStatus(data.kycStatus);
    } catch (err) {
      console.error('Failed to load KYC status:', err);
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ label, fileName, onChange }) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px' }}>
        <label style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '8px', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Choose File<input type='file' accept='image/*,.pdf' style={{ display: 'none' }} onChange={onChange} />
        </label>
        <span style={{ color: fileName !== 'No file chosen' ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: '8px', overflow: 'visible', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{fileName}</span>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!idType) { setError('Please select an ID type.'); return; }
    if (!idNumber.trim()) { setError('Please enter your ID number.'); return; }
    if (!idFront) { setError('Please upload the front of your ID.'); setTimeout(() => setError(''), 3000); return; }
    if (!idBack) { setError('Please upload the back of your ID.'); setTimeout(() => setError(''), 3000); return; }
    if (!selfie) { setError('Please upload a selfie with your ID.'); setTimeout(() => setError(''), 3000); return; }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('idType', idType);
      formData.append('idNumber', idNumber);
      formData.append('idFront', idFront);
      formData.append('idBack', idBack);
      formData.append('selfie', selfie);

      const res = await submitKyc(formData);
      if (res.message && !res.error) {
        setShowSuccess(true);
        setKycStatus('submitted');
      } else {
        setError(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = { pending: '#6366f1', submitted: '#f59e0b', approved: '#22c55e', rejected: '#ef4444' };
  const statusIcon = {
    pending: <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#6366f1' strokeWidth='2'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>,
    submitted: <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' strokeWidth='2'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>,
    approved: <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#22c55e' strokeWidth='2.5'><polyline points='20 6 9 17 4 12'/></svg>,
    rejected: <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>,
  };
  const statusMessage = {
    pending: 'You have not submitted your KYC yet.',
    submitted: 'Your documents are under review. This may take 24-48 hours.',
    approved: 'Your identity has been verified successfully.',
    rejected: 'Your verification was rejected. Please resubmit with valid documents.',
  };
  const statusLabel = {
    pending: 'Not Submitted',
    submitted: 'Verification Pending',
    approved: 'Verification Approved',
    rejected: 'Verification Rejected',
  };

  const isLocked = kycStatus === 'submitted' || kycStatus === 'approved';

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>

      {/* Header */}
      <PageHeader title="KYC" />

      

      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Identity Verification (KYC)</span>
        </div>

        {/* Status Banner */}
        {loading ? (
          <div style={{ background: '#1a2e4a', padding: '12px 16px', marginBottom: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>Loading status...</div>
        ) : kycStatus && (
          <div style={{ background: '#1a2e4a', border: `1px solid ${statusColor[kycStatus]}40`, padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${statusColor[kycStatus]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {statusIcon[kycStatus]}
            </div>
            <div>
              <div style={{ color: statusColor[kycStatus], fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>{statusLabel[kycStatus]}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>{statusMessage[kycStatus]}</div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '20px' }}>
          {['ID Type & Number', 'Upload Documents', 'Selfie with ID'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{i + 1}</div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7px', textAlign: 'center' }}>{step}</span>
              </div>
              {i < 2 && <div style={{ height: '1px', width: '20px', background: 'rgba(255,255,255,0.15)', marginBottom: '14px' }} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>

          {isLocked && (
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '10px 12px', marginBottom: '14px', color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>
              {kycStatus === 'approved' ? 'Your KYC is approved. No further action needed.' : 'Your KYC is under review. You cannot resubmit at this time.'}
            </div>
          )}

          <div style={{ opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>ID Type <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={idType} onChange={e => setIdType(e.target.value)}
                style={{ width: '100%', background: '#1a2e4a', border: '1px solid rgba(255,255,255,0.08)', color: idType ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '9px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }}>
                <option value=''>Select ID Type</option>
                <option value='passport'>International Passport</option>
                <option value='national_id'>National ID Card</option>
                <option value='drivers_license'>Driver's License</option>
                <option value='residence_permit'>Residence Permit</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>ID Number <span style={{ color: '#ef4444' }}>*</span></label>
              <input value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder='Enter your ID number' style={inputStyle} />
            </div>

            <FileInput label='ID Front Side' fileName={idFrontName} onChange={e => { if(e.target.files[0]){ setIdFront(e.target.files[0]); setIdFrontName(e.target.files[0].name); }}} />
            <FileInput label='ID Back Side' fileName={idBackName} onChange={e => { if(e.target.files[0]){ setIdBack(e.target.files[0]); setIdBackName(e.target.files[0].name); }}} />
            <FileInput label='Selfie Holding ID' fileName={selfieName} onChange={e => { if(e.target.files[0]){ setSelfie(e.target.files[0]); setSelfieName(e.target.files[0].name); }}} />

            {/* Tips */}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '10px 12px', marginBottom: '14px' }}>
              <div style={{ color: '#6366f1', fontSize: '8px', fontWeight: '700', marginBottom: '6px' }}>Tips for successful verification:</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '7px', lineHeight: '1.8' }}>
                • Ensure all documents are clear and readable<br/>
                • ID must be valid and not expired<br/>
                • Selfie must clearly show your face and ID together<br/>
                • Accepted formats: JPG, PNG, PDF
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 10px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span style={{ color: '#ef4444', fontSize: '8px' }}>{error}</span>
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ padding: '10px 28px', background: submitting ? '#374151' : '#6366f1', border: 'none', color: 'white', fontSize: '9px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <>
          <div onClick={() => setShowSuccess(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 151, background: 'white', padding: '36px 28px', width: '320px', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' strokeWidth='2'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>
            </div>
            <div style={{ color: '#111', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>KYC Submitted!</div>
            <div style={{ color: '#555', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>Your KYC documents have been submitted successfully. Verification takes 24-48 hours.</div>
            <button onClick={() => setShowSuccess(false)} style={{ padding: '8px 28px', background: '#6366f1', border: 'none', color: 'white', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '3px' }}>Okay</button>
          </div>
        </>
      )}
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.2)", fontSize: "7px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px" }}>2020-2026 &copy; Quantyrex Markets</div>

    </div>
  );
}