const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

// Outer bg: darker black
f = f.replace('background:#060a12;', 'background:#0a0f1a;');
f = f.replace('background:#0a0f1a;padding:32px 16px;', 'background:#060a12;padding:32px 16px;');

// Card bg: swap main and footer
f = f.replace('max-width:560px;border-radius:16px;overflow:hidden;background:#111827;', 'max-width:560px;border-radius:16px;overflow:hidden;background:#060a12;');
f = f.replace('background:#0d1117;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);', 'background:#111827;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);');

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done!');
