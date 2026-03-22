const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

f = f.replace(
  'background:#0d1117;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;',
  'background:#111827;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;'
);

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done!');
