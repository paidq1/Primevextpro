const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { sendChatNotification } = require('../utils/sendEmail');
const { sendAdminPush } = require('./push');
const adminAuth = require('../middleware/adminAuth');

// User: start or continue chat
router.post('/send', auth, async (req, res) => {
  try {
    const { text, userInfo } = req.body;
    if (!text) return res.status(400).json({ message: 'Message required' });

    let chat = await Contact.findOne({ userId: req.user.id, status: 'open' });
    if (!chat) {
      chat = new Contact({
        userId: req.user.id,
        name: req.user.firstName,
        email: req.user.email,
        messages: [],
        unreadAdmin: 0,
        unreadUser: 0,
        userInfo: userInfo || {}
      });
    }

    chat.messages.push({ sender: 'user', text });
    chat.unreadAdmin += 1;
    chat.visitorOnline = true;
    if (userInfo) { chat.userInfo = userInfo; console.log('userInfo saved:', JSON.stringify(userInfo)); }
    chat.updatedAt = Date.now();
    await chat.save();

    try { await sendChatNotification({ name: chat.name, email: chat.email, message: text }); } catch(e) {}
    try { await sendAdminPush({ title: `New message from ${chat.name || chat.email}`, body: text, url: '/admin' }); } catch(e) {}
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
    chat.visitorOnline = true;
    // Mark admin messages as read
    chat.messages.forEach(m => { if (m.sender === 'admin') m.read = true; });
    await chat.save();
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: visitor left
router.post('/visitor-left', auth, async (req, res) => {
  try {
    const chat = await Contact.findOne({ userId: req.user.id, status: 'open' });
    if (!chat) return res.json(null);
    chat.visitorOnline = false;
    const lastMsg = chat.messages[chat.messages.length - 1];
    const alreadyLeft = lastMsg && lastMsg.text === 'Visitor has left the website';
    if (chat.adminJoined && !alreadyLeft) {
      chat.messages.push({ sender: 'system', text: 'Visitor has left the website' });
    }
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

    // Add "Support joined" system message if first admin reply
    if (!chat.adminJoined) {
      chat.messages.push({ sender: 'system', text: 'VertexTrade Pro Support joined' });
      chat.adminJoined = true;
    }

    chat.messages.push({ sender: 'admin', text });
    chat.unreadUser += 1;
    chat.unreadAdmin = 0;
    chat.updatedAt = Date.now();
    await chat.save();
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: mark messages as read
router.patch('/read/:chatId', adminAuth, async (req, res) => {
  try {
    const chat = await Contact.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    chat.messages.forEach(m => { if (m.sender === 'user') m.read = true; });
    chat.unreadAdmin = 0;
    await chat.save();
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: resolve chat
router.patch('/resolve/:chatId', adminAuth, async (req, res) => {
  try {
    const chat = await Contact.findByIdAndUpdate(req.params.chatId, { status: 'resolved' }, { new: true });
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

// Admin: upload image in chat
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');
const uploadMem = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/reply-image/:chatId', adminAuth, uploadMem.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    const chat = await Contact.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    const result = await uploadToCloudinary(req.file);
    const url = result.secure_url;
    if (!chat.adminJoined) {
      chat.messages.push({ sender: 'system', text: 'VertexTrade Pro Support joined' });
      chat.adminJoined = true;
    }
    chat.messages.push({ sender: 'admin', text: '', image: url });
    chat.unreadUser += 1;
    chat.unreadAdmin = 0;
    chat.updatedAt = Date.now();
    await chat.save();
    res.json(chat);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
