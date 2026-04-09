import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function TraderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [trader, setTrader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTrader();
  }, [id]);

  const fetchTrader = async () => {
    try {
      const response = await fetch(`https://quantyrexs.onrender.com/api/traders/${id}`);
      const data = await response.json();
      setTrader(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCopy = async () => {
    if (!amount || parseFloat(amount) < 10) {
      setError('Minimum investment is $10');
      return;
    }

    setCopying(true);
    setError('');

    try {
      const response = await fetch('https://quantyrexs.onrender.com/api/copy-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          traderId: trader._id,
          traderName: trader.name,
          traderImg: trader.img,
          amount: parseFloat(amount),
          profitShare: trader.profitShare || 20,
          duration: parseInt(duration)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Successfully started copy trading!');
        setTimeout(() => navigate('/dashboard/my-copy-trades'), 2000);
      } else {
        setError(data.message || 'Failed to start copy trading');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0e1628' }}>
        <PageHeader title="Trader Details" />
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>Loading...</div>
      </div>
    );
  }

  if (!trader) {
    return (
      <div style={{ minHeight: '100vh', background: '#0e1628' }}>
        <PageHeader title="Trader Details" />
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>Trader not found</div>
      </div>
    );
  }

  const profitPercent = ((trader.totalProfit || 0) / (trader.totalInvested || 1) * 100).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <PageHeader title="Trader Details" />
      
      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard/copy-trading')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#6366f1', fontSize: '12px', marginBottom: '20px', cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to Traders
        </button>

        {/* Trader Profile Card */}
        <div style={{ background: '#1a2e4a', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <img 
              src={trader.img || `https://ui-avatars.com/api/?name=${trader.name}&background=6366f1&color=fff&size=128`} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #6366f1' }}
            />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{trader.name}</h1>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                <span>{trader.location || 'Professional Trader'}</span>
                <span>⭐ {trader.rating || 4.8}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Win Rate</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>{trader.winRate || 75}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Risk Level</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>{trader.risk || 5}/10</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Profit Share</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#6366f1' }}>{trader.profitShare || 20}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total ROI</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>+{profitPercent}%</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: '#0e1628', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total Trades</span>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>{trader.totalTrades || 0}</span>
            </div>
            <div style={{ background: '#0e1628', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Followers</span>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>{trader.followers || 0}</span>
            </div>
            <div style={{ background: '#0e1628', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Favorite Asset</span>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>{trader.favorite || '—'}</span>
            </div>
            <div style={{ background: '#0e1628', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total Loss</span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#ef4444' }}>${trader.totalLoss || 0}</span>
            </div>
          </div>
        </div>

        {/* Copy Setup Form */}
        <div style={{ background: '#1a2e4a', borderRadius: '16px', padding: '20px', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Copy Trading Setup</h2>
          
          {/* Investment Amount */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>Investment Amount (min $10)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>$</span>
              <input
                type="number"
                min="10"
                step="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 12px 12px 28px', color: 'white', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>Copy Duration</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['30', '60', '90', '180'].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: duration === d ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#0e1628', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Investment</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>${amount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Trader Commission</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{trader.profitShare || 20}% of profits</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Duration</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{duration} Days</span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={12} color="#ef4444" />
              <span style={{ fontSize: '10px', color: '#ef4444' }}>{error}</span>
            </div>
          )}
          
          {success && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={12} color="#22c55e" />
              <span style={{ fontSize: '10px', color: '#22c55e' }}>{success}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard/copy-trading')}
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '12px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleStartCopy}
              disabled={copying}
              style={{ flex: 2, padding: '12px', background: copying ? '#6366f1aa' : '#6366f1', border: 'none', borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: copying ? 'default' : 'pointer' }}
            >
              {copying ? 'Processing...' : 'Confirm & Start Copying'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
