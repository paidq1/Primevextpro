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
  { name: "Stripe", img: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Google", img: "https://www.google.com/favicon.ico" },
  { name: "Microsoft", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "AWS", img: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
];

const itemWidth = 56;
const totalItems = logos.length;
const totalWidth = totalItems * itemWidth;
const duration = totalItems * 2;

const PartnersMarquee = () => {
  return (
    <div style={{ overflow: "hidden", width: "100%", paddingTop: "6px", paddingBottom: "6px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        width: (totalWidth * 2) + "px",
        animation: "stepMarquee " + duration + "s steps(" + totalItems + ", end) infinite",
      }}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} style={{
            width: itemWidth + "px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{
              width: "clamp(28px, 7vw, 36px)",
              height: "clamp(28px, 7vw, 36px)",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              <img
                src={logo.img}
                alt={logo.name}
                style={{ width: "clamp(16px, 4vw, 22px)", height: "clamp(16px, 4vw, 22px)", objectFit: "contain" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          </div>
        ))}
      </div>
      <style>{"@keyframes stepMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-" + totalWidth + "px); } }"}</style>
    </div>
  );
};

export default PartnersMarquee;
