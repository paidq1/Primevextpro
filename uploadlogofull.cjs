const cloudinary = require('./backend/node_modules/cloudinary').v2;

cloudinary.config({
  cloud_name: 'drix04cop',
  api_key: '932935999393766',
  api_secret: 'n7p-BHfae5LQThiOVJ9rwnEFpFo',
});

cloudinary.uploader.upload('public/logo-full.jpg', {
  folder: 'vertextrade',
  public_id: 'logo-full',
  overwrite: true,
}).then(result => {
  console.log('Uploaded! URL:', result.secure_url);
}).catch(err => {
  console.error('Error:', err.message);
});
