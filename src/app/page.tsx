import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import FeaturedShops from '@/components/home/FeaturedShops';
import DesignShowcase from '@/components/home/DesignShowcase';
import HowItWorks from '@/components/home/HowItWorks';
import ValueProposition from '@/components/home/ValueProposition';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryExplorer />
        <FeaturedShops />
        <DesignShowcase />
        <HowItWorks />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
}
