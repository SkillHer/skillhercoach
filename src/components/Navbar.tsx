
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-clara-lavender/10">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/chat" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-clara-lavender">Coach<span className="text-clara-gold">Clara</span></span>
          </Link>
        </div>

        <nav className="flex items-center">
          <Link to="/chat" className="flex items-center gap-1 text-sm font-medium text-clara-lavender hover:text-clara-gold transition-colors">
            <MessageCircle size={16} />
            <span>Chat with Clara</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
