const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  // Send to verified email with recipient info in subject until domain verified
  const { data, error } = await resend.emails.send({
    from: 'VertexTrade Pro <onboarding@resend.dev>',
    to: 'primevextpro@gmail.com', // Only verified email works on free plan
    subject: `[FOR: ${to}] ${subject}`,
    html: `<div style="background:#f59e0b;padding:8px;margin-bottom:16px;font-size:12px;"><strong>⚠️ Forward this email to: ${to}</strong></div>` + html,
  });
  if (error) throw new Error(error.message);
  return data;
};

module.exports = sendEmail;
