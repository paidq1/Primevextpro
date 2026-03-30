const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const CopyTrade = require('./models/CopyTrade');
    
    // Get all copy trades
    const trades = await CopyTrade.find({ traderName: 'Ross Cameron' });
    
    console.log('📊 Updated Copy Trade:');
    trades.forEach(trade => {
      console.log(`  - Trader: ${trade.traderName}`);
      console.log(`    Amount: $${trade.amount}`);
      console.log(`    Total Earned: $${trade.totalEarned}`);
      console.log(`    Last Profit: ${trade.lastProfitAt}`);
      console.log(`    Status: ${trade.status}`);
      console.log(`    ---`);
    });
    
    await mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err.message));
