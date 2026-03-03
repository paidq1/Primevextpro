const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000,
  });
  
  isConnected = true;
  console.log(`✅ MongoDB connected`);
  return conn;
};

module.exports = connectDB;
