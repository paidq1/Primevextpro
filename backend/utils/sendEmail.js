const { Resend } = require('resend');

const baseTemplate = (content) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d;">
  
  <!-- Header Banner -->
  <div style="background: #0d0d0d; padding: 16px 20px; border-bottom: 1px solid #1e293b;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:middle;padding-right:4px"><img src="https://vertextradspro.vercel.app/logo.png" width="42" height="42" style="display:block" alt="VertexTrade Pro"/></td>
<td style="vertical-align:middle"><span style="color:white;font-size:16px;font-weight:700;letter-spacing:0.3px">VertexTrade <span style="color:#6366f1">Pro</span></span></td>
</tr></table>
  </div>
  <div style="height: 1px; background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div>

  <!-- Body -->
  <div style="padding: 36px 32px; background: #0d0d0d;">
    ${content}
  </div>

  <!-- Divider -->
  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent); margin: 0 32px;"></div>

  <!-- Footer -->
  <div style="background: #0d0d0d; padding: 24px 32px; text-align: center;">
    <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 8px; font-weight: 500;">VertexTrade Pro — Smart Investment Brokers</p>
    <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 0 0 12px;">
      <a href="https://vertextradspro.vercel.app" style="color: #6366f1; text-decoration: none;">vertextradspro.vercel.app</a>
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

const currencyMap = {
  'US Dollar (USD)': '$', 'Euro (EUR)': '€', 'British Pound (GBP)': '£',
  'Indian Rupee (INR)': '₹', 'Nigerian Naira (NGN)': '₦', 'Canadian Dollar (CAD)': 'C$',
  'Australian Dollar (AUD)': 'A$', 'Japanese Yen (JPY)': '¥', 'Swiss Franc (CHF)': 'Fr',
  'Chinese Yuan (CNY)': '¥',
};

const getRates = () => ({
  'US Dollar (USD)': 1, 'Euro (EUR)': 0.92, 'British Pound (GBP)': 0.79,
  'Indian Rupee (INR)': 83.5, 'Nigerian Naira (NGN)': 1580, 'Canadian Dollar (CAD)': 1.36,
  'Australian Dollar (AUD)': 1.53, 'Japanese Yen (JPY)': 149.5, 'Swiss Franc (CHF)': 0.90,
  'Chinese Yuan (CNY)': 7.24,
});

const formatCurrency = (amountUSD, userCurrency) => {
  const symbol = currencyMap[userCurrency] || '$';
  const rate = getRates()[userCurrency] || 1;
  const converted = (amountUSD * rate).toFixed(2);
  return `${symbol}${Number(converted).toLocaleString()}`;
};

const sendEmail = async ({ to, type, name, resetUrl, verifyUrl, amount, currency, reason, message, package: pkg, planDetails, code, botName, totalEarned, newBalance, stakePlan, subject: customSubject }) => {
  const userCurrency = currency || 'US Dollar (USD)';
  const currSymbol = currencyMap[userCurrency] || '$';
  const formattedAmount = amount ? formatCurrency(parseFloat(amount), userCurrency) : '';
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FRONTEND = process.env.FRONTEND_URL;
  let subject, html;

  if (type === 'welcome') {
    subject = 'Welcome to VertexTrade Pro!';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Welcome aboard, ${name}! 🚀</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your account is ready</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 16px;line-height:1.7">We're excited to have you join our growing trading community. Your account has been successfully created, and you now have access to our platform where you can explore different trading opportunities and investment plans.</p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 16px;line-height:1.7">At VertexTrade Pro, our goal is to provide a smooth, secure, and rewarding trading experience for all our users. From your dashboard, you will be able to manage your account, monitor your investments, and stay updated with the latest opportunities on the platform.</p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">If you need any assistance or have questions, our Support Team is always available to help. Thank you for choosing VertexTrade Pro. We look forward to being part of your trading journey.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:24px;margin:24px 0">
        <p style="color:white;margin:0 0 16px;font-size:14px;font-weight:600;letter-spacing:0.3px">GET STARTED IN 4 STEPS</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px"><span style="color:#6366f1;font-weight:700;margin-right:10px">01</span>Complete your KYC verification</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">02</span>Make your first deposit</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">03</span>Choose an investment package</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">04</span>Start earning daily profits</td></tr>
        </table>
      </div>
      <div style="background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(234,179,8,0.08));border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:20px;margin:24px 0">
        <p style="color:#f59e0b;font-size:13px;font-weight:700;margin:0 0 10px">Payment Required to Activate Plan</p>
        <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 10px;line-height:1.7">To activate your <strong style="color:white">${pkg}</strong> plan and unlock full trading access, a one-time upgrade fee of <strong style="color:#f59e0b">$${pd.upgradeFee?.toLocaleString() || 'N/A'}</strong> is required.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 10px;line-height:1.7">Please proceed to your dashboard and make a deposit of <strong style="color:white">$${pd.upgradeFee?.toLocaleString() || 'N/A'}</strong> to complete your account upgrade.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0;line-height:1.7">Once your payment is confirmed, your account will be fully activated and you can start trading immediately. If you need assistance, please contact our support team.</p>
      </div>
      ${btn(`${FRONTEND}/dashboard/deposit`, 'Make Payment Now')}
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
        <p style="color:#22c55e;font-size:38px;font-weight:800;margin:0;letter-spacing:-0.5px">${formattedAmount}</p>
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
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Unfortunately, we were unable to process your deposit of <strong style="color:white">${formattedAmount}</strong> at this time.</p>
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
        <p style="color:#22c55e;font-size:38px;font-weight:800;margin:0;letter-spacing:-0.5px">${formattedAmount}</p>
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
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Unfortunately, your withdrawal of <strong style="color:white">${formattedAmount}</strong> could not be processed at this time.</p>
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
    subject = customSubject || resetUrl || 'Message from VertexTrade Pro';
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

  } else if (type === 'botProfit') {
    subject = `Profit Credited to Your Account - VertexTrade Pro`;
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Bot Profit Notification</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Profit successfully credited to your account</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">We're pleased to inform you that your <strong style="color:white">${botName || 'Trading Bot'}</strong> has successfully generated a trading profit. The profit has been credited directly to your account balance.</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px;margin:24px 0">
        <p style="color:white;font-size:14px;font-weight:700;margin:0 0 14px">Profit Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Profit Credited</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:700;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">+$${amount}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Bot Name</td><td style="padding:10px 0;color:white;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">${botName || 'Trading Bot'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Total Earned</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${totalEarned || '0'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">New Account Balance</td><td style="padding:10px 0;color:white;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${newBalance || '0'}</td></tr>
        </table>
      </div>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 24px;line-height:1.7">You can log in to your account dashboard at any time to view your updated balance and monitor your trading activity.</p>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard')}
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;line-height:1.7;text-align:center">Thank you for choosing VertexTrade Pro for your trading and investment needs.</p>
      ${regards}`);

  } else if (type === 'stakeProfit') {
    subject = `Staking Profit Credited - VertexTrade Pro`;
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Staking Profit Notification</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Profit successfully credited to your account</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Your <strong style="color:white">${planDetails?.plan || stakePlan || 'Staking'}</strong> plan has generated a profit. The amount has been credited to your account balance.</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px;margin:24px 0">
        <p style="color:white;font-size:14px;font-weight:700;margin:0 0 14px">Profit Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Profit Credited</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:700;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">+$${amount}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Stake Plan</td><td style="padding:10px 0;color:white;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">${planDetails?.plan || stakePlan || 'N/A'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Total Earned</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${totalEarned || '0'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">New Account Balance</td><td style="padding:10px 0;color:white;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${newBalance || '0'}</td></tr>
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard`, 'View Dashboard')}
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;line-height:1.7;text-align:center">Thank you for choosing VertexTrade Pro for your trading and investment needs.</p>
      ${regards}`);

  } else if (type === 'stakeCompleted') {
    subject = `Staking Completed - Principal Returned - VertexTrade Pro`;
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Staking Completed!</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your stake has matured</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Your <strong style="color:white">${planDetails?.plan || stakePlan || 'Staking'}</strong> plan has successfully completed. Your principal amount has been returned to your account balance.</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px;margin:24px 0">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Principal Returned</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:700;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${amount}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">Total Earned</td><td style="padding:10px 0;color:#22c55e;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${totalEarned || '0'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)">New Account Balance</td><td style="padding:10px 0;color:white;font-size:13px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${newBalance || '0'}</td></tr>
        </table>
      </div>
      ${btn(`${FRONTEND}/dashboard/stake`, 'Stake Again')}
      ${regards}`);

  } else if (type === 'registrationFee') {
    subject = 'Complete Your Account Setup at VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Complete Your Account Setup</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">One-time registration fee required</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Welcome to VertexTrade Pro! We're excited to have you join our trading community.</p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">To activate your account and gain full access to all trading features, a one-time registration fee of <strong style="color:#f59e0b;font-size:16px">${formattedAmount}</strong> is required. This ensures your account is fully verified and ready for trading.</p>
      
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:24px;margin:24px 0">
        <p style="color:white;font-size:14px;font-weight:700;margin:0 0 16px">How to Proceed</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">01</span>Contact our Support Team for payment instructions</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">02</span>Complete the payment of <strong style="color:#f59e0b">${formattedAmount}</strong> using the method provided</td></tr>
          <tr><td style="padding:10px 0;color:rgba(255,255,255,0.7);font-size:13px;border-top:1px solid rgba(255,255,255,0.05)"><span style="color:#6366f1;font-weight:700;margin-right:10px">03</span>Your account will be activated immediately after confirmation</td></tr>
        </table>
      </div>

      <div style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.15);border-radius:10px;padding:16px;margin:24px 0">
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;line-height:1.7">🔒 Please rest assured that the registration process is secure and standard for all new users. Our team is here to guide you step by step to ensure a smooth experience.</p>
      </div>

      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">If you have any questions or need assistance, don't hesitate to reach out to Support.</p>
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard')}
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;text-align:center;line-height:1.7">Thank you for choosing VertexTrade Pro — we look forward to supporting your trading journey!</p>
      ${regards}`);

  } else if (type === 'upgradePromo') {
    subject = 'Upgrade Your Account & Unlock Exclusive Benefits at VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Upgrade Your Account</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Unlock Exclusive Benefits at VertexTrade Pro</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Take your trading to the next level with VertexTrade Pro's account upgrades. Choose the plan that suits your goals and unlock higher returns, exclusive tools, and premium support.</p>

      ${[
        { name: 'BRONZE', fee: '$1,000', minDeposit: '$500', minWithdraw: '$500', roi: '10%', duration: '7 days', features: ['Basic trading access', 'Standard support'] },
        { name: 'SILVER', fee: '$5,000', minDeposit: '$5,000', minWithdraw: '$1,000', roi: '15%', duration: '14 days', features: ['Advanced trading tools', 'Priority support', 'Referral bonuses'] },
        { name: 'GOLD', fee: '$10,000', minDeposit: '$10,000', minWithdraw: '$2,000', roi: '20%', duration: '21 days', features: ['Premium trading tools', 'Dedicated account manager', 'Higher referral bonuses'] },
        { name: 'PLATINUM', fee: '$25,000', minDeposit: '$25,000', minWithdraw: '$5,000', roi: '25%', duration: '30 days', features: ['VIP trading suite', 'Personal account manager', 'Weekly profit reports'] },
        { name: 'DIAMOND', fee: '$50,000', minDeposit: '$50,000', minWithdraw: '$10,000', roi: '30%', duration: '45 days', features: ['Exclusive trading signals', '24/7 VIP support', 'Automated profit reinvestment'] },
        { name: 'ELITE', fee: '$100,000', minDeposit: '$100,000', minWithdraw: '$20,000', roi: '40%', duration: '60 days', features: ['Full platform access', 'Private trading desk', 'Custom investment strategies', 'Direct CEO line'] },
      ].map(p => `
        <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:20px;margin:0 0 16px">
          <p style="color:white;font-size:16px;font-weight:800;margin:0 0 4px;letter-spacing:1px">${p.name} <span style="color:#6366f1;font-size:13px;font-weight:600">— ${p.fee} Upgrade Fee</span></p>
          <div style="height:1px;background:rgba(99,102,241,0.2);margin:10px 0"></div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
            <tr><td style="color:rgba(255,255,255,0.5);font-size:11px;padding:4px 0">Minimum Deposit</td><td style="color:white;font-size:11px;font-weight:600;text-align:right">${p.minDeposit}</td></tr>
            <tr><td style="color:rgba(255,255,255,0.5);font-size:11px;padding:4px 0">Minimum Withdrawal</td><td style="color:white;font-size:11px;font-weight:600;text-align:right">${p.minWithdraw}</td></tr>
            <tr><td style="color:rgba(255,255,255,0.5);font-size:11px;padding:4px 0">Daily ROI</td><td style="color:#22c55e;font-size:11px;font-weight:600;text-align:right">${p.roi}</td></tr>
            <tr><td style="color:rgba(255,255,255,0.5);font-size:11px;padding:4px 0">Duration</td><td style="color:white;font-size:11px;font-weight:600;text-align:right">${p.duration}</td></tr>
          </table>
          ${p.features.map(f => `<p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0 0 4px;padding-left:8px">✅ ${f}</p>`).join('')}
        </div>
      `).join('')}

      <div style="background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(234,179,8,0.08));border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:20px;margin:24px 0;text-align:center">
        <p style="color:#f59e0b;font-size:15px;font-weight:700;margin:0 0 8px">Ready to Upgrade?</p>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 16px;line-height:1.7">Contact our Support Team today to choose your upgrade plan and start maximizing your profits.</p>
        ${btn(`${FRONTEND}/dashboard`, 'Upgrade Now')}
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:16px 0 0;line-height:1.7;text-align:center">Thank you for trusting VertexTrade Pro — your journey to smarter trading begins here.</p>
      ${regards}`);

  } else if (type === 'planUpgrade') {
    const pd = planDetails || {};
    subject = `Your Account Has Been Upgraded to ${pkg} - VertexTrade Pro`;
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Plan Upgrade Successful!</h2>
      <p style="color:#22c55e;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your account has been upgraded</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Congratulations! Your account has been successfully upgraded to the <strong style="color:white">${pkg}</strong> plan. Below are your plan details.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:28px;margin:24px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase">Current Plan</p>
        <p style="color:#6366f1;font-size:32px;font-weight:800;margin:0;letter-spacing:2px">${pkg}</p>
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:8px 0 0">VertexTrade Pro Premium Member</p>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px;margin:24px 0">
        <p style="color:white;font-size:13px;font-weight:700;margin:0 0 14px;letter-spacing:0.3px">Plan Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Upgrade Fee</td><td style="padding:8px 0;color:white;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${pd.upgradeFee?.toLocaleString() || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Minimum Deposit</td><td style="padding:8px 0;color:white;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${pd.minDeposit?.toLocaleString() || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Minimum Withdrawal</td><td style="padding:8px 0;color:white;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">$${pd.minWithdrawal?.toLocaleString() || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Daily ROI</td><td style="padding:8px 0;color:#22c55e;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">${pd.roi || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Duration</td><td style="padding:8px 0;color:white;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">${pd.duration || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:12px;border-top:1px solid rgba(255,255,255,0.05)">Max Return</td><td style="padding:8px 0;color:#f59e0b;font-size:12px;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.05)">${pd.maxReturn || 'N/A'}</td></tr>
        </table>
      </div>
      ${pd.features ? `<div style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.15);border-radius:10px;padding:20px;margin:24px 0">
        <p style="color:white;font-size:13px;font-weight:700;margin:0 0 12px">Plan Features</p>
        ${pd.features.map(f => `<p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 8px;padding-left:12px">✅ ${f}</p>`).join('')}
      </div>` : ''}
      ${btn(`${FRONTEND}/dashboard`, 'Go to Dashboard')}
      ${regards}`);

  } else if (type === 'withdrawalCode') {
    subject = 'Your Withdrawal Code - VertexTrade Pro';
    html = baseTemplate(`
      <h2 style="color:white;margin:0 0 8px;font-size:22px;font-weight:700">Withdrawal Code</h2>
      <p style="color:#6366f1;font-size:13px;margin:0 0 24px;font-weight:500;letter-spacing:0.3px">Your secure withdrawal code</p>
      ${greeting(name)}
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;line-height:1.7">Your withdrawal code has been generated. Use the code below to complete your withdrawal request.</p>
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:28px;margin:24px 0;text-align:center">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase">Your Withdrawal Code</p>
        <p style="color:white;font-size:36px;font-weight:800;margin:0;letter-spacing:8px">${code}</p>
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:8px 0 0">Keep this code safe and do not share it with anyone</p>
      </div>
      ${btn(`${FRONTEND}/dashboard/withdraw`, 'Withdraw Now')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:16px;margin:24px 0">
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.6">🔒 Never share this code with anyone including VertexTrade Pro staff.<br/>⚠️ If you did not request this, please contact support immediately.</p>
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
