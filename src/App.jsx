import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CopyTrading from './pages/CopyTrading';
import TraderProfile from './pages/TraderProfile';
import TraderDetails from "./pages/TraderDetails";
import MyCopyTrades from './pages/MyCopyTrades';
import CopyTradingSetup from './pages/CopyTradingSetup';
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
import NewStake from './pages/NewStake';
import ManageBots from "./pages/ManageBots";
import BotPlans from "./pages/BotPlans";
import NewTrade from "./pages/NewTrade";
import LiveTrading from "./pages/LiveTrading";
import WithdrawNew from "./pages/WithdrawNew";
import WithdrawVerifyCode from "./pages/WithdrawVerifyCode";
import BotTransactionHistory from "./pages/BotTransactionHistory";
import VerifyEmail from "./pages/VerifyEmail";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import SupportPage from "./pages/SupportPage";
import ResetPassword from "./pages/ResetPassword";
import TradingInfo from "./pages/TradingInfo";
import StakingInfo from "./pages/StakingInfo";
import InvestingInfo from "./pages/InvestingInfo";
import Terms from "./pages/Terms";
import CheckEmail from "./pages/CheckEmail";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import LoadingScreen from "./components/LoadingScreen";
import LiveChat from "./components/LiveChat";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user || !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};


function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);
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
      </div>
  );
}

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/dashboard/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/dashboard/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/dashboard/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/admin/support" element={<AdminRoute><SupportPage /></AdminRoute>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
        <Route path="/dashboard/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/dashboard/live-market" element={<PrivateRoute><LiveMarket /></PrivateRoute>} />
        <Route path="/dashboard/stake" element={<PrivateRoute><Stake /></PrivateRoute>} />
        <Route path="/dashboard/new-stake" element={<PrivateRoute><NewStake /></PrivateRoute>} />
        <Route path="/dashboard/investment-records" element={<PrivateRoute><InvestmentRecords /></PrivateRoute>} />
        <Route path="/dashboard/transaction-history" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
        <Route path="/dashboard/withdraw-deposit" element={<PrivateRoute><WithdrawDeposit /></PrivateRoute>} />
        <Route path="/dashboard/packages" element={<PrivateRoute><Packages /></PrivateRoute>} />
        <Route path="/dashboard/kyc" element={<PrivateRoute><KYC /></PrivateRoute>} />
        <Route path="/dashboard/refer-users" element={<PrivateRoute><ReferUsers /></PrivateRoute>} />
        <Route path="/dashboard/manage-bots" element={<PrivateRoute><ManageBots /></PrivateRoute>} />
        <Route path="/dashboard/new-trade" element={<PrivateRoute><NewTrade /></PrivateRoute>} />
        <Route path="/dashboard/bot-plans" element={<PrivateRoute><BotPlans /></PrivateRoute>} />
        <Route path="/dashboard/live-trading" element={<PrivateRoute><LiveTrading /></PrivateRoute>} />
        <Route path="/dashboard/withdraw/new" element={<PrivateRoute><WithdrawNew /></PrivateRoute>} />
        <Route path="/dashboard/withdraw/verify-code" element={<PrivateRoute><WithdrawVerifyCode /></PrivateRoute>} />
        <Route path="/dashboard/bot-transactions" element={<PrivateRoute><BotTransactionHistory /></PrivateRoute>} />
        <Route path="/dashboard/deposit-funds" element={<PrivateRoute><DepositFunds /></PrivateRoute>} />
        <Route path="/trading-info" element={<TradingInfo />} />
        <Route path="/dashboard/copy-trading" element={<PrivateRoute><CopyTrading /></PrivateRoute>} />
        <Route path="/dashboard/copy-trading/:id" element={<PrivateRoute><TraderProfile /></PrivateRoute>} />
        <Route path="/dashboard/my-copy-trades" element={<PrivateRoute><MyCopyTrades /></PrivateRoute>} />
        <Route path="/dashboard/trader/:id" element={<PrivateRoute><TraderDetails /></PrivateRoute>} />
        <Route path="/dashboard/copy-trading/setup" element={<PrivateRoute><CopyTradingSetup /></PrivateRoute>} />
        <Route path="/staking-info" element={<StakingInfo />} />
        <Route path="/investing-info" element={<InvestingInfo />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <LiveChat />
    </>
  );
}

export default App;

document.addEventListener('contextmenu', e => e.preventDefault());
// Deployed on Tue Mar  3 01:13:28 IST 2026
// Redeploy trigger Tue Mar  3 01:14:27 IST 2026
