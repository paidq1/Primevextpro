const emailjs = require('@emailjs/nodejs');

const sendEmail = async ({ to, subject, html, resetUrl, name }) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        email: to,
        to_name: name || to,
        reset_link: resetUrl || '',
        subject: subject || 'Reset your password',
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    return { success: true };
  } catch (err) {
    throw new Error('Email sending failed: ' + err.message);
  }
};

module.exports = sendEmail;
