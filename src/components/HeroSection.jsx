import React, { useEffect, useState } from "react";
import PartnersMarquee from "./PartnersMarquee";
import MarketTicker from "./MarketTicker";
import ForexTicker from "./ForexTicker";

function ParticleNetwork() {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    const particles = [];
    const particleCount = 80;
    const maxLineDistance = 100;
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 1 + 0.8;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();
      }
    }
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", handleMouseMove);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((a, i) => {
        a.update(); a.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLineDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${1.2 * (1 - dist / maxLineDistance)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.x && mouse.y) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.6 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  return <canvas id="particle-canvas" className="absolute inset-0 w-full h-full" />;
}

function Navbar({ onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ position: "relative", zIndex: 9999, background: "transparent" }} className="w-full px-4 py-3">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div style={{ width: 24, height: 24 }}>
            <svg viewBox="0 0 40 40" fill="none" style={{ width: "100%", height: "100%" }}>
              <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
              <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
              <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
            </svg>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap" }}>
            VERTEXTRADE <span style={{ color: "#6366F1" }}>PRO</span>
          </span>
        </div>

        {/* Desktop nav links - hidden on small screens */}
        <div className="hidden sm:flex items-center gap-3 ml-auto mr-3">
          {[['Home','#home'],['Trading','/trading-info'],['Staking','/staking-info'],['Investing','/investing-info']].map(([l,h])=>(
            <a key={l} href={h} style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>{l}</a>
          ))}
          <div style={{ position: "relative" }} className="group">
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
              Company <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div style={{ position: "absolute", top: 24, right: 0, background: "#1a2e4a", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 0", width: 160, zIndex: 9999 }} className="hidden group-hover:block">
              {[['About Us','#why'],['Contact Us','#contact'],['Support','#contact'],['Terms','/terms']].map(([l,h])=>(
                <a key={l} href={h} style={{ display: "block", padding: "6px 14px", fontSize: 12, color: "#ccc", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Get Started - always visible */}
        <button
          onClick={onGetStarted}
          style={{ background: "#6366F1", color: "white", border: "none", padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", borderRadius: 3, flexShrink: 0 }}>
          Get Started
        </button>

        {/* Hamburger - only on small screens */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden"
          style={{ background: "none", border: "none", color: "white", marginLeft: 10, cursor: "pointer", flexShrink: 0 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ background: "#1a2e4a", border: "1px solid rgba(255,255,255,0.1)", marginTop: 8, padding: "12px 0", borderRadius: 4 }}>
          {[['Home','#home'],['Trading','/trading-info'],['Staking','/staking-info'],['Investing','/investing-info'],['About Us','#why'],['Contact','#contact'],['Support','#contact'],['Terms','/terms']].map(([l,h])=>(
            <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 18px", fontSize: 14, color: "#ccc", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function HeroSection({ onGetStarted }) {
  return (
    <section id="home" style={{ position: "relative", paddingBottom: 16, background: "#151c27", overflow: "hidden" }}>
      <ParticleNetwork />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 250, height: 250, background: "radial-gradient(circle at 30% 70%, rgba(120,60,255,0.45) 0%, rgba(100,40,220,0.2) 40%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 1 }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#151c27]/20 via-transparent to-[#151c27]" />

      <Navbar onGetStarted={onGetStarted} />
      <MarketTicker />

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10, paddingTop: 12, paddingLeft: 16, paddingRight: 8 }}>

        {/* Left */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(59,130,246,0.1)", border: "1px solid #3b82f6" }}>
            <span style={{ width: 6, height: 6, background: "#3b82f6", borderRadius: "50%", display: "inline-block" }}></span>
            <span style={{ color: "#93c5fd", fontSize: 11 }}>Trading, Crypto, Staking & Investing</span>
          </div>

          <h1 style={{ color: "white", fontWeight: 800, fontSize: "clamp(16px, 4.5vw, 28px)", lineHeight: 1.25, margin: 0 }}>
            Empower Your <span style={{ color: "#6366F1" }}>Financial</span> Future with Cryptocurrency and Forex Trading
          </h1>

          <p style={{ color: "#9ca3af", fontSize: "clamp(11px, 2.5vw, 14px)", lineHeight: 1.6, margin: 0 }}>
            Experience seamless cryptocurrency and forex trading, high-yield staking, and secure investment opportunities with cutting-edge tools.
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onGetStarted} style={{ background: "#3b82f6", color: "white", border: "none", padding: "10px 18px", fontWeight: 700, fontSize: "clamp(11px, 2.5vw, 14px)", cursor: "pointer", borderRadius: 2 }}>
              Get Started
            </button>
            <button onClick={() => window.location.href="/signin"} style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 18px", fontWeight: 700, fontSize: "clamp(11px, 2.5vw, 14px)", cursor: "pointer", borderRadius: 2 }}>
              Learn More →
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[['400K+','Users','Trust Us'],['24/7','Customer','Supports'],['800k+','Transactions','']].map(([num,l1,l2])=>(
              <div key={num} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: "clamp(14px, 3.5vw, 20px)" }}>{num}</span>
                <div>
                  <div style={{ color: "#9ca3af", fontSize: "clamp(9px, 2vw, 12px)", lineHeight: 1.3 }}>{l1}</div>
                  {l2 && <div style={{ color: "#6b7280", fontSize: "clamp(9px, 2vw, 12px)", lineHeight: 1.3 }}>{l2}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {['Low transaction fees and high liquidity markets','24/7 support from experienced trading professionals','Top-tier security for data and transactions'].map(t=>(
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "#d1d5db", fontSize: "clamp(10px, 2.2vw, 13px)" }}>
                <div style={{ width: 14, height: 14, background: "rgba(59,130,246,0.2)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="9" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div style={{ flexShrink: 0, width: "40%", maxWidth: 200, display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
          <img src="/bg1.png" alt="Trading App" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
        </div>
      </div>

      {/* Forex Ticker */}
      <div style={{ position: "relative", zIndex: 10, marginTop: 12, paddingLeft: 16 }}>
        <ForexTicker />
      </div>
      <div style={{ position: "relative", zIndex: 10, marginTop: 8 }}>
        <PartnersMarquee logoSize="w-6 h-6" />
      </div>
    </section>
  );
}
