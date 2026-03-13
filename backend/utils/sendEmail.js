const { Resend } = require('resend');

const baseTemplate = (content) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e;">
  
  <!-- Header Banner -->
  <div style="background: linear-gradient(135deg, #0f1729 0%, #1a1f3a 50%, #0f1729 100%); padding: 0; text-align: center; border-bottom: 2px solid #6366f1;">
    <div style="padding: 28px 30px;">
      <div style="display: inline-block; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 10px;">
          <svg viewBox="0 0 40 40" fill="none" width="36" height="36" style="display:inline-block;vertical-align:middle">
            <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" stroke-width="1.5"/>
            <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" stroke-width="1.2"/>
            <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" stroke-width="1"/>
          </svg>
          <div style="display: inline-block; vertical-align: middle; text-align: left;">
            <div style="color: white; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.2;">VERTEXTRADE <span style="color: #6366f1;">PRO</span></div>
            <div style="color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Smart Investment Brokers</div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 3px; background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #6366f1, transparent);"></div>
  </div>

  <!-- Body -->
  <div style="padding: 36px 32px; background: #0e1628;">
    ${content}
  </div>

  <!-- Divider -->
  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent); margin: 0 32px;"></div>

  <!-- Footer -->
  <div style="background: #080d1a; padding: 24px 32px; text-align: center;">
    <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 8px; font-weight: 500;">VertexTrade Pro — Smart Investment Brokers</p>
    <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 0 0 12px;">
      <a href="https://vertextradepro.com" style="color: #6366f1; text-decoration: none;">vertextradepro.com</a>
      &nbsp;•&nbsp;
      <a href="mailto:support@vertextradepro.com" style="color: rgba(255,255,255,0.3); text-decoration: none;">support@vertextradepro.com</a>
    </p>
    <p style="color: rgba(255,255,255,0.15); font-size: 10px; margin: 0;">© 2025 VertexTrade Pro. All rights reserved.</p>
  </div>
</div>`;

const btn = (url, text, color = '#6366f1') =>
  `<div style="text-align:center;margin:32px 0"><a href="${url}" style="background:${color};color:white;padding:14px 36px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.3px;display:inline-block">${text}</a></div>`;

const greeting = (name) =>
  `<p style="color:rgba(255,255,255,0.7);font-size:15px;margin:0 0 20px;line-height:1.6">Hi <strong style="color:white">${name}</strong>,</p>`;

const regards =
  `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin:28px 0 0;line-height:1.6">Best regards,<br/><strong style="color:rgba(255,255,255,0.7)">VertexTrade Pro Support Team</strong></p>`;

const sendEmail = async ({ to, type, name, resetUrl, verifyUrl, amount, currency, reason, message, package: pkg }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FRONTEND = process.env.FRONTEND_URL;
  let subject, html;

  if (type === 'welcome') {
    subject = 'Welcome to VertexTrade Pro!';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Welcome aboard, ${name}! 🚀</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your account is ready</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">You have successfully joined VertexTrade Pro. We are excited to have you as part of our growing community of smart investors.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:24px;margin:24px 0">
        <p style="color:white;margin:0 0 16px;font-size:14px;font-weight:600;letter-spacing:0.3px">GET STARTED IN 4 STEPS</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px"><span style="color:#6366f1;font-weight:700;margin-right:10px">01</span>Complete your KYC verification</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">02</span>Make your first deposit</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">03</span>Choose an investment package</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">04</span>Start earning daily profits</td></tr>
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard')}
      ${regards}`);

  } else if (type === 'depositApproved') {
    subject = 'Deposit Approved - Funds Credited';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Deposit Approved! 🎉</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Funds have been credited to your account</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Great news! Your deposit has been reviewed and approved. The funds are now available in your account.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.08));border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:28px;margin:24px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase">Amount Credited</p>
        <p style="color:#22c55e;font-size:38px;font-weight:800;margin:0;letter-spacing:-0.5px">${currency || '$'}${amount}</p>
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:8px 0 0">Available in your wallet</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View My Balance')}
      ${regards}`);

  } else if (type === 'depositRejected') {
    subject = 'Deposit Could Not Be Processed';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Deposit Update</h2>
      <p style="color:#ef4444;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Action required</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Unfortunately, we were unable to process your deposit of <strong style="color:white">${currency || '$'}${amount}</strong> at this time.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:20px;margin:24px 0"><p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 8px">Reason</p><p style="color:#fca5a5;margin:0;font-size:14px;line-height:1.6">${reason}</p></div>` : ''}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Please try again or contact our support team if you need assistance.</p>
      ${btn(`${FRONTEND}/dashboard/deposit`, 'Try Again')}
      ${regards}`);

  } else if (type === 'withdrawalApproved') {
    subject = 'Withdrawal Approved - Being Processed';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Withdrawal Approved! 💸</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your funds are on the way</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Your withdrawal request has been approved and is now being processed. Funds will be sent to your wallet shortly.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.08));border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:28px;margin:24px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase">Amount Withdrawn</p>
        <p style="color:#22c55e;font-size:38px;font-weight:800;margin:0;letter-spacing:-0.5px">${currency || '$'}${amount}</p>
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:8px 0 0">Expected delivery: within 24 hours</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard')}
      ${regards}`);

  } else if (type === 'withdrawalRejected') {
    subject = 'Withdrawal Could Not Be Processed';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Withdrawal Update</h2>
      <p style="color:#ef4444;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Action required</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Unfortunately, your withdrawal of <strong style="color:white">${currency || '$'}${amount}</strong> could not be processed at this time.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:20px;margin:24px 0"><p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 8px">Reason</p><p style="color:#fca5a5;margin:0;font-size:14px;line-height:1.6">${reason}</p></div>` : ''}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Your funds have been returned to your account balance. Please contact support if you have any questions.</p>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard')}
      ${regards}`);

  } else if (type === 'kycApproved') {
    subject = 'Identity Verified - KYC Approved';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">KYC Verified! 🎉</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your identity has been confirmed</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Congratulations! Your identity verification has been successfully completed. You now have full access to all VertexTrade Pro features.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.08));border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:24px;margin:24px 0;text-align:center">
        <div style="width:56px;height:56px;background:rgba(34,197,94,0.15);border-radius:50%;margin:0 auto 12px;line-height:56px;font-size:24px">✅</div>
        <p style="color:#22c55e;font-size:16px;font-weight:700;margin:0">Identity Verified</p>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:6px 0 0">Full account access granted</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Start Investing Now')}
      ${regards}`);

  } else if (type === 'kycRejected') {
    subject = 'KYC Verification - Action Required';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">KYC Update</h2>
      <p style="color:#ef4444;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Verification unsuccessful — please resubmit</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">We were unable to verify your identity with the documents provided. Please resubmit with clearer images.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:20px;margin:24px 0"><p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 8px">Reason</p><p style="color:#fca5a5;margin:0;font-size:14px;line-height:1.6">${reason}</p></div>` : ''}
      ${btn(`${FRONTEND}/dashboard/kyc`, 'Resubmit Documents')}
      ${regards}`);

  } else if (type === 'adminMessage') {
    subject = 'Message from VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Message from Support</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">VertexTrade Pro Support Team</p>
      ${greeting(name)}
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:20px 24px;margin:24px 0">
        <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;line-height:1.8">${message}</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard')}
      ${regards}`);

  } else if (type === 'verifyEmail') {
    subject = 'Verify Your Email - VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Verify Your Email</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">One last step to get started</p>
      ${greeting(name || 'User')}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Thank you for registering with VertexTrade Pro! Please verify your email address to activate your account.</p>
      ${btn(verifyUrl, 'Verify My Email')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:16px;margin:24px 0">
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.6">⏱ This link expires in <strong style="color:rgba(255,255,255,0.6)">24 hours</strong><br/>🔒 If you did not create this account, please ignore this email.</p>
      </div>
      ${regards}`);

  } else {
    subject = 'Password Reset - VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Reset Your Password</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Security notification</p>
      ${greeting(name || 'User')}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">We received a request to reset the password for your account. Click the button below to create a new password.</p>
      ${btn(resetUrl, 'Reset My Password')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:16px;margin:24px 0">
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.6">⏱ This link expires in <strong style="color:rgba(255,255,255,0.6)">24 hours</strong><br/>🔒 If you did not request this, please ignore this email. Your account remains secure.</p>
      </div>
      ${regards}`);
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
