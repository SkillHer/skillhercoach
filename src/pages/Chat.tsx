
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import UserAuth from '../components/UserAuth';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const [user, setUser] = useState<null | { id: string; name: string }>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { toast } = useToast();
  
  // Check for existing user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('coachClara_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        toast({
          title: "Welcome back!",
          description: `Great to see you again, ${parsedUser.name}.`,
        });
      } catch (e) {
        localStorage.removeItem('coachClara_user');
      }
    } else {
      setIsAuthOpen(true);
    }
  }, []);

  const handleLogin = (userData: { id: string; name: string }) => {
    setUser(userData);
    localStorage.setItem('coachClara_user', JSON.stringify(userData));
    setIsAuthOpen(false);
    toast({
      title: "Welcome to CoachClara!",
      description: `Hello ${userData.name}, I'm here to support your growth journey.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('coachClara_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "Hope to see you again soon!",
    });
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container-custom">
          {user ? (
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-clara-lavender">
                  Your Coach <span className="text-clara-gold">Clara</span>
                </h1>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-clara-lavender hover:text-clara-gold transition-colors"
                >
                  Logout
                </button>
              </div>
              <ChatInterface user={user} />
            </div>
          ) : (
            <UserAuth isOpen={isAuthOpen} onLogin={handleLogin} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
