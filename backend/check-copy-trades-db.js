const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const CopyTrade = require('./models/CopyTrade');
    
    // Get all copy trades
    const allTrades = await CopyTrade.find();
    console.log(`Total copy trades: ${allTrades.length}`);
    
    allTrades.forEach(trade => {
      console.log(`\n--- Copy Trade ---`);
      console.log(`ID: ${trade._id}`);
      console.log(`Trader: ${trade.traderName}`);
      console.log(`User: ${trade.user}`);
      console.log(`Amount: $${trade.amount}`);
      console.log(`Total Earned: $${trade.totalEarned || 0}`);
      console.log(`Status: ${trade.status}`);
      console.log(`Last Profit: ${trade.lastProfitAt || 'Never'}`);
      console.log(`Created: ${trade.createdAt}`);
    });
    
    // Check active trades specifically
    const activeTrades = await CopyTrade.find({ status: 'active' });
    console.log(`\n\nActive copy trades: ${activeTrades.length}`);
    
    await mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err.message));
