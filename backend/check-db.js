const mongoose = require('mongoose');
require('dotenv').config();

// Check both possible variable names
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Using URI from:', process.env.MONGO_URI ? 'MONGO_URI' : (process.env.MONGODB_URI ? 'MONGODB_URI' : 'none'));
console.log('URI exists?', !!mongoUri);

if (mongoUri) {
  console.log('Attempting to connect...');
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ Connected to MongoDB successfully!');
      mongoose.disconnect();
    })
    .catch(err => {
      console.error('❌ Connection error:', err.message);
    });
} else {
  console.error('❌ No MongoDB URI found in .env file');
}
