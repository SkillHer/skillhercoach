
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-clara-lavender/10">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/chat" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-clara-lavender">Coach<span className="text-clara-gold">Clara</span></span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/chat" className="flex items-center gap-1 text-sm font-medium text-clara-lavender hover:text-clara-gold transition-colors">
            <MessageCircle size={16} />
            <span>Chat with Clara</span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-clara-lavender hover:text-clara-gold transition-colors"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
