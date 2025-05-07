
import React from 'react';
import { Heart, Star, Users, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-clara-lavender" />,
      title: "Wellness Coaching",
      description: "Personalized mindfulness practices, stress management techniques, and wellness routines tailored to your lifestyle and preferences."
    },
    {
      icon: <Star className="h-8 w-8 text-clara-gold" />,
      title: "Career Growth",
      description: "Strategic career planning, leadership development, and professional skills enhancement designed specifically for women in the workplace."
    },
    {
      icon: <Users className="h-8 w-8 text-clara-sage" />,
      title: "Community Support",
      description: "Connect with like-minded women on similar journeys, share experiences, and build meaningful professional relationships."
    },
    {
      icon: <Medal className="h-8 w-8 text-clara-charcoal" />,
      title: "Achievement Tracking",
      description: "Monitor your progress, celebrate milestones, and visualize your growth in both wellness and career domains.",
      badge: "CLOSED BETA"
    }
  ];

  return (
    <section id="features" className="py-16 bg-clara-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How SkillHer Coach Empowers You</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our unique approach integrates wellness and career development into a cohesive coaching experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-4 flex justify-between items-center">
                <div>{feature.icon}</div>
                {feature.badge && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                    {feature.badge}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
