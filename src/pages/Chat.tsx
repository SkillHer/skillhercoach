
import React from 'react';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  
  // Extract user name from Supabase user metadata or email
  const userName = user?.user_metadata?.full_name || 
                  (user?.email ? user.email.split('@')[0] : 'User');
  
  // Create a simplified chat user object
  const chatUser = {
    id: user?.id || '',
    name: userName,
    // Empty profile object since we're removing profile features
    profile: {}
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container-custom">
          <div className="flex flex-col h-[calc(100vh-5rem)]">
            <ChatInterface user={chatUser} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
