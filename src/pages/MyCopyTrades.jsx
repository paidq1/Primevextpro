import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Copy, TrendingUp, TrendingDown, DollarSign, Calendar, Percent, User, X } from 'lucide-react';

const MyCopyTrades = () => {
  const { token } = useAuth();
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    fetchCopyTrades();
  }, []);

  const fetchCopyTrades = async () => {
    try {
      const response = await axios.get('/api/copy-trade', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const trades = Array.isArray(response.data) ? response.data : [];
      setCopyTrades(trades);
    } catch (error) {
      console.error('Error fetching copy trades:', error);
      setCopyTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCopy = async () => {
    if (!selectedTrade) return;
    
    try {
      await axios.put(`/api/copy-trade/${selectedTrade._id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Stopped copying ${selectedTrade.traderName}`);
      setShowStopModal(false);
      setSelectedTrade(null);
      fetchCopyTrades();
    } catch (error) {
      toast.error('Failed to stop copy trading');
    }
  };

  // Calculate total stats
  const totalInvested = Array.isArray(copyTrades) ? copyTrades.reduce((sum, trade) => sum + (trade.amount || 0), 0) : 0;
  const totalEarned = Array.isArray(copyTrades) ? copyTrades.reduce((sum, trade) => sum + (trade.totalEarned || 0), 0) : 0;
  const totalProfitPercent = totalInvested > 0 ? (totalEarned / totalInvested * 100).toFixed(2) : 0;
  const activeCopies = Array.isArray(copyTrades) ? copyTrades.filter(t => t.status === 'active').length : 0;

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151c27] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Copy Trades</h1>
          <p className="text-gray-400">Track your copy trading performance and earnings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1e2538] rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Active Copies</p>
              <Copy className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">{activeCopies}</p>
          </div>

          <div className="bg-[#1e2538] rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold">${totalInvested.toFixed(2)}</p>
          </div>

          <div className="bg-[#1e2538] rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Earned</p>
              {totalEarned >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className={`text-3xl font-bold ${totalEarned >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalEarned.toFixed(2)}
            </p>
          </div>

          <div className="bg-[#1e2538] rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Return</p>
              <Percent className="w-5 h-5 text-purple-400" />
            </div>
            <p className={`text-3xl font-bold ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfitPercent}%
            </p>
          </div>
        </div>

        {/* Copy Trades List */}
        <div className="bg-[#1e2538] rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold">Your Copy Trades</h2>
          </div>
          
          {!Array.isArray(copyTrades) || copyTrades.length === 0 ? (
            <div className="text-center py-16">
              <Copy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active copy trades</p>
              <button
                onClick={() => window.location.href = '/traders'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Browse Traders
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {copyTrades.map((trade) => {
                const profitPercent = trade.amount > 0 ? ((trade.totalEarned || 0) / trade.amount * 100).toFixed(2) : 0;
                const isProfit = (trade.totalEarned || 0) >= 0;
                
                return (
                  <div key={trade._id} className="p-6 hover:bg-[#252e44] transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Trader Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{trade.traderName?.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trade.traderName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trade.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {trade.status === 'active' ? 'Active' : 'Stopped'}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              Profit Share: {trade.profitShare || 20}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Invested</p>
                          <p className="font-semibold">${(trade.amount || 0).toFixed(2)}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Total Earned</p>
                          <p className={`font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            ${(trade.totalEarned || 0).toFixed(2)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Return</p>
                          <div className="flex items-center gap-1">
                            {isProfit ? (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                            <p className={`font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                              {profitPercent}%
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Last Profit</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-300">
                              {formatDate(trade.lastProfitAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {trade.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedTrade(trade);
                            setShowStopModal(true);
                          }}
                          className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition font-medium text-sm"
                        >
                          Stop Copying
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(trade.totalEarned || 0) > 0 && trade.amount > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Profit Progress</span>
                          <span>{profitPercent}% of investment</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
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
      </div>

      {/* Stop Copy Modal */}
      {showStopModal && selectedTrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2538] rounded-2xl max-w-md w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Stop Copy Trading</h2>
              <button
                onClick={() => {
                  setShowStopModal(false);
                  setSelectedTrade(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to stop copying <span className="font-semibold text-white">{selectedTrade.traderName}</span>?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Total earned so far: <span className={selectedTrade.totalEarned >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${(selectedTrade.totalEarned || 0).toFixed(2)}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStopCopy}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
              >
                Yes, Stop Copying
              </button>
              <button
                onClick={() => {
                  setShowStopModal(false);
                  setSelectedTrade(null);
                }}
                className="flex-1 border border-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition"
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

export default MyCopyTrades;
