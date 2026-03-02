const sendEmail = async ({ to, subject, html }) => {
  console.log(`Email to ${to}: ${subject}`);
  return { success: true };
};

module.exports = sendEmail;
