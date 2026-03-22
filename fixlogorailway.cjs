const fs = require('fs');
let f = fs.readFileSync('backend/utils/sendEmail.js', 'utf8');

const oldHeader = `<td style="background:#0d1117;padding:18px 28px;border-bottom:1px solid rgba(99,102,241,0.12);">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;"><img src="https://res.cloudinary.com/drix04cop/image/upload/v1774077555/vertextrade/logo.png" alt="VertexTrade" height="36" style="display:block;" /></td>
          </td>
        </tr></table>
      </td></tr>`;

const newHeader = `<td style="background:#ffffff;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;">
        <img src="https://res.cloudinary.com/drix04cop/image/upload/v1774078009/vertextrade/logo-full.jpg" alt="VertexTrade" height="50" style="display:inline-block;" />
      </td></tr>`;

if (f.includes(oldHeader)) {
  f = f.replace(oldHeader, newHeader);
  fs.writeFileSync('backend/utils/sendEmail.js', f);
  console.log('Done!');
} else {
  console.log('Pattern not found - checking current header...');
  const idx = f.indexOf('background:#0d1117;padding:18px');
  console.log(f.substring(idx, idx + 400));
}
