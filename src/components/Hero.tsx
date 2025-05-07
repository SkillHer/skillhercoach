
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Personal AI Coach for <span className="text-clara-lavender">Wellness</span> & <span className="text-clara-sage">Career</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              CoachClara by <span className="font-semibold">skillher</span> helps women achieve balance, purpose, and success through personalized guidance for both personal wellbeing and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="bg-clara-lavender hover:bg-clara-lavender/90">
                  Start Your Journey
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-clara-lavender text-clara-lavender hover:bg-clara-lavender/10">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-clara-lavender/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-clara-sage/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
                <div className="aspect-video bg-clara-cream rounded-lg mb-6 flex items-center justify-center">
                  <span className="font-serif text-3xl text-clara-charcoal/50">Coach Clara</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-clara-lavender/20 rounded-full w-3/4"></div>
                  <div className="h-4 bg-clara-sage/20 rounded-full w-full"></div>
                  <div className="h-4 bg-clara-lavender/20 rounded-full w-5/6"></div>
                  <div className="h-10 bg-clara-lavender rounded-lg w-1/2 mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
