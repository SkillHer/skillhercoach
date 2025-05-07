
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseClient from '../services/supabaseClient';

interface UserProfile {
  age?: number | null;
  nationality?: string | null;
  occupation?: string | null;
}

const Chat = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = getSupabaseClient();
  
  // Extract user name from Supabase user metadata or email
  const userName = user?.user_metadata?.full_name || 
                  (user?.email ? user.email.split('@')[0] : 'User');
  
  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('age, nationality, occupation')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
      };
      
      fetchProfile();
    }
  }, [user?.id]);
  
  // Create an object compatible with what ChatInterface expects
  const chatUser = {
    id: user?.id || '',
    name: userName,
    // Add profile data to be used in the chat
    profile: profile || {}
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Adjust the padding to ensure content is visible and not covered by footer */}
      <main className="flex-grow pt-20 pb-16">
        <div className="container-custom">
          <div className="flex flex-col h-[calc(100vh-14rem)]">
            <ChatInterface user={chatUser} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
