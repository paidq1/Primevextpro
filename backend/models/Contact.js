const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin', 'system'], required: true },
  text: { type: String, required: false, default: '' },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [MessageSchema],
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  unreadAdmin: { type: Number, default: 0 },
  unreadUser: { type: Number, default: 0 },
  userInfo: {
    browser: String,
    device: String,
    country: String,
    page: String
  },
  adminJoined: { type: Boolean, default: false },
  visitorOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
