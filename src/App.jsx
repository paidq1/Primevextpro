import React, { useEffect } from "react";
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
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Smartsupp from "./components/Smartsupp";
import InvestmentOpportunities from "./components/InvestmentOpportunities";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  componentDidCatch(error) { this.setState({ error: error.message }); }
  render() {
    if (this.state.error) return (
      <div style={{color:'red',padding:'20px',fontSize:'14px',background:'white'}}>
        <b>ERROR:</b> {this.state.error}
      </div>
    );
    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    document.addEventListener('contextmenu', e => e.preventDefault());
  }, []);

  return (
    <ErrorBoundary>
      <div className="relative w-full min-h-screen bg-[#151c27] text-white overflow-x-hidden">
        <HeroSection />
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
        <ContactUs />
        <FAQ />
        <Footer />
        <Smartsupp />
      </div>
    </ErrorBoundary>
  );
}

export default App;
