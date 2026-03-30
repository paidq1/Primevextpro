import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Copy, TrendingUp, TrendingDown, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';

const CopyTrading = () => {
  const { user, token } = useAuth();
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    fetchCopyTrades();
    fetchTraders();
  }, []);

  const fetchCopyTrades = async () => {
    try {
      const response = await axios.get('/api/copy-trade', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCopyTrades(response.data);
    } catch (error) {
      console.error('Error fetching copy trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTraders = async () => {
    try {
      const response = await axios.get('/api/traders');
      setTraders(response.data);
    } catch (error) {
      console.error('Error fetching traders:', error);
    }
  };

  const handleStopCopy = async (tradeId) => {
    if (!window.confirm('Are you sure you want to stop copying this trader?')) return;
    
    try {
      await axios.put(`/api/copy-trade/${tradeId}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Copy trading stopped successfully');
      fetchCopyTrades();
    } catch (error) {
      toast.error('Failed to stop copy trading');
    }
  };

  const handleStartCopy = async () => {
    if (!selectedTrader || !investAmount || investAmount < 10) {
      toast.error('Minimum investment is $10');
      return;
    }

    try {
      await axios.post('/api/copy-trade', {
        traderId: selectedTrader._id,
        traderName: selectedTrader.name,
        traderImg: selectedTrader.img,
        amount: parseFloat(investAmount),
        profitShare: selectedTrader.profitShare || 20
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Started copying ${selectedTrader.name}`);
      setShowModal(false);
      setInvestAmount('');
      fetchCopyTrades();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start copy trading');
    }
  };

  // Calculate total stats
  const totalInvested = copyTrades.reduce((sum, trade) => sum + trade.amount, 0);
  const totalEarned = copyTrades.reduce((sum, trade) => sum + (trade.totalEarned || 0), 0);
  const totalProfitPercent = totalInvested > 0 ? (totalEarned / totalInvested * 100).toFixed(2) : 0;
  const activeCopies = copyTrades.filter(t => t.status === 'active').length;

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper function to format time
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Copy Trades</h1>
          <p className="text-gray-600 mt-1">Copy professional traders and earn profits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Copy className="w-5 h-5" />
          Copy Another Trader
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Copies</p>
              <p className="text-2xl font-bold text-gray-900">{activeCopies}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Copy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earned</p>
              <p className={`text-2xl font-bold ${totalEarned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalEarned.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totalEarned >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalEarned >= 0 ? (
                <TrendingUp className={`w-6 h-6 ${totalEarned >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              ) : (
                <TrendingDown className={`w-6 h-6 ${totalEarned >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Return</p>
              <p className={`text-2xl font-bold ${totalProfitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitPercent}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Copy Trades List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Copy Trades</h2>
        </div>
        
        {copyTrades.length === 0 ? (
          <div className="text-center py-12">
            <Copy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No copy trades yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Start copying a trader →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {copyTrades.map((trade) => {
              const profitPercent = trade.amount > 0 ? (trade.totalEarned / trade.amount * 100).toFixed(2) : 0;
              const isProfit = trade.totalEarned >= 0;
              
              return (
                <div key={trade._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Trader Info */}
                    <div className="flex items-center gap-4">
                      {trade.traderImg ? (
                        <img src={trade.traderImg} alt={trade.traderName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{trade.traderName?.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{trade.traderName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            trade.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {trade.status === 'active' ? 'Active' : 'Stopped'}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Percent className="w-4 h-4" />
                            Profit Share: {trade.profitShare || 20}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Info */}
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Invested</p>
                        <p className="font-semibold text-gray-900">${trade.amount.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                        <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          ${(trade.totalEarned || 0).toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Return</p>
                        <div className="flex items-center gap-1">
                          {isProfit ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {profitPercent}%
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Profit</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {formatDate(trade.lastProfitAt)}
                            {trade.lastProfitAt && ` ${formatTime(trade.lastProfitAt)}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {trade.status === 'active' && (
                      <button
                        onClick={() => handleStopCopy(trade._id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                      >
                        Stop Copying
                      </button>
                    )}
                  </div>

                  {/* Progress Bar (Optional) */}
                  {trade.totalEarned > 0 && trade.amount > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Profit Progress</span>
                        <span>{profitPercent}% of investment</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(Math.abs(profitPercent), 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Start Copy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Start Copy Trading</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Trader
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedTrader(traders.find(t => t._id === e.target.value))}
                value={selectedTrader?._id || ''}
              >
                <option value="">Choose a trader...</option>
                {traders.map(trader => (
                  <option key={trader._id} value={trader._id}>
                    {trader.name} - Win Rate: {trader.winRate || 70}% - Risk: {trader.risk || 5}/10
                  </option>
                ))}
              </select>
            </div>

            {selectedTrader && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Win Rate:</span>
                  <span className="font-semibold text-green-600">{selectedTrader.winRate || 70}%</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className="font-semibold">{selectedTrader.risk || 5}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profit Share:</span>
                  <span className="font-semibold">{selectedTrader.profitShare || 20}%</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount ($)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Minimum $10"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum investment: $10</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartCopy}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Copying
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTrader(null);
                  setInvestAmount('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTrading;
