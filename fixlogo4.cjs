const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');
const b64 = fs.readFileSync('/data/data/com.termux/files/home/logo_b64.txt', 'utf8');

// Replace any existing base64 img src
f = f.replace(/src="data:image\/png;base64,[^"]*"/, `src="${b64}"`);
fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done! File size:', (f.length/1024).toFixed(1), 'KB');
