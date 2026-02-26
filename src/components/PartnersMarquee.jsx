import React, { useEffect, useRef } from "react";

const logos = [
  { name: "AWS", bg: "#ff9900", content: "AWS" },
  { name: "Binance", bg: "#f0b90b", content: "BNB" },
  { name: "Coinbase", bg: "#0052ff", content: "C" },
  { name: "IBM", bg: "#054ada", content: "IBM" },
  { name: "TRON", bg: "#ff060a", content: "TRX" },
  { name: "Ripple", bg: "#23292f", content: "XRP" },
  { name: "Google", bg: "#4285f4", content: "G" },
  { name: "MetaMask", bg: "#f6851b", content: "Meta" },
  { name: "Chainlink", bg: "#375bd2", content: "LINK" },
  { name: "Solana", bg: "#9945ff", content: "SOL" },
  { name: "Polygon", bg: "#8247e5", content: "MATIC" },
  { name: "Ethereum", bg: "#627eea", content: "ETH" },
  { name: "Bitcoin", bg: "#f7931a", content: "₿" },
  { name: "Oracle", bg: "#c74634", content: "ORA" },
  { name: "Stripe", bg: "#635bff", content: "STR" },
  { name: "Microsoft", bg: "#00a4ef", content: "MS" },
];

const ITEM_WIDTH = 68;

const LogoItem = ({ logo }) => (
  <div style={{
    width: "28px", height: "28px", borderRadius: "50%",
    background: logo.bg, border: logo.bg === "white" ? "1px solid #ccc" : "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, overflow: "hidden", marginRight: "40px"
  }}>
    <span style={{ color: "white", fontWeight: "bold", fontSize: "6px" }}>{logo.content}</span>
  </div>
);

const PartnersMarquee = () => {
  const posRef = useRef(0);
  const trackRef = useRef(null);
  const totalWidth = logos.length * ITEM_WIDTH;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      posRef.current -= ITEM_WIDTH;
      if (Math.abs(posRef.current) >= totalWidth) {
        track.style.transition = "none";
        track.style.transform = `translateX(0px)`;
        posRef.current = 0;
        track.getBoundingClientRect();
        track.style.transition = "transform 0.4s ease";
      } else {
        track.style.transition = "transform 0.4s ease";
        track.style.transform = `translateX(${posRef.current}px)`;
      }
    };

    const interval = setInterval(step, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ overflow: "hidden", width: "100%", paddingTop: "6px", paddingBottom: "6px" }}>
      <div ref={trackRef} style={{
        display: "flex", alignItems: "center", whiteSpace: "nowrap",
        willChange: "transform"
      }}>
        {[...logos, ...logos].map((logo, i) => <LogoItem key={i} logo={logo} />)}
      </div>
    </div>
  );
};

export default PartnersMarquee;
