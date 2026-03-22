const sharp = require('sharp');
const fs = require('fs');

sharp('public/logo.png')
  .resize(120, 40, { fit: 'inside' })
  .png({ quality: 80, compressionLevel: 9 })
  .toBuffer()
  .then(buf => {
    console.log('Resized size:', (buf.length/1024).toFixed(1), 'KB');
    const b64 = 'data:image/png;base64,' + buf.toString('base64');
    fs.writeFileSync('/data/data/com.termux/files/home/logo_b64.txt', b64);
    console.log('Done!');
  });
