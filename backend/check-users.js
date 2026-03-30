const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const User = require('./models/User');
    const CopyTrade = require('./models/CopyTrade');
    
    // Get all users
    const users = await User.find().select('firstName lastName email');
    console.log('All Users:');
    users.forEach(user => {
      console.log(`- ID: ${user._id}`);
      console.log(`  Name: ${user.firstName} ${user.lastName}`);
      console.log(`  Email: ${user.email}`);
      console.log('---');
    });
    
    // Get copy trade owner
    const copyTrade = await CopyTrade.findOne();
    if (copyTrade) {
      const owner = await User.findById(copyTrade.user);
      console.log(`\nCopy Trade Owner: ${owner?.firstName} ${owner?.lastName} (${owner?.email})`);
      console.log(`Owner ID: ${copyTrade.user}`);
    }
    
    await mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err.message));
