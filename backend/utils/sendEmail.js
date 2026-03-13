const { Resend } = require('resend');

const baseTemplate = (content) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1628; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #1e2a45 0%, #0e1628 100%); padding: 30px; text-align: center; border-bottom: 1px solid rgba(99,102,241,0.3);">
    <h1 style="color: #6366f1; margin: 0; font-size: 24px; letter-spacing: 1px;">VertexTrade Pro</h1>
    <p style="color: rgba(255,255,255,0.4); margin: 4px 0 0; font-size: 12px;">Smart Investment Brokers</p>
  </div>
  <div style="padding: 30px;">${content}</div>
  <div style="background: #080f1e; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
    <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">© 2025 VertexTrade Pro. All rights reserved.</p>
    <p style="color: rgba(255,255,255,0.2); font-size: 10px; margin: 6px 0 0;">vertextradepro.com</p>
  </div>
</div>`;

const sendEmail = async ({ to, type, name, resetUrl, amount, currency, reason, message, package: pkg }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FRONTEND = process.env.FRONTEND_URL;
  let subject, html;

  if (type === 'welcome') {
    subject = '🎉 Welcome to VertexTrade Pro!';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Welcome aboard, ${name}! 🚀</h2>
      <p style="color:#94a3b8">Your account has been successfully created. You are now part of the VertexTrade Pro community!</p>
      <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:20px;margin:20px 0">
        <p style="color:white;margin:0 0 10px;font-weight:bold">Get started:</p>
        <p style="color:#94a3b8;margin:4px 0">✅ Complete your KYC verification</p>
        <p style="color:#94a3b8;margin:4px 0">✅ Make your first deposit</p>
        <p style="color:#94a3b8;margin:4px 0">✅ Choose an investment package</p>
        <p style="color:#94a3b8;margin:4px 0">✅ Start earning profits</p>
      </div>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Go to Dashboard</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'depositApproved') {
    subject = '✅ Deposit Approved!';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Your Deposit Has Been Approved! 🎉</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">Your deposit has been approved and credited to your account.</p>
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:20px;margin:20px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.5);margin:0 0 6px;font-size:12px">AMOUNT CREDITED</p>
        <p style="color:#22c55e;font-size:32px;font-weight:bold;margin:0">${currency || '$'}${amount}</p>
      </div>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">View Dashboard</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'depositRejected') {
    subject = '❌ Deposit Not Approved';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Deposit Update</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">Unfortunately your deposit of <strong style="color:white">${currency || '$'}${amount}</strong> could not be approved.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:16px;margin:20px 0"><p style="color:#f87171;margin:0"><strong>Reason:</strong> ${reason}</p></div>` : ''}
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard/deposit" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Try Again</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'withdrawalApproved') {
    subject = '✅ Withdrawal Approved!';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Withdrawal Approved! 💸</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">Your withdrawal request has been approved and is being processed.</p>
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:20px;margin:20px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.5);margin:0 0 6px;font-size:12px">AMOUNT WITHDRAWN</p>
        <p style="color:#22c55e;font-size:32px;font-weight:bold;margin:0">${currency || '$'}${amount}</p>
      </div>
      <p style="color:#94a3b8">Funds will be sent to your wallet within 24 hours.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">View Dashboard</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'withdrawalRejected') {
    subject = '❌ Withdrawal Not Approved';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Withdrawal Update</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">Your withdrawal of <strong style="color:white">${currency || '$'}${amount}</strong> could not be approved.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:16px;margin:20px 0"><p style="color:#f87171;margin:0"><strong>Reason:</strong> ${reason}</p></div>` : ''}
      <p style="color:#94a3b8">Your balance has been refunded.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">View Dashboard</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'kycApproved') {
    subject = '✅ KYC Verification Approved!';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">KYC Verified! 🎉</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">Your identity has been successfully verified. You now have full access to all features.</p>
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:20px;margin:20px 0;text-align:center">
        <p style="color:#22c55e;font-size:18px;font-weight:bold;margin:0">✅ Identity Verified</p>
      </div>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Start Investing</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'kycRejected') {
    subject = '❌ KYC Verification Failed';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">KYC Verification Update</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <p style="color:#94a3b8">We were unable to verify your identity at this time.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:16px;margin:20px 0"><p style="color:#f87171;margin:0"><strong>Reason:</strong> ${reason}</p></div>` : ''}
      <p style="color:#94a3b8">Please resubmit your documents with clearer images.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard/kyc" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Resubmit KYC</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else if (type === 'adminMessage') {
    subject = '📢 Message from VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Message from Support</h2>
      <p style="color:#94a3b8">Hi ${name},</p>
      <div style="background:rgba(99,102,241,0.1);border-left:4px solid #6366f1;padding:16px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="color:white;margin:0;line-height:1.6">${message}</p>
      </div>
      <div style="text-align:center;margin:30px 0">
        <a href="${FRONTEND}/dashboard" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Go to Dashboard</a>
      </div>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);

  } else {
    subject = '🔐 Reset Your Password';
    html = baseTemplate(`
      <h2 style="color:white;margin-top:0">Password Reset Request</h2>
      <p style="color:#94a3b8">Hi ${name || to},</p>
      <p style="color:#94a3b8">Click the button below to reset your password:</p>
      <div style="text-align:center;margin:30px 0">
        <a href="${resetUrl}" style="background:#6366f1;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold">Reset Password</a>
      </div>
      <p style="color:#94a3b8;font-size:12px">This link expires in 24 hours.</p>
      <p style="color:#94a3b8;font-size:12px">If you did not request this, ignore this email.</p>
      <p style="color:#94a3b8">Best regards,<br/>VertexTrade Pro Team</p>`);
  }

  console.log('Sending email type:', type || 'passwordReset', 'to:', to);
  const { data, error } = await resend.emails.send({
    from: 'VertexTrade Pro <support@vertextradepro.com>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  console.log('Email sent:', data);
  return { success: true };
};

module.exports = sendEmail;
