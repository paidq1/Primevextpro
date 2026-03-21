const { Resend } = require('resend');

const sendEmail = async ({ to, type, name, resetUrl, verifyUrl, amount, currency, reason, message, package: pkg, planDetails, code, botName, totalEarned, newBalance, stakePlan, subject: customSubject }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FRONTEND = process.env.FRONTEND_URL || 'https://vertextradspro.vercel.app';

  const currencyMap = {
    'US Dollar (USD)': '$', 'Euro (EUR)': '€', 'British Pound (GBP)': '£',
    'Indian Rupee (INR)': '₹', 'Nigerian Naira (NGN)': '₦', 'Canadian Dollar (CAD)': 'C$',
    'Australian Dollar (AUD)': 'A$', 'Japanese Yen (JPY)': '¥', 'Swiss Franc (CHF)': 'Fr',
  };
  const getRates = () => ({
    'US Dollar (USD)': 1, 'Euro (EUR)': 0.92, 'British Pound (GBP)': 0.79,
    'Indian Rupee (INR)': 83.5, 'Nigerian Naira (NGN)': 1580, 'Canadian Dollar (CAD)': 1.36,
    'Australian Dollar (AUD)': 1.53, 'Japanese Yen (JPY)': 149.5, 'Swiss Franc (CHF)': 0.90,
  });
  const userCurrency = currency || 'US Dollar (USD)';
  const currSymbol = currencyMap[userCurrency] || '$';
  const formattedAmount = amount ? `${currSymbol}${(parseFloat(amount) * (getRates()[userCurrency] || 1)).toLocaleString()}` : '';

  const wrap = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060a12;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;border-radius:16px;overflow:hidden;background:#0d1117;border:1px solid rgba(99,102,241,0.15);box-shadow:0 0 40px rgba(0,0,0,0.4);">
      
      <!-- Header -->
      <tr><td style="background:#0d1117;padding:24px 28px;border-bottom:1px solid rgba(99,102,241,0.12);text-align:center;">
        <img src="https://res.cloudinary.com/drix04cop/image/upload/v1774078009/vertextrade/logo-full.jpg" alt="VertexTrade" height="50" style="display:inline-block;" />
      </td></tr>

      

      <!-- Body -->
      <tr><td style="padding:36px 36px 28px;">
        ${content}
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#111827;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:12px;">
              <a href="${FRONTEND}" style="color:#6366f1;text-decoration:none;font-size:11px;margin:0 8px;">Dashboard</a>
              <span style="color:rgba(255,255,255,0.15);font-size:11px;">|</span>
              <a href="mailto:support@vertextradepro.com" style="color:#6366f1;text-decoration:none;font-size:11px;margin:0 8px;">Support</a>
              <span style="color:rgba(255,255,255,0.15);font-size:11px;">|</span>
              <a href="${FRONTEND}/dashboard/kyc" style="color:#6366f1;text-decoration:none;font-size:11px;margin:0 8px;">KYC</a>
            </td>
          </tr>
          <tr><td align="center">
            <p style="color:rgba(255,255,255,0.2);font-size:10px;margin:0;line-height:1.8;">
              © 2025 VertexTrade Pro — Smart Investment Brokers<br/>
              <a href="${FRONTEND}" style="color:rgba(99,102,241,0.6);text-decoration:none;">vertextradspro.vercel.app</a>
            </p>
          </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const btn = (url, text, color = '#6366f1') =>
    `<div style="text-align:center;margin:28px 0;">
      <a href="${url}" style="background:linear-gradient(135deg,${color},${color}dd);color:white;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;display:inline-block;box-shadow:0 4px 20px ${color}40;">
        ${text}
      </a>
    </div>`;

  const card = (content, accent = '#6366f1') =>
    `<div style="background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.03));border:1px solid ${accent}30;border-radius:12px;padding:24px;margin:20px 0;">
      ${content}
    </div>`;

  const row = (label, value, color = 'white') =>
    `<tr>
      <td style="padding:10px 0;color:rgba(255,255,255,0.45);font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">${label}</td>
      <td style="padding:10px 0;color:${color};font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05);">${value}</td>
    </tr>`;

  const hi = `<p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 16px;line-height:1.6;">Hi <strong style="color:white;">${name || 'User'}</strong>,</p>`;
  const bye = `<p style="color:rgba(255,255,255,0.4);font-size:13px;margin:28px 0 0;line-height:1.6;">Best regards,<br/><strong style="color:rgba(255,255,255,0.65);">VertexTrade Pro Support Team</strong></p>`;

  let subject, html;

  if (type === 'twoFactorOTP' || type === 'otp') {
    subject = 'Your Verification Code — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Verification Code</h2>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">Two-Factor Authentication</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7;">Your one-time verification code is:</p>
      <div style="background:linear-gradient(135deg,#0f0c29,#1a1040);border:1px solid rgba(99,102,241,0.4);border-radius:16px;padding:32px;margin:24px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Your Code</p>
        <p style="color:white;font-size:44px;font-weight:900;margin:0;letter-spacing:14px;font-family:monospace;">${code}</p>
        <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:12px 0 0;">⏱ Expires in 10 minutes</p>
      </div>
      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:14px 18px;margin:20px 0;">
        <p style="color:rgba(255,100,100,0.8);font-size:12px;margin:0;line-height:1.6;">🔒 Never share this code with anyone — including VertexTrade Pro staff.</p>
      </div>
      ${bye}
    `);

  } else if (type === 'verifyEmail') {
    subject = 'Verify Your Email — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Verify Your Email</h2>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">One last step to get started</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7;">Thank you for joining VertexTrade Pro! Please verify your email address to activate your account and start trading.</p>
      ${btn(verifyUrl, '✓ Verify My Email')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0;line-height:1.7;">⏱ This link expires in <strong style="color:rgba(255,255,255,0.6);">24 hours</strong><br/>🔒 If you didn't create this account, you can safely ignore this email.</p>
      </div>
      ${bye}
    `);

  } else if (type === 'depositApproved') {
    subject = '💰 Deposit Confirmed — Funds Credited';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Deposit Approved!</h2>
        <p style="color:#22c55e;font-size:13px;margin:0;">Funds successfully credited to your account</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Great news! Your deposit has been reviewed and approved. The funds are now available in your wallet.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.04));border:1px solid rgba(34,197,94,0.25);border-radius:16px;padding:28px;margin:20px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Amount Credited</p>
        <p style="color:#22c55e;font-size:40px;font-weight:900;margin:0;letter-spacing:-1px;">+${formattedAmount}</p>
        <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:10px 0 0;">Available in your wallet now</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View My Balance →', '#22c55e')}
      ${bye}
    `);

  } else if (type === 'depositRejected') {
    subject = 'Deposit Update — Action Required';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Deposit Not Processed</h2>
        <p style="color:#ef4444;font-size:13px;margin:0;">Your deposit requires attention</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Unfortunately, we were unable to process your deposit of <strong style="color:white;">${formattedAmount}</strong>.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:18px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Reason</p>
        <p style="color:#fca5a5;margin:0;font-size:13px;line-height:1.6;">${reason}</p>
      </div>` : ''}
      ${btn(`${FRONTEND}/dashboard/deposit`, 'Try Again →', '#6366f1')}
      ${bye}
    `);

  } else if (type === 'withdrawalApproved') {
    subject = '💸 Withdrawal Approved — Funds On The Way';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Withdrawal Approved!</h2>
        <p style="color:#22c55e;font-size:13px;margin:0;">Your funds are on the way</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Your withdrawal request has been approved and is being processed. Funds will arrive in your wallet within 24 hours.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.04));border:1px solid rgba(34,197,94,0.25);border-radius:16px;padding:28px;margin:20px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Amount Withdrawn</p>
        <p style="color:#22c55e;font-size:40px;font-weight:900;margin:0;letter-spacing:-1px;">${formattedAmount}</p>
        <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:10px 0 0;">Expected delivery: within 24 hours</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard →', '#22c55e')}
      ${bye}
    `);

  } else if (type === 'withdrawalRejected') {
    subject = 'Withdrawal Update — Action Required';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Withdrawal Not Processed</h2>
        <p style="color:#ef4444;font-size:13px;margin:0;">Your withdrawal requires attention</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Unfortunately, your withdrawal of <strong style="color:white;">${formattedAmount}</strong> could not be processed. Funds have been returned to your account.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:18px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Reason</p>
        <p style="color:#fca5a5;margin:0;font-size:13px;line-height:1.6;">${reason}</p>
      </div>` : ''}
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard →', '#6366f1')}
      ${bye}
    `);

  } else if (type === 'kycApproved') {
    subject = '✅ KYC Verified — Full Access Granted';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Identity Verified!</h2>
        <p style="color:#22c55e;font-size:13px;margin:0;">Full platform access granted</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Congratulations! Your identity verification has been successfully completed. You now have full access to all VertexTrade Pro features including withdrawals and premium trading tools.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.06),rgba(16,185,129,0.03));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <p style="color:#22c55e;font-size:16px;font-weight:700;margin:0 0 4px;">🎉 Account Fully Verified</p>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">You can now withdraw funds and access all features</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Start Trading Now →', '#22c55e')}
      ${bye}
    `);

  } else if (type === 'kycRejected') {
    subject = 'KYC Verification — Resubmission Required';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">KYC Verification Failed</h2>
        <p style="color:#ef4444;font-size:13px;margin:0;">Please resubmit your documents</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">We were unable to verify your identity with the documents provided. Please resubmit with clearer, valid documents.</p>
      ${reason ? `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:18px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Reason</p>
        <p style="color:#fca5a5;margin:0;font-size:13px;line-height:1.6;">${reason}</p>
      </div>` : ''}
      ${btn(`${FRONTEND}/dashboard/kyc`, 'Resubmit Documents →', '#6366f1')}
      ${bye}
    `);

  } else if (type === 'welcome') {
    subject = '🚀 Welcome to VertexTrade Pro!';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Welcome Aboard!</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">Your account is ready</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">We're thrilled to have you join VertexTrade Pro! Your account has been successfully created and you're ready to start your trading journey.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04));border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:22px;margin:20px 0;">
        <p style="color:white;font-size:13px;font-weight:700;margin:0 0 14px;">🎯 Get Started in 4 Steps</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.65);font-size:13px;border-top:1px solid rgba(255,255,255,0.05);"><span style="color:#6366f1;font-weight:700;margin-right:10px;">01</span> Complete KYC verification</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.65);font-size:13px;border-top:1px solid rgba(255,255,255,0.05);"><span style="color:#6366f1;font-weight:700;margin-right:10px;">02</span> Make your first deposit</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.65);font-size:13px;border-top:1px solid rgba(255,255,255,0.05);"><span style="color:#6366f1;font-weight:700;margin-right:10px;">03</span> Choose an investment package</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.65);font-size:13px;border-top:1px solid rgba(255,255,255,0.05);"><span style="color:#6366f1;font-weight:700;margin-right:10px;">04</span> Start earning daily profits</td></tr>
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard →')}
      ${bye}
    `);

  } else if (type === 'adminMessage') {
    subject = customSubject || 'Message from VertexTrade Pro Support';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Message from Support</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">VertexTrade Pro Support Team</p>
      </div>
      ${hi}
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.03));border-left:3px solid #6366f1;border-radius:0 12px 12px 0;padding:20px 22px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;line-height:1.8;">${message}</p>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard →')}
      ${bye}
    `);

  } else if (type === 'withdrawalCode') {
    subject = 'Your Withdrawal Code — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Withdrawal Code</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">Your secure withdrawal authorization code</p>
      </div>
      ${hi}
      <div style="background:linear-gradient(135deg,#0f0c29,#1a1040);border:1px solid rgba(99,102,241,0.4);border-radius:16px;padding:32px;margin:24px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Withdrawal Code</p>
        <p style="color:white;font-size:44px;font-weight:900;margin:0;letter-spacing:12px;font-family:monospace;">${code}</p>
        <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:12px 0 0;">Keep this code safe</p>
      </div>
      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:14px 18px;margin:20px 0;">
        <p style="color:rgba(255,100,100,0.8);font-size:12px;margin:0;line-height:1.6;">🔒 Never share this code. If you did not request this, contact support immediately.</p>
      </div>
      ${btn(`${FRONTEND}/dashboard/withdraw`, 'Withdraw Now →')}
      ${bye}
    `);

  } else if (type === 'botProfit') {
    subject = '📈 Bot Profit Credited — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Bot Profit Credited!</h2>
        <p style="color:#22c55e;font-size:13px;margin:0;">Your trading bot is performing great</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Your <strong style="color:white;">${botName || 'Trading Bot'}</strong> has generated a profit and it has been credited to your account.</p>
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.04));border:1px solid rgba(34,197,94,0.25);border-radius:16px;padding:28px;margin:20px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Profit Credited</p>
        <p style="color:#22c55e;font-size:40px;font-weight:900;margin:0;">+$${amount}</p>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;margin:16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Bot Name', botName || 'Trading Bot')}
          ${row('Total Earned', `$${totalEarned || '0'}`, '#22c55e')}
          ${row('New Balance', `$${newBalance || '0'}`)}
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard →', '#22c55e')}
      ${bye}
    `);

  } else if (type === 'stakeProfit') {
    subject = '📊 Staking Profit Credited — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Staking Profit Credited!</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">Your investment is earning</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Your <strong style="color:white;">${planDetails?.plan || stakePlan || 'Staking'}</strong> plan has generated a profit.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04));border:1px solid rgba(99,102,241,0.25);border-radius:16px;padding:28px;margin:20px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Profit Credited</p>
        <p style="color:#818cf8;font-size:40px;font-weight:900;margin:0;">+$${amount}</p>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;margin:16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Stake Plan', planDetails?.plan || stakePlan || 'N/A')}
          ${row('Total Earned', `$${totalEarned || '0'}`, '#818cf8')}
          ${row('New Balance', `$${newBalance || '0'}`)}
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard →')}
      ${bye}
    `);

  } else if (type === 'stakeCompleted') {
    subject = '🎉 Staking Completed — Principal Returned';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
                <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Staking Completed!</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">Your principal has been returned</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.7;">Your <strong style="color:white;">${planDetails?.plan || stakePlan || 'Staking'}</strong> plan has matured. Your principal and all earned profits have been credited to your account.</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;margin:16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Principal Returned', `$${amount}`, '#22c55e')}
          ${row('Total Earned', `$${totalEarned || '0'}`, '#818cf8')}
          ${row('New Balance', `$${newBalance || '0'}`)}
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard/stake`, 'Stake Again →')}
      ${bye}
    `);

  } else {
    // Default: password reset
    subject = 'Reset Your Password — VertexTrade Pro';
    html = wrap(`
      <div style="text-align:center;margin-bottom:28px;">
        
        <h2 style="color:white;margin:0 0 6px;font-size:22px;font-weight:800;">Reset Your Password</h2>
        <p style="color:#818cf8;font-size:13px;margin:0;">Security notification</p>
      </div>
      ${hi}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7;">We received a request to reset the password for your account. Click the button below to create a new password.</p>
      ${btn(resetUrl, 'Reset My Password →')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;margin:20px 0;">
        <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0;line-height:1.7;">⏱ This link expires in <strong style="color:rgba(255,255,255,0.6);">24 hours</strong><br/>🔒 If you did not request this, your account remains secure.</p>
      </div>
      ${bye}
    `);
  }

  const { data, error } = await resend.emails.send({
    from: 'VertexTrade Pro <support@vertextradepro.com>',
    to,
    subject,
    html
  });

  if (error) throw new Error(error.message);
  return { success: true };
};

async function sendChatNotification({ name, email, message }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FRONTEND = process.env.FRONTEND_URL || 'https://vertextradspro.vercel.app';
  await resend.emails.send({
    from: 'VertexTrade Pro <support@vertextradepro.com>',
    to: process.env.ADMIN_EMAIL || 'vertextradespro@gmail.com',
    subject: `New Support Message from ${name || email}`,
    html: `<div style="font-family:sans-serif;background:#0d1117;padding:24px;border-radius:12px;">
      <h3 style="color:white;">New Support Message 💬</h3>
      <p style="color:rgba(255,255,255,0.6);">From: <strong style="color:white;">${name || 'Unknown'}</strong> (${email})</p>
      <div style="background:#1e2538;border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:16px;margin:16px 0;">
        <p style="color:white;margin:0;line-height:1.6;">${message}</p>
      </div>
      <a href="${FRONTEND}/admin" style="background:#6366f1;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">View in Admin →</a>
    </div>`
  });
}

module.exports = sendEmail;
module.exports.sendChatNotification = sendChatNotification;
