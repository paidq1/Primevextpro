import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'aos/dist/aos.css';
import AOS from 'aos';

import HeroSection from "./components/HeroSection";
import MarketOverview from "./components/MarketOverview";
import OurMission from "./components/OurMission";
import WhyChooseSection from "./components/WhyChooseSection";
import HowItWorks from "./components/HowItWorks";
import TradingAnalysis from "./components/TradingAnalysis";
import VideoResources from "./components/VideoResources";
import WhyChooseUs from "./components/WhyChooseUs";
import Achievements from "./components/Achievements";
import OurPlans from "./components/OurPlans";
import Testimonials from "./components/Testimonials";
import InvestmentOpportunities from "./components/InvestmentOpportunities";
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Smartsupp from "./components/Smartsupp";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./pages/Dashboard";

function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out', once: true, mirror: false, offset: 100 });
    window.AOS = AOS;
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#151c27] text-white overflow-x-hidden">
      <HeroSection onGetStarted={() => window.location.href="/signup"} />
      <WhyChooseSection />
      <MarketOverview />
      <OurMission />
      <HowItWorks />
      <TradingAnalysis />
      <VideoResources />
      <WhyChooseUs />
      <Achievements />
      <OurPlans />
      <InvestmentOpportunities />
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
      <Testimonials />
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
      <ContactUs />
      <FAQ />
      <Footer />
      <Smartsupp />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

document.addEventListener('contextmenu', e => e.preventDefault());
