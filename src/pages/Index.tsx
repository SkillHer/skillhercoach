
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CoachingModules from '../components/CoachingModules';
import Testimonials from '../components/Testimonials';
import DailyInspiration from '../components/DailyInspiration';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CoachingModules />
        <Testimonials />
        <DailyInspiration />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
