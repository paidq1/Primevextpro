import React from "react";

const logos = [
  { name: "Binance", img: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  { name: "Coinbase", img: "https://assets.coingecko.com/markets/images/23/small/coinbase.png" },
  { name: "Ethereum", img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { name: "Bitcoin", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { name: "Solana", img: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { name: "Ripple", img: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  { name: "Chainlink", img: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
  { name: "Polygon", img: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
  { name: "MetaMask", img: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" },
  { name: "TRON", img: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" },
  { name: "AWS", img: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Google", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Stripe", img: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
];

const LogoItem = ({ logo }) => (
  <div style={{
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden', marginRight: '32px'
  }}>
    <img
      src={logo.img}
      alt={logo.name}
      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
      onError={e => { e.target.style.display = 'none'; }}
    />
  </div>
);

const PartnersMarquee = () => {
  return (
    <div style={{ overflow: 'hidden', width: '100%', paddingTop: '6px', paddingBottom: '6px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        animation: 'marquee 20s linear infinite',
        width: 'max-content'
      }}>
        {[...logos, ...logos].map((logo, i) => <LogoItem key={i} logo={logo} />)}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default PartnersMarquee;
