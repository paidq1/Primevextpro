const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri).then(async () => {
  const Trader = require('./models/Trader');
  
  const bios = {
    'Ross Cameron': "A full-time day trader and the founder of Warrior Trading, a trading education platform and community that teaches people how to trade stocks. Ross is known for his small account challenge and momentum trading strategy. He has been trading for over 10 years and specializes in low-priced, high-volume stocks. His strategy focuses on breakouts, momentum, and volume analysis.",
    'Rayner Teo': "A professional trader and author from Singapore. Rayner specializes in price action trading, candlestick patterns, and support/resistance strategies. He is the founder of TradingwithRayner and has taught over 10,000 students worldwide. His trading style is conservative with a focus on risk management.",
    'Kathy Lien': "Managing Director of FX Strategy at BK Asset Management, Kathy is a renowned forex expert and author of several trading books. She specializes in forex trading with a focus on fundamental analysis and central bank policies.",
    'Timothy Sykes': "A well-known penny stock trader and entrepreneur. Timothy turned $12,415 into over $1 million trading penny stocks. He runs a trading education platform and is known for his aggressive short-selling strategies."
  };
  
  for (const [name, bio] of Object.entries(bios)) {
    await Trader.updateOne({ name: name }, { $set: { bio: bio } });
    console.log(`Updated bio for ${name}`);
  }
  
  console.log('✅ Done updating trader bios');
  process.exit();
}).catch(err => console.error(err));
