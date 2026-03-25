const BASE_URL = import.meta.env.VITE_API_URL || 'https://vertextrades.onrender.com/api';

// Global response handler
const handleResponse = async (res) => {
  return res.json();
};

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Auth
export const registerUser = (data) => fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse);

export const resendVerification = (email) => fetch(`${BASE_URL}/auth/resend-verification`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).then(handleResponse);

export const loginUser = (data) => fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse);

export const getMe = () => fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handleResponse);

export const forgotPassword = (email) => fetch(`${BASE_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).then(handleResponse);

export const resetPassword = (token, password) => fetch(`${BASE_URL}/auth/reset-password/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }).then(handleResponse);

export const changePassword = (data) => fetch(`${BASE_URL}/auth/change-password`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

// User
export const getDashboard = () => fetch(`${BASE_URL}/user/dashboard`, { headers: headers() }).then(handleResponse);
export const getTransactions = () => fetch(`${BASE_URL}/user/transactions`, { headers: headers() }).then(handleResponse);

export const updateProfile = (formData) => fetch(`${BASE_URL}/user/profile`, { method: 'PUT', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(handleResponse);

// Deposit
export const createDeposit = (formData) => fetch(`${BASE_URL}/deposit`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(handleResponse);

export const getDeposits = () => fetch(`${BASE_URL}/deposit`, { headers: headers() }).then(handleResponse);

// Withdraw
export const createWithdrawal = (data) => fetch(`${BASE_URL}/withdraw`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const getWithdrawals = () => fetch(`${BASE_URL}/withdraw`, { headers: headers() }).then(handleResponse);

// Trade
export const createTrade = (data) => fetch(`${BASE_URL}/trade`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const getTrades = () => fetch(`${BASE_URL}/trade`, { headers: headers() }).then(handleResponse);

// Packages
export const joinPlan = (data) => fetch(`${BASE_URL}/packages`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const getInvestments = () => fetch(`${BASE_URL}/packages`, { headers: headers() }).then(handleResponse);

// KYC
export const submitKyc = (formData) => fetch(`${BASE_URL}/kyc`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(handleResponse);

export const getKycStatus = () => fetch(`${BASE_URL}/kyc`, { headers: headers() }).then(handleResponse);

// Stake
export const createStake = (formData) => fetch(`${BASE_URL}/stake`, { method: "POST", headers: { "Authorization": `Bearer ${getToken()}` }, body: formData }).then(handleResponse);
export const getStakes = () => fetch(`${BASE_URL}/stake`, { headers: headers() }).then(handleResponse);

// Bot
export const createBot = (formData) => fetch(`${BASE_URL}/bots`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(handleResponse);
export const getBots = () => fetch(`${BASE_URL}/bots`, { headers: headers() }).then(handleResponse);

export const getTradeStats = () => fetch(`${BASE_URL}/trade/stats`, { headers: headers() }).then(handleResponse);
export const getReferrals = () => fetch(`${BASE_URL}/referral`, { headers: headers() }).then(handleResponse);

// Admin Email
export const sendUserEmail = (id, data) => fetch(`${BASE_URL}/admin/users/${id}/email`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);
export const sendBulkEmail = (data) => fetch(`${BASE_URL}/admin/email/bulk`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

// Traders
export const startCopyTrade = (data) => fetch(`${BASE_URL}/copy-trade`, { method: 'POST', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse);
export const getCopyTrades = () => fetch(`${BASE_URL}/copy-trade`, { headers: headers() }).then(handleResponse);
export const stopCopyTrade = (id) => fetch(`${BASE_URL}/copy-trade/${id}/stop`, { method: 'PUT', headers: headers() }).then(handleResponse);
export const getTraders = () => fetch(`${BASE_URL}/traders`).then(handleResponse);
export const addTrader = (data) => fetch(`${BASE_URL}/traders`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: data }).then(handleResponse);
export const updateTrader = (id, data) => fetch(`${BASE_URL}/traders/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: data }).then(handleResponse);
export const deleteTrader = (id) => fetch(`${BASE_URL}/traders/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);
