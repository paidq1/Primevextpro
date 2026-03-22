const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

// Main card body bg -> dark black (same as header)
f = f.replace(
  'max-width:560px;border-radius:16px;overflow:hidden;background:#060a12;',
  'max-width:560px;border-radius:16px;overflow:hidden;background:#0d1117;'
);

// Header bg -> same dark black
f = f.replace(
  'background:#111827;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;',
  'background:#0d1117;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;'
);

// Footer bg -> lighter (original card color)
f = f.replace(
  'background:#111827;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);',
  'background:#111827;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);'
);

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done!');
