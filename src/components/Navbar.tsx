
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLandingPage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container-custom flex justify-between items-center h-20">
        
        {/* Logo and Name */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold">Coach<span className="text-clara-lavender">Clara</span></span>
          <span className="text-xs bg-clara-cream text-clara-charcoal px-2 py-1 rounded-full">by skillher</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-6">
            {isLandingPage && (
              <>
                <a href="#features" className="text-gray-600 hover:text-clara-lavender transition-colors">Features</a>
                <a href="#modules" className="text-gray-600 hover:text-clara-lavender transition-colors">Modules</a>
                <a href="#testimonials" className="text-gray-600 hover:text-clara-lavender transition-colors">Testimonials</a>
              </>
            )}
            {user ? (
              <>
                <Link to="/chat" className="text-gray-600 hover:text-clara-lavender transition-colors">Chat</Link>
                <Button variant="ghost" onClick={signOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container-custom py-4 bg-white border-t">
          <div className="flex flex-col space-y-4">
            {isLandingPage && (
              <>
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-clara-lavender transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#modules" 
                  className="text-gray-600 hover:text-clara-lavender transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Modules
                </a>
                <a 
                  href="#testimonials" 
                  className="text-gray-600 hover:text-clara-lavender transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
                <div className="border-t my-2"></div>
              </>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/chat" 
                  className="text-gray-600 hover:text-clara-lavender transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="justify-start px-0 hover:bg-transparent"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2"
                >
                  <Button variant="ghost" className="w-full justify-start">Log In</Button>
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2"
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
