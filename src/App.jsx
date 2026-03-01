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
import Deposit from "./pages/Deposit";
import DepositFunds from "./pages/DepositFunds";
import Withdraw from "./pages/Withdraw";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LiveMarket from "./pages/LiveMarket";
import Stake from "./pages/Stake";
import InvestmentRecords from "./pages/InvestmentRecords";
import TransactionHistory from "./pages/TransactionHistory";
import WithdrawDeposit from "./pages/WithdrawDeposit";
import Packages from "./pages/Packages";
import KYC from "./pages/KYC";
import ReferUsers from "./pages/ReferUsers";
import ManageBots from "./pages/ManageBots";
import LiveTrading from "./pages/LiveTrading";
import WithdrawNew from "./pages/WithdrawNew";
import BotTransactionHistory from "./pages/BotTransactionHistory";
import VerifyEmail from "./pages/VerifyEmail";
import AdminPanel from "./pages/AdminPanel";
import CheckEmail from "./pages/CheckEmail";

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
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/dashboard/deposit" element={<Deposit />} />
        <Route path="/dashboard/withdraw" element={<Withdraw />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/live-market" element={<LiveMarket />} />
        <Route path="/dashboard/stake" element={<Stake />} />
        <Route path="/dashboard/investment-records" element={<InvestmentRecords />} />
        <Route path="/dashboard/transaction-history" element={<TransactionHistory />} />
        <Route path="/dashboard/withdraw-deposit" element={<WithdrawDeposit />} />
        <Route path="/dashboard/packages" element={<Packages />} />
        <Route path="/dashboard/kyc" element={<KYC />} />
        <Route path="/dashboard/refer-users" element={<ReferUsers />} />
        <Route path="/dashboard/manage-bots" element={<ManageBots />} />
        <Route path="/dashboard/live-trading" element={<LiveTrading />} />
        <Route path="/dashboard/withdraw/new" element={<WithdrawNew />} />
        <Route path="/dashboard/bot-transactions" element={<BotTransactionHistory />} />
        <Route path="/dashboard/deposit-funds" element={<DepositFunds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

document.addEventListener('contextmenu', e => e.preventDefault());
