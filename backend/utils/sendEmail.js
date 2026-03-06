const emailjs = require('@emailjs/nodejs');

const sendEmail = async ({ to, subject, html, resetUrl, name }) => {
  console.log('Sending email to:', to);
  console.log('Service ID:', process.env.EMAILJS_SERVICE_ID);
  console.log('Template ID:', process.env.EMAILJS_TEMPLATE_ID);
  console.log('Public Key:', process.env.EMAILJS_PUBLIC_KEY ? 'set' : 'NOT SET');
  console.log('Private Key:', process.env.EMAILJS_PRIVATE_KEY ? 'set' : 'NOT SET');

  try {
    const result = await emailjs.send(
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
    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (err) {
    console.error('EmailJS error:', err);
    throw new Error('Email sending failed: ' + err.message);
  }
};

module.exports = sendEmail;
