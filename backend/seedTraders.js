require('dotenv').config();
const mongoose = require('mongoose');
const Trader = require('./models/Trader');

const TRADERS = [
  { name: 'Ross Cameron', location: 'Vermont, USA', flag: '🇺🇸', followers: '1.2k', risk: 6.5, favorite: 'AAPL', totalTrades: 300, totalLoss: 12, profitShare: 20.5, winRate: 75, img: '', verified: true },
  { name: 'Rayner Teo', location: 'Singapore', flag: '🇸🇬', followers: '3.4k', risk: 4.8, favorite: 'SPY', totalTrades: 820, totalLoss: 34, profitShare: 18.0, winRate: 82, img: '', verified: true },
  { name: 'Kathy Lien', location: 'New York, USA', flag: '🇺🇸', followers: '2.1k', risk: 5.4, favorite: 'EURUSD', totalTrades: 950, totalLoss: 21, profitShare: 15.2, winRate: 79, img: '', verified: true },
  { name: 'Nicola Duke', location: 'United Kingdom', flag: '🇬🇧', followers: '1.6k', risk: 5.2, favorite: 'GBPUSD', totalTrades: 540, totalLoss: 15, profitShare: 19.5, winRate: 81, img: '', verified: true },
  { name: 'Anton Kreil', location: 'London, UK', flag: '🇬🇧', followers: '2.8k', risk: 7.1, favorite: 'ETH', totalTrades: 1200, totalLoss: 45, profitShare: 12.5, winRate: 88, img: '', verified: true },
  { name: 'Timothy Sykes', location: 'Miami, USA', flag: '🇺🇸', followers: '4.1k', risk: 9.1, favorite: 'TSLA', totalTrades: 1800, totalLoss: 280, profitShare: 25.0, winRate: 65, img: '', verified: true },
  { name: 'Nial Fuller', location: 'Australia', flag: '🇦🇺', followers: '1.8k', risk: 5.1, favorite: 'GBPUSD', totalTrades: 610, totalLoss: 18, profitShare: 22.3, winRate: 84, img: '', verified: true },
  { name: 'Anne-Marie Baiynd', location: 'Texas, USA', flag: '🇺🇸', followers: '1.4k', risk: 4.9, favorite: 'SPX', totalTrades: 720, totalLoss: 22, profitShare: 17.8, winRate: 80, img: '', verified: true },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Trader.deleteMany({});
  await Trader.insertMany(TRADERS);
  console.log('Traders seeded!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
