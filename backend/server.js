const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/trade', require('./routes/trade'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/stake', require('./routes/stake'));
app.use('/api/bot', require('./routes/bot'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'PrimeVest Pro API running' }));

app.get('/', (req, res) => res.json({ name: 'PrimeVest Pro API', status: 'running' }));

// MongoDB connection with caching for serverless
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
}

// Connect and export for serverless
connectDB().catch(err => console.error('MongoDB error:', err));

// Keep alive for Render (ignored on Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  setInterval(() => {
    const https = require('https');
    https.get('https://primevextpro.onrender.com/api/health', () => {}).on('error', () => {});
  }, 14 * 60 * 1000);
}

module.exports = app;

// Start server if not serverless
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
