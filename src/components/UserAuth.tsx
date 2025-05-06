
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface UserAuthProps {
  isOpen: boolean;
  onLogin: (userData: { id: string; name: string }) => void;
}

const UserAuth = ({ isOpen, onLogin }: UserAuthProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    
    // Simple user creation - in a real app, this would involve backend authentication
    setTimeout(() => {
      const userId = `user_${Date.now()}`;
      onLogin({ id: userId, name: name.trim() });
      setIsLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-clara-lavender/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-clara-lavender/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-clara-lavender" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-clara-lavender">Welcome to Coach<span className="text-clara-gold">Clara</span></h2>
          <p className="text-gray-600 mt-2">Your personal coach for wellness and career growth</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clara-lavender/50"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-clara-lavender hover:bg-clara-lavender/90"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Start Chatting"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserAuth;
