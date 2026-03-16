const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [MessageSchema],
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  unreadAdmin: { type: Number, default: 0 },
  unreadUser: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
