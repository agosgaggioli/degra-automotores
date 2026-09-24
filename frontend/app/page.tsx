'use client';

import React from 'react';

import HeroCarousel from '../components/HeroCarousel';
import FinancingCarousel from '../components/FinancingCarousel';
import OpportunitiesSection from '../components/OpportunitiesSection';
import SellersCarousel from '../components/SellersCarousel';
import ConsignmentSection from '../components/ConsignmentSection';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#071224] text-white">
      
      <HeroCarousel />

      <FinancingCarousel />

      <OpportunitiesSection />

      <SellersCarousel />

      <ConsignmentSection />

      <WhyChooseUs />

    </main>
  );
}
