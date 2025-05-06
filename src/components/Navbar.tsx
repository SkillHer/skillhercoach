
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-clara-lavender/10">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-clara-lavender">Coach<span className="text-clara-gold">Clara</span></span>
          </a>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-clara-lavender transition-colors">Features</a>
          <a href="#modules" className="text-sm font-medium hover:text-clara-lavender transition-colors">Coaching</a>
          <a href="#testimonials" className="text-sm font-medium hover:text-clara-lavender transition-colors">Testimonials</a>
          <Button className="bg-clara-lavender hover:bg-clara-lavender/90">Get Started</Button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-clara-lavender/10 animate-fade-in">
          <div className="container-custom py-4 space-y-3">
            <a 
              href="#features" 
              className="block py-2 text-sm font-medium hover:text-clara-lavender"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#modules" 
              className="block py-2 text-sm font-medium hover:text-clara-lavender"
              onClick={() => setMobileMenuOpen(false)}
            >
              Coaching
            </a>
            <a 
              href="#testimonials" 
              className="block py-2 text-sm font-medium hover:text-clara-lavender"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <Button className="w-full bg-clara-lavender hover:bg-clara-lavender/90">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
