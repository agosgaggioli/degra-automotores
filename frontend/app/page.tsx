'use client';

import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import FinancingCarousel from '../components/FinancingCarousel';
import FeaturedVehiclesCarousel from '../components/FeaturedVehiclesCarousel';
import OpportunitiesSection from '../components/OpportunitiesSection';
import SellersCarousel from '../components/SellersCarousel';
import ConsignmentSection from '../components/ConsignmentSection';
//import NewArrivalsCarousel from '../components/NewArrivalsCarousel';
import WhyChooseUs from '../components/WhyChooseUs';
//import StatisticsSection from '../components/StatisticsSection';
//import TestimonialsCarousel from '../components/TestimonialsCarousel';
//import HistoryTeaser from '../components/HistoryTeaser';
//import InstagramSection from '../components/InstagramSection';
//import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main className="bg-backgroundDark text-white">
      <HeroCarousel />
      <section className="bg-white text-black py-16">
        <FinancingCarousel />
      </section>
      <section className="bg-gray-100 py-16">
        <FeaturedVehiclesCarousel />
      </section>
      <section className="bg-bluePrimary text-white py-16">
        <OpportunitiesSection />
      </section>
      <section className="bg-white py-16">
        <SellersCarousel />
      </section>
      <section className="bg-gray-100 py-16">
        <ConsignmentSection />
      </section>

      <section className="bg-gray-50 py-16 text-black">
        <WhyChooseUs />
      </section>
    </main>
  );
}
