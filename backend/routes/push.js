const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const adminAuth = require('../middleware/adminAuth');

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Save subscription
router.post('/subscribe', adminAuth, async (req, res) => {
  try {
    const { subscription } = req.body;
    await PushSubscription.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, subscription },
      { upsert: true, new: true }
    );
    res.json({ message: 'Subscribed' });
  } catch(e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send push to all admin subscriptions
router.post('/send-admin', async (req, res) => {
  try {
    const { title, body, url } = req.body;
    const subs = await PushSubscription.find();
    const payload = JSON.stringify({ title, body, url });
    await Promise.all(subs.map(s =>
      webpush.sendNotification(s.subscription, payload).catch(e => {
        if (e.statusCode === 410) PushSubscription.findByIdAndDelete(s._id);
      })
    ));
    res.json({ message: 'Sent' });
  } catch(e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.sendAdminPush = async ({ title, body, url }) => {
  const subs = await PushSubscription.find();
  const payload = JSON.stringify({ title, body, url: url || '/admin' });
  await Promise.all(subs.map(s =>
    webpush.sendNotification(s.subscription, payload).catch(e => {
      if (e.statusCode === 410) PushSubscription.findByIdAndDelete(s._id);
    })
  ));
};
