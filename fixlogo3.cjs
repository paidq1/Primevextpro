const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');
const b64 = fs.readFileSync('/data/data/com.termux/files/home/logo_b64.txt', 'utf8');

const oldHeader = `<td style="vertical-align:middle;"><img src="https://vertextradspro.vercel.app/logo.png" alt="VertexTrade" height="36" style="display:block;" /></td>`;
const newHeader = `<td style="vertical-align:middle;"><img src="${b64}" alt="VertexTrade" height="36" style="display:block;" /></td>`;

if (f.includes(oldHeader)) {
  f = f.replace(oldHeader, newHeader);
  fs.writeFileSync('backend/utils/sendEmail.js', f);
  console.log('Done! Logo embedded as base64.');
} else {
  console.log('Pattern not found');
}
