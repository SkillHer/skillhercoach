
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AchievementTracker from '../components/AchievementTracker';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Achievements = () => {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ redirectAfterLogin: '/achievements' }} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <AchievementTracker />
      </main>
      <Footer />
    </div>
  );
};

export default Achievements;
