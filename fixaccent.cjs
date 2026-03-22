const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

f = f.replace(
  `<!-- Accent Line -->
      <tr><td style="height:2px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1);"></td></tr>`,
  ''
);

fs.writeFileSync('backend/utils/sendEmail.js', f);
console.log('Done!');
