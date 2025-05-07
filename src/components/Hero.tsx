
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLearnMore = () => {
    // Scroll to features if on home page, otherwise navigate based on auth state
    if (window.location.pathname === '/') {
      const featuresElement = document.getElementById('features');
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (user) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    console.log("Image loaded successfully");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", e);
    // Fallback handling can be added here if needed
  };

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Personal AI Coach for <span className="text-clara-lavender">Wellness</span> & <span className="text-clara-sage">Career</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              Skillher Coach helps women achieve balance, purpose, and success through personalized guidance for both personal wellbeing and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to={user ? "/chat" : "/signup"}>
                <Button size="lg" className="bg-clara-lavender hover:bg-clara-lavender/90">
                  Start Your Journey
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-clara-lavender text-clara-lavender hover:bg-clara-lavender/10"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-clara-lavender/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-clara-sage/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-4">
                <AspectRatio ratio={1} className="w-full rounded-lg overflow-hidden bg-gray-100">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-clara-lavender border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src="/lovable-uploads/ac0c403f-fd7e-4b72-bc7c-a79da174590c.png" 
                    alt="Skillher Coach" 
                    className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
