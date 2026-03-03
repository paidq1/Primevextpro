const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();

const processBotProfits = require('./utils/botCron');

// Run bot profit cron every 30 minutes
const BOT_CRON_INTERVAL = 30 * 60 * 1000; // 30 minutes
setInterval(processBotProfits, BOT_CRON_INTERVAL);
// Also run once on startup after 1 minute delay
setTimeout(processBotProfits, 60 * 1000);

const app = express();
app.set('trust proxy', 1); // Trust Render's proxy

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { message: 'Too many requests, please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, please try again in 15 minutes.' } });
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { message: 'Too many admin requests.' } });

let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 30000, connectTimeoutMS: 30000 });
  cachedDb = db;
  console.log('✅ MongoDB connected');
  return db;
}

// Ensure DB connected before every request
app.use(async (req, res, next) => {
  try { await connectDB(); } catch(e) { return res.status(500).json({ message: 'DB connection failed' }); }
  next();
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/admin', adminLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/trade', require('./routes/trade'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/stake', require('./routes/stake'));
app.use('/api/bots', require('./routes/bot'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'VertexTrade Pro API running' }));
app.get('/', (req, res) => res.json({ name: 'VertexTrade Pro API', status: 'running' }));



connectDB();


setInterval(() => {
  const https = require('https');
  https.get('https://vertextrades.onrender.com/api/health', () => {}).on('error', () => {});
}, 14 * 60 * 1000);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
