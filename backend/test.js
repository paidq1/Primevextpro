require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected');
  try {
    const user = new User({
      firstName: 'Test',
      lastName: 'User', 
      email: 'testdirect@test.com',
      password: '123456'
    });
    await user.save();
    console.log('User created:', user);
  } catch(err) {
    console.error('Error:', err);
  }
  process.exit();
});
