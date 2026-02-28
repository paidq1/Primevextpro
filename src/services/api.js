const BASE_URL = 'https://primevextpro.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Auth
export const registerUser = (data) => fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const loginUser = (data) => fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const getMe = () => fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(r => r.json());

export const changePassword = (data) => fetch(`${BASE_URL}/auth/change-password`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// User
export const getDashboard = () => fetch(`${BASE_URL}/user/dashboard`, { headers: headers() }).then(r => r.json());

export const updateProfile = (formData) => fetch(`${BASE_URL}/user/profile`, { method: 'PUT', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(r => r.json());

// Deposit
export const createDeposit = (formData) => fetch(`${BASE_URL}/deposit`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(r => r.json());

export const getDeposits = () => fetch(`${BASE_URL}/deposit`, { headers: headers() }).then(r => r.json());

// Withdraw
export const createWithdrawal = (data) => fetch(`${BASE_URL}/withdraw`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getWithdrawals = () => fetch(`${BASE_URL}/withdraw`, { headers: headers() }).then(r => r.json());

// Trade
export const createTrade = (data) => fetch(`${BASE_URL}/trade`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getTrades = () => fetch(`${BASE_URL}/trade`, { headers: headers() }).then(r => r.json());

// Packages
export const joinPlan = (data) => fetch(`${BASE_URL}/packages`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getInvestments = () => fetch(`${BASE_URL}/packages`, { headers: headers() }).then(r => r.json());

// KYC
export const submitKyc = (formData) => fetch(`${BASE_URL}/kyc`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(r => r.json());

export const getKycStatus = () => fetch(`${BASE_URL}/kyc`, { headers: headers() }).then(r => r.json());

// Stake
export const createStake = (formData) => fetch(`${BASE_URL}/stake`, { method: "POST", headers: { "Authorization": `Bearer ${getToken()}` }, body: formData }).then(r => r.json());
export const getStakes = () => fetch(`${BASE_URL}/stake`, { headers: headers() }).then(r => r.json());

// Bot
export const createBot = (formData) => fetch(`${BASE_URL}/bot`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData }).then(r => r.json());
export const getBots = () => fetch(`${BASE_URL}/bot`, { headers: headers() }).then(r => r.json());

export const getTradeStats = () => fetch(`${BASE_URL}/trade/stats`, { headers: headers() }).then(r => r.json());
