import React, { useEffect, useState } from "react";

export default function ForexTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data.slice(0, 2));
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "4px" }}>
      {coins.map((coin, i) => {
        const isUp = coin.price_change_percentage_24h >= 0;
        return (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <img src={coin.image} alt={coin.name} style={{ width: "8px", height: "8px", borderRadius: "50%" }} />
            <span style={{ color: "white", fontSize: "7px", fontWeight: 500 }}>{coin.symbol.toUpperCase()} to USD</span>
            <span style={{ fontSize: "7px", color: isUp ? "#00c896" : "#ff3b69" }}>
              {isUp ? "+" : ""}{coin.price_change_24h?.toFixed(2)} ({isUp ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
