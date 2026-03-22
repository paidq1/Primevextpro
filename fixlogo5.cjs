const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

// Replace base64 src with Cloudinary URL
f = f.replace(/src="data:image\/png;base64,[^"]*"/, 'src="https://res.cloudinary.com/drix04cop/image/upload/v1774077555/vertextrade/logo.png"');

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done! File size:', (f.length/1024).toFixed(1), 'KB');
