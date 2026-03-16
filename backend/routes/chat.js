const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { sendChatNotification } = require('../utils/sendEmail');
const adminAuth = require('../middleware/adminAuth');

// User: start or continue chat
router.post('/send', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message required' });

    let chat = await Contact.findOne({ userId: req.user.id, status: 'open' });
    if (!chat) {
      chat = new Contact({
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        messages: [],
        unreadAdmin: 0,
        unreadUser: 0
      });
    }

    chat.messages.push({ sender: 'user', text });
    chat.unreadAdmin += 1;
    chat.updatedAt = Date.now();
    await chat.save();
    // Send email notification to admin
    try {
      await sendChatNotification({ name: chat.name, email: chat.email, message: text });
    } catch(e) { console.log('Email notify error:', e.message); }
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: get their chat
router.get('/my', auth, async (req, res) => {
  try {
    const chat = await Contact.findOne({ userId: req.user.id, status: 'open' });
    if (!chat) return res.json(null);
    chat.unreadUser = 0;
    await chat.save();
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get all chats
router.get('/all', adminAuth, async (req, res) => {
  try {
    const chats = await Contact.find().sort({ updatedAt: -1 });
    res.json(chats);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reply to chat
router.post('/reply/:chatId', adminAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message required' });

    const chat = await Contact.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    chat.messages.push({ sender: 'admin', text });
    chat.unreadUser += 1;
    chat.unreadAdmin = 0;
    chat.updatedAt = Date.now();
    await chat.save();
    // Send email notification to admin
    try {
      await sendChatNotification({ name: chat.name, email: chat.email, message: text });
    } catch(e) { console.log('Email notify error:', e.message); }
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: resolve chat
router.patch('/resolve/:chatId', adminAuth, async (req, res) => {
  try {
    const chat = await Contact.findByIdAndUpdate(
      req.params.chatId,
      { status: 'resolved' },
      { new: true }
    );
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete chat
router.delete('/delete/:chatId', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.chatId);
    res.json({ message: 'Chat deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
