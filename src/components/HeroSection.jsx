import React, { useEffect } from "react";
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
    const particleCount = 90;
    const maxLineDistance = 70;
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.radius = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,210,255,0.6)";
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
            ctx.strokeStyle = `rgba(200,210,255,${0.85 * (1 - dist / maxLineDistance)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.x && mouse.y) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.3 * (1 - dist / 180)})`;
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
  return (
    <nav style={{ position: "relative", zIndex: 9999 }} className="relative z-20 w-full px-3 pt-2 pb-2">
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div style={{ width: "clamp(12px, 3vw, 24px)", height: "clamp(12px, 3vw, 24px)" }}>
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.5"/>
              <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" strokeWidth="1.2"/>
              <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1"/>
            </svg>
          </div>
          <span style={{ fontSize: "clamp(7px, 1.8vw, 10px)" }} className="text-white font-bold tracking-wider whitespace-nowrap">
            VERTEXTRADE <span className="bg-gradient-to-r from-[#6366F1] to-[#6366F1] bg-clip-text text-transparent">PRO</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center ml-auto flex-shrink-0 flex-nowrap" style={{ gap: "clamp(2px, 1vw, 6px)" }}>
          <a href="#home" style={{ fontSize: "clamp(7px, 1.8vw, 15px)" }} className="text-white font-medium relative whitespace-nowrap">
            Home
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></span>
          </a>
          <a href="/trading-info" style={{ fontSize: "clamp(7px, 1.8vw, 15px)" }} className="text-gray-300 hover:text-white font-medium transition-colors whitespace-nowrap">Trading</a>
          <a href="/staking-info" style={{ fontSize: "clamp(7px, 1.8vw, 15px)" }} className="text-gray-300 hover:text-white font-medium transition-colors whitespace-nowrap">Staking</a>
          <a href="/investing-info" style={{ fontSize: "clamp(7px, 1.8vw, 15px)" }} className="text-gray-300 hover:text-white font-medium transition-colors whitespace-nowrap">Investing</a>

          <div style={{ position: 'relative' }} className="group">
            <button style={{ fontSize: "clamp(7px, 1.8vw, 15px)" }} className="flex items-center gap-0.5 text-gray-300 hover:text-white font-medium transition-colors whitespace-nowrap">
              Links<svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div style={{ position: "absolute", top: "24px", left: 0, background: "#1a2e4a", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 0", width: "144px", zIndex: 9999 }} className="hidden group-hover:block">
              {[['Market','#market'],['How It Works','#how'],['Benefits','#why'],['Investment Plans','/investing-info'],["FAQ's",'#faq']].map(([l,h])=>(
                <a key={l} href={h} className="block px-3 py-1.5 text-[10px] text-gray-300 hover:text-white hover:bg-white/5">{l}</a>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }} className="group">
            <button style={{ fontSize: "clamp(8px, 2vw, 15px)" }} className="flex items-center gap-0.5 text-gray-300 hover:text-white font-medium transition-colors whitespace-nowrap">
              Company<svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div style={{ position: "absolute", top: "24px", left: 0, background: "#1a2e4a", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 0", width: "144px", zIndex: 9999 }} className="hidden group-hover:block">
              {[['About Us','#why'],['Contact Us','#contact'],['Support','#contact'],['Terms & Conditions','/terms']].map(([l,h])=>(
                <a key={l} href={h} className="block px-3 py-1.5 text-[10px] text-gray-300 hover:text-white hover:bg-white/5">{l}</a>
              ))}
            </div>
          </div>

          <button
            style={{ fontSize: "clamp(6px, 1.6vw, 14px)", padding: "clamp(2px, 0.6vw, 4px) clamp(4px, 1vw, 7px)" }}
            className="bg-[#6366F1] hover:bg-[#5558E0] text-white rounded-sm font-semibold transition-colors whitespace-nowrap"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function HeroSection({ onGetStarted }) {
  return (
    <section id="home" className="relative pt-0 pb-4 bg-[#151c27] overflow-hidden">
      <ParticleNetwork />
      <div style={{ position: "absolute", bottom: "0px", left: "0px", width: "250px", height: "250px", background: "radial-gradient(circle at 30% 70%, rgba(120,60,255,0.45) 0%, rgba(100,40,220,0.2) 40%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 1 }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#151c27]/20 via-transparent to-[#151c27]" />

      <Navbar onGetStarted={onGetStarted} />
      <MarketTicker />

      {/* Hero: text left, image right */}
      <div className="relative z-10 flex flex-row items-start gap-2 pt-3 px-3">

        {/* Left: text content */}
        <div className="flex-1 min-w-0 space-y-2 pt-1">

          <div data-aos="fade-up" data-aos-delay="100" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500" style={{ fontSize: "clamp(9px, 2.2vw, 17px)" }}>
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
            Trading, Crypto, Staking & Investing
          </div>

          <h1 data-aos="fade-up" data-aos-delay="200" style={{ fontSize: "clamp(15px, 4vw, 48px)" }} className="font-bold leading-tight text-white">
            Empower Your <span className="text-blue-500">Financial</span> Future with Cryptocurrency and Forex Trading
          </h1>

          <p data-aos="fade-up" data-aos-delay="300" className="text-gray-400 leading-relaxed" style={{ fontSize: "clamp(9px, 2.2vw, 17px)" }}>
            Experience seamless cryptocurrency and forex trading, high-yield staking, and secure investment opportunities with cutting-edge tools.
          </p>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button style={{ fontSize: "clamp(9px, 2.2vw, 17px)" }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-none font-bold transition-colors" onClick={onGetStarted}>
              Get Started
            </button>
            <button style={{ fontSize: "clamp(9px, 2.2vw, 17px)" }} className="group bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 rounded-none font-bold flex items-center gap-1 transition-all" onClick={() => window.location.href="/signin"}>
              Learn More
              <span className="inline-block transform -rotate-45 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">→</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center flex-nowrap pt-1" style={{ gap: "clamp(4px, 2vw, 12px)" }}>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "clamp(9px, 2.4vw, 18px)" }} className="font-bold text-white">400K+</span>
              <div className="flex flex-col">
                <span className="text-gray-400 leading-tight" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>Users</span>
                <span className="text-gray-500 leading-tight" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>Trust Us</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "clamp(9px, 2.4vw, 18px)" }} className="font-bold text-white">24/7</span>
              <div className="flex flex-col">
                <span className="text-gray-400 leading-tight" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>Customer</span>
                <span className="text-gray-500 leading-tight" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>Supports</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "clamp(9px, 2.4vw, 18px)" }} className="font-bold text-white">800k+</span>
              <div className="flex flex-col">
                <span className="text-gray-400 leading-tight" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>Transactions</span>
              </div>
            </div>
          </div>

          {/* Feature bullets */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-300" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>
              <div className="w-3 h-3 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-2 h-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              Low transaction fees and high liquidity markets
            </div>
            <div className="flex items-center gap-1 text-gray-300" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>
              <div className="w-3 h-3 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-2 h-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              24/7 support from experienced trading professionals
            </div>
            <div className="flex items-center gap-1 text-gray-300" style={{ fontSize: "clamp(8px, 2vw, 15px)" }}>
              <div className="w-3 h-3 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-2 h-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              Top-tier security for data and transactions
            </div>
          </div>

        </div>

        {/* Right: image */}
        <div className="flex-shrink-0 w-[42%] flex justify-end items-start pt-2" style={{ marginRight: "-12px" }}>
          <img
            src="/bg1.png"
            alt="Trading App"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Forex Pairs Ticker */}
      <div className="relative z-10 mt-5" style={{ overflow: "hidden", width: "100%", paddingLeft: "12px" }}>
        <ForexTicker />
      </div>
      <div className="relative z-10 mt-4">
        <PartnersMarquee logoSize="w-6 h-6" />
      </div>
    </section>
  );
}
