const Jimp = require('jimp');
const fs = require('fs');

Jimp.read('public/logo.png')
  .then(img => img.resize(60, Jimp.AUTO).quality(60).getBufferAsync(Jimp.MIME_PNG))
  .then(buf => {
    console.log('Resized size:', (buf.length/1024).toFixed(1), 'KB');
    const b64 = 'data:image/png;base64,' + buf.toString('base64');
    fs.writeFileSync('/data/data/com.termux/files/home/logo_b64.txt', b64);
    console.log('Done! b64 length:', b64.length);
  })
  .catch(err => console.error(err));
