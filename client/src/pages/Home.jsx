import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesBento from '../components/FeaturesBento';
import InteractivePlayground from '../components/InteractivePlayground';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import CustomMousePointer from '../components/CustomMousePointer';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-blue-600 selection:text-white relative bg-grid-pattern overflow-x-hidden">
      
      {/* Real Floating Collaborative Mouse Pointer */}
      <CustomMousePointer />

      {/* Glassmorphism Sticky Navbar */}
      <Navbar />

      {/* Main Landing Page Content */}
      <main className="relative z-10">
        {/* Hero Section with Quick Join & Interactive IDE Mockup */}
        <HeroSection />

        {/* Features Bento Grid */}
        <FeaturesBento />

        {/* Interactive Code Playground / Sandbox */}
        <InteractivePlayground />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* FAQ Accordion */}
        <FAQ />

        {/* Bottom Call To Action Banner */}
        <CallToAction />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
