const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri).then(async () => {
  const Trader = require('./models/Trader');

  const bios = {
    'Ross Cameron': "A full-time day trader and founder of Warrior Trading, a trading education platform. Ross is known for his small account challenge and momentum trading strategy. He specializes in low-priced, high-volume stocks with a focus on breakouts, momentum, and volume analysis.",
    'Rayner Teo': "A professional trader and author from Singapore. Rayner specializes in price action trading, candlestick patterns, and support/resistance strategies. He is the founder of TradingwithRayner and has taught over 10,000 students worldwide.",
    'Kathy Lien': "Managing Director of FX Strategy at BK Asset Management. Kathy is a renowned forex expert and author of several trading books. She specializes in forex trading with a focus on fundamental analysis and central bank policies.",
    'Timothy Sykes': "A well-known penny stock trader and entrepreneur who turned $12,415 into over $1 million. He runs a trading education platform and is known for his aggressive short-selling strategies in small-cap stocks.",
    'Nicola Duke': "A UK-based forex trader and educator specializing in technical analysis and price action trading. Nicola is known for her structured approach to trading forex markets, particularly GBPUSD and EURUSD pairs.",
    'Anton Kreil': "A former Goldman Sachs trader and founder of the Institute of Trading and Portfolio Management (ITPM). Anton has over 20 years of professional trading experience and has trained thousands of traders worldwide.",
    'Nial Fuller': "An Australian forex trader and educator widely regarded as one of the leading authorities on price action trading. Nial founded Learn To Trade The Market and his philosophy centers on simplicity and patience.",
    'Anne-Marie Baiynd': "A seasoned trader, author, and market analyst based in Texas. Anne-Marie is the author of The Trading Book and is known for her expertise in technical analysis and options trading.",
    'Mark Minervini': "A US Investing Champion and author of Trade Like a Stock Market Wizard. Mark is known for his SEPA (Specific Entry Point Analysis) trading methodology, focusing on high-growth stocks with strong momentum.",
    'Peter Brandt': "A veteran commodities trader with over 40 years of experience. Peter is known for his classical charting approach and has been trading futures and forex markets since the 1970s.",
    'Linda Raschke': "A professional trader with over 30 years of experience in futures and equities. Linda is known for her short-term trading strategies and is a former member of the Philadelphia Stock Exchange.",
    'Paul Tudor Jones': "Founder of Tudor Investment Corp and one of the most successful macro traders in history. Paul is known for predicting the 1987 market crash and his focus on global macro trading strategies.",
    'Steve Burns': "A trading educator and author who focuses on trend following and risk management. Steve runs New Trader U, a popular trading education platform helping retail traders develop systematic approaches.",
    'Adam Grimes': "A professional trader, author, and educator specializing in technical analysis and quantitative trading. Adam is known for his rigorous, research-based approach to market analysis.",
    'Tom Hougaard': "A professional trader and author of Best Loser Wins. Tom is known for his contrarian approach to trading psychology and his focus on mastering the mental aspects of trading.",
    'Oliver Velez': "Co-founder of Pristine.com and a renowned trading educator. Oliver specializes in technical analysis, day trading, and swing trading strategies with a focus on price action.",
    'Dan Zanger': "A world record holder for portfolio performance, turning $10,775 into $18 million in 18 months. Dan specializes in momentum trading and breakout strategies in high-growth stocks.",
    'Jesse Livermore': "One of the greatest traders of all time, known for making $100 million during the 1929 market crash. His trading principles of trend following and position sizing remain relevant today.",
  };

  const traders = await Trader.find();
  console.log(`Found ${traders.length} traders in DB`);

  for (const trader of traders) {
    const bio = bios[trader.name];
    if (bio) {
      await Trader.updateOne({ _id: trader._id }, { $set: { bio } });
      console.log(`✅ Updated bio for ${trader.name}`);
    } else {
      console.log(`⚠️  No bio found for ${trader.name}`);
    }
  }

  console.log('Done!');
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
