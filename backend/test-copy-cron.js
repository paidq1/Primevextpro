const processCopyTradeProfits = require('./utils/copyTradeCron');

console.log('🚀 Testing copy trade cron job...\n');
processCopyTradeProfits()
  .then(() => {
    console.log('\n✅ Copy trade cron job completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
