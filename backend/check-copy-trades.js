const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const CopyTrade = require('./models/CopyTrade');
    const User = require('./models/User');
    
    // Check active copy trades
    const activeTrades = await CopyTrade.find({ status: 'active' });
    console.log(`📊 Active Copy Trades: ${activeTrades.length}`);
    
    if (activeTrades.length > 0) {
      console.log('\nActive Copy Trades:');
      activeTrades.forEach(trade => {
        console.log(`  - ${trade.traderName}: Amount: $${trade.amount}, Total Earned: $${trade.totalEarned || 0}, Last Profit: ${trade.lastProfitAt || 'Never'}`);
      });
    } else {
      console.log('\n⚠️  No active copy trades found.');
      console.log('To test, create a copy trade first through your frontend or API.');
    }
    
    // Check stopped trades
    const stoppedTrades = await CopyTrade.find({ status: 'stopped' });
    console.log(`\n📊 Stopped Copy Trades: ${stoppedTrades.length}`);
    
    await mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err.message));
