import React, { useEffect, useState } from "react";

export default function MarketTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    }
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const tickerCoins = [...coins, ...coins, ...coins];

  return (
    <div style={{ overflow: "hidden", width: "100%", height: "18px" }} className="relative z-20">
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        height: "18px",
        animation: "tickerScroll 40s linear infinite",
        whiteSpace: "nowrap"
      }}>
        {tickerCoins.map((coin, i) => {
          const isUp = coin.price_change_percentage_24h >= 0;
          return (
            <React.Fragment key={i}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                paddingLeft: "8px",
                paddingRight: "8px",
                flexShrink: 0
              }}>
                <img src={coin.image} alt={coin.name} style={{ width: "9px", height: "9px", borderRadius: "50%" }} />
                <span style={{ color: "white", fontWeight: 600, fontSize: "8px" }}>{coin.name}</span>
                <span style={{ color: "#848e9c", fontSize: "7px" }}>{coin.symbol.toUpperCase()}</span>
                <span style={{ color: "white", fontSize: "8px" }}>${coin.current_price.toLocaleString()}</span>
                <span style={{ fontSize: "7px", color: isUp ? "#00c896" : "#ff3b69" }}>
                  {isUp ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px", flexShrink: 0 }}>|</span>
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
