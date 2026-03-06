const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, resetUrl, name }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1628; color: white; padding: 30px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #6366f1;">Vertex Trade Pro</h2>
      </div>
      <h3 style="color: white;">You have requested a password change</h3>
      <p style="color: #94a3b8;">Hi ${name || to},</p>
      <p style="color: #94a3b8;">We received a request to reset the password for your account. To proceed, please click the link below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">This link will expire in 24 hours.</p>
      <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      <p style="color: #94a3b8;">Best regards,<br/>Vertex Trade Pro Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vertex Trade Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || 'Reset your password',
    html,
  });

  return { success: true };
};

module.exports = sendEmail;
