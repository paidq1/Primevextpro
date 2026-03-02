const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// CORS - restrict to your domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://vertextradsepro.vercel.app',
  'https://vertextradsepro-ljzdt6jnj-vertextradespro-9143s-projects.vercel.app',
  'https://vertextrades.onrender.com'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Protected uploads - admin only
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many admin requests.' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/admin', adminLimiter);

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
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'VertexTrade Pro API running' }));
app.get('/', (req, res) => res.json({ name: 'VertexTrade Pro API', status: 'running' }));

// MongoDB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
}

connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Keep alive for Render
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  setInterval(() => {
    const https = require('https');
    https.get('https://vertextrades.onrender.com/api/health', () => {}).on('error', () => {});
  }, 14 * 60 * 1000);
}

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
