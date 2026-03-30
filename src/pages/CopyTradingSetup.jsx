import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, DollarSign, Percent, AlertCircle } from 'lucide-react';

const CopyTradingSetup = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const trader = location.state?.trader;
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!trader) {
    navigate('/dashboard/copy-trading');
    return null;
  }

  const handleStartCopy = async () => {
    if (!amount || amount < 10) {
      toast.error('Minimum investment is $10');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/copy-trade', {
        traderId: trader._id,
        traderName: trader.name,
        traderImg: trader.img,
        amount: parseFloat(amount),
        profitShare: trader.profitShare || 20
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Started copying ${trader.name}`);
      navigate('/dashboard/my-copy-trades');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start copy trading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151c27] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/copy-trading')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Traders
        </button>

        <div className="bg-[#1e2538] rounded-2xl border border-gray-700/50 p-6">
          <h1 className="text-2xl font-bold mb-2">Start Copying {trader.name}</h1>
          <p className="text-gray-400 mb-6">Set up your copy trading investment</p>

          {/* Trader Info */}
          <div className="bg-[#0f1420] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{trader.name?.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold">{trader.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">Win Rate: {trader.winRate || 70}%</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-yellow-400">Risk: {trader.risk || 5}/10</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Profit Share</span>
              <span className="font-semibold">{trader.profitShare || 20}%</span>
            </div>
          </div>

          {/* Investment Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="10"
                step="10"
                className="w-full bg-[#0f1420] border border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum $10"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Minimum investment: $10
            </p>
          </div>

          {/* Summary */}
          <div className="bg-[#0f1420] rounded-xl p-4 mb-6">
            <h4 className="font-semibold mb-3">Investment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Investment Amount</span>
                <span>${amount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trader Profit Share</span>
                <span>{trader.profitShare || 20}% of profits</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total to Invest</span>
                  <span className="text-blue-400">${amount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleStartCopy}
              disabled={loading || !amount || amount < 10}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
            >
              {loading ? 'Processing...' : 'Start Copy Trading'}
            </button>
            <button
              onClick={() => navigate('/dashboard/copy-trading')}
              className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyTradingSetup;
