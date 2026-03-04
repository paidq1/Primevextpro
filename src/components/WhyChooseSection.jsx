import React from "react";
import { ArrowUpRight } from "lucide-react";
import useScrollAnim from "../hooks/useScrollAnim";

const features = [
  {
    id: "01.",
    title: "Trading",
    description: "Access real-time market data, advanced trading tools, and customized alerts.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <line x1="18" y1="20" x2="18" y2="8"/>
        <line x1="12" y1="20" x2="12" y2="3"/>
        <line x1="6" y1="20" x2="6" y2="13"/>
      </svg>
    ),
  },
  {
    id: "02.",
    title: "Staking",
    description: "Earn competitive staking rewards with our flexible and secure staking options.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <ellipse cx="12" cy="5" rx="8" ry="3"/>
        <path d="M4 5v4c0 1.657 3.582 3 8 3s8-1.343 8-3V5"/>
        <path d="M4 9v4c0 1.657 3.582 3 8 3s8-1.343 8-3V9"/>
        <path d="M4 13v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4"/>
      </svg>
    ),
    highlight: true,
  },
  {
    id: "03.",
    title: "Investing",
    description: "Diversify your portfolio with our expertly managed investment plans.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M12 2a3 3 0 0 1 3 3h2a2 2 0 0 1 2 2v1a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V7a2 2 0 0 1 2-2h2a3 3 0 0 1 3-3z"/>
        <path d="M9 5h6"/>
        <rect x="5" y="13" width="14" height="8" rx="2"/>
      </svg>
    ),
  },
];

const PolyBg = ({ highlight }) => (
  <svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
    <polygon points="0,0 120,60 60,160" fill={highlight ? "rgba(255,255,255,0.08)" : "rgba(60,120,130,0.08)"} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
    <polygon points="120,60 250,0 200,120" fill={highlight ? "rgba(255,255,255,0.05)" : "rgba(40,100,120,0.06)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="0,0 250,0 120,60" fill={highlight ? "rgba(255,255,255,0.03)" : "rgba(80,140,150,0.05)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="60,160 200,120 180,250" fill={highlight ? "rgba(255,255,255,0.07)" : "rgba(50,110,130,0.08)"} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
    <polygon points="0,160 60,160 0,280" fill={highlight ? "rgba(255,255,255,0.04)" : "rgba(70,130,140,0.06)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="200,120 300,80 280,220" fill={highlight ? "rgba(255,255,255,0.06)" : "rgba(90,150,160,0.06)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="60,160 180,250 80,320" fill={highlight ? "rgba(255,255,255,0.05)" : "rgba(45,105,125,0.07)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="180,250 280,220 260,340" fill={highlight ? "rgba(255,255,255,0.04)" : "rgba(65,125,145,0.06)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="0,280 80,320 0,420" fill={highlight ? "rgba(255,255,255,0.03)" : "rgba(90,170,150,0.1)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="80,320 260,340 200,420" fill={highlight ? "rgba(255,255,255,0.05)" : "rgba(70,150,170,0.12)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="250,0 300,0 300,80" fill={highlight ? "rgba(255,255,255,0.04)" : "rgba(100,180,160,0.1)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
    <polygon points="260,340 300,220 300,420" fill={highlight ? "rgba(255,255,255,0.03)" : "rgba(80,160,140,0.1)"} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
  </svg>
);

export default function WhyChooseSection() {
  useScrollAnim();
  return (
    <section id="staking" className="relative w-full py-8 bg-[#0d1117] overflow-hidden">

      

      {/* Floating Crypto - Top Right */}
      <div style={{ position: "absolute", top: "0px", right: "0px", zIndex: 5, width: "120px", height: "100px" }}>
        <div style={{ position: "absolute", top: "-10px", right: "5px", width: "100px", height: "100px", background: "radial-gradient(circle at 50% 50%, rgba(220,220,255,0.6) 0%, rgba(180,180,220,0.3) 35%, transparent 70%)", borderRadius: "50%", filter: "blur(22px)" }}></div>
        <svg width="120" height="100" viewBox="0 0 120 100" style={{ position: "absolute", top: 0, left: 0 }}>
          <line x1="27" y1="27" x2="98" y2="67" stroke="rgba(150,120,255,0.8)" strokeWidth="1.8" strokeDasharray="3,2"/>
        </svg>
        <img src="https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" alt="TRX" style={{ position: "absolute", top: "20px", left: "20px", width: "14px", height: "14px", borderRadius: "50%" }} />
        <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" style={{ position: "absolute", top: "60px", right: "15px", width: "14px", height: "14px", borderRadius: "50%" }} />
      </div>

                                                      {/* Particle Network - Top Left */}
      <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 1, width: '80px', height: '80px' }}>
        <svg width='80' height='80' viewBox='0 0 80 80'>
          <line x1='32' y1='35' x2='0' y2='16' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.7'/>
          <line x1='32' y1='35' x2='0' y2='50' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.7'/>
          <line x1='32' y1='35' x2='55' y2='0' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.7'/>
          <line x1='32' y1='35' x2='80' y2='22' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.7'/>
          <line x1='32' y1='35' x2='40' y2='80' stroke='#4a5fc1' strokeWidth='0.5' opacity='0.7'/>
          <line x1='0' y1='16' x2='0' y2='50' stroke='#4a5fc1' strokeWidth='0.4' opacity='0.95'/>
          <line x1='0' y1='16' x2='55' y2='0' stroke='#4a5fc1' strokeWidth='0.4' opacity='0.95'/>
          <circle cx='32' cy='35' r='3' fill='#5b6fd4' opacity='0.95'/>
          <circle cx='0' cy='16' r='1.5' fill='#4a5fc1' opacity='0.9'/>
          <circle cx='0' cy='50' r='1.5' fill='#4a5fc1' opacity='0.9'/>
          <circle cx='55' cy='0' r='1.5' fill='#4a5fc1' opacity='0.9'/>
          <circle cx='80' cy='22' r='1.5' fill='#4a5fc1' opacity='0.9'/>
          <circle cx='40' cy='80' r='1.5' fill='#4a5fc1' opacity='0.9'/>
        </svg>
      </div>
      <div className="relative z-10 px-3">
        <div className="text-center mb-6 scroll-anim">
          <h2 className="text-lg font-bold text-white mb-2">Why Choose Our Platform?</h2>
          <p className="text-gray-400 text-[10px] max-w-xs mx-auto leading-relaxed">
            Explore the advanced features that make us the best choice for cryptocurrency and forex traders, investors, and stakers.
          </p>
        </div>

        <div className="flex flex-row gap-2 scroll-anim delay-2">
          {features.map((feature, idx) => (
            <div
              key={idx} className={"scroll-anim delay-" + (idx+3)}
              style={{
                position: "relative",
                flex: 1,
                borderRadius: "3px",
                overflow: "hidden",
                background: feature.highlight ? "#4f46e5" : "#1f3b4d",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "8px 12px 12px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "160px",
              }}
            >
              <PolyBg highlight={feature.highlight} />
              <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#60a5fa", fontWeight: "bold", fontSize: "9px", display: "block", marginBottom: "2px" }}>{feature.id}</span>
                <h3 style={{ color: "white", fontWeight: "bold", fontSize: "12px", marginBottom: "4px" }}>{feature.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", lineHeight: "1.4", flex: 1, marginBottom: "0" }}>{feature.description}</p>
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
                <button style={{ color: "rgba(255,255,255,0.8)", fontSize: "9px", textDecoration: "underline", display: "flex", alignItems: "center", gap: "2px" }} onClick={() => window.location.href="/signin"}>
                  Learn More <ArrowUpRight size={10} />
                </button>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: feature.highlight ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white"
                }}>
                  {feature.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
