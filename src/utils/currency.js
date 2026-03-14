const currencyMap = {
  'US Dollar (USD)':        { symbol: '$',  code: 'USD', rate: 1 },
  'Euro (EUR)':             { symbol: '€',  code: 'EUR', rate: 0.92 },
  'British Pound (GBP)':    { symbol: '£',  code: 'GBP', rate: 0.79 },
  'Indian Rupee (INR)':     { symbol: '₹',  code: 'INR', rate: 83.5 },
  'Nigerian Naira (NGN)':   { symbol: '₦',  code: 'NGN', rate: 1580 },
  'Canadian Dollar (CAD)':  { symbol: 'C$', code: 'CAD', rate: 1.36 },
  'Australian Dollar (AUD)':{ symbol: 'A$', code: 'AUD', rate: 1.53 },
  'Japanese Yen (JPY)':     { symbol: '¥',  code: 'JPY', rate: 149.5 },
  'Swiss Franc (CHF)':      { symbol: 'Fr', code: 'CHF', rate: 0.90 },
  'Chinese Yuan (CNY)':     { symbol: '¥',  code: 'CNY', rate: 7.24 },
};

export const getCurrencySymbol = (currency) => {
  return currencyMap[currency]?.symbol || '$';
};

export const convertAmount = (amountUSD, currency) => {
  const rate = currencyMap[currency]?.rate || 1;
  return (amountUSD * rate).toFixed(2);
};

export const formatAmount = (amountUSD, currency) => {
  const symbol = getCurrencySymbol(currency);
  const converted = convertAmount(amountUSD, currency);
  return `${symbol}${Number(converted).toLocaleString()}`;
};
