const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

// Remove all icon circle divs
f = f.replace(/<div style="width:60px;height:60px;[^"]*"[^>]*>.*?<\/div>\n/g, '');

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done!');
