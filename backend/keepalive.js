// Add this to server.js to ping itself every 14 minutes
setInterval(() => {
  const https = require('https');
  https.get('https://vertextradepro.onrender.com/api/health', (res) => {
    console.log('Keep alive ping:', res.statusCode);
  }).on('error', (err) => {
    console.log('Keep alive error:', err.message);
  });
}, 14 * 60 * 1000);
