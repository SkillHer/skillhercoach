
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CoachingModules = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const wellnessModules = [
    {
      title: "Mindfulness Mastery",
      description: "Learn evidence-based techniques to reduce stress and increase present-moment awareness.",
      badge: "Popular",
      prompt: "Tell me about mindfulness techniques for stress reduction and increasing present-moment awareness."
    },
    {
      title: "Work-Life Balance",
      description: "Create sustainable boundaries and integrate well-being into your busy professional life.",
      badge: null,
      prompt: "How can I create better work-life balance and set sustainable boundaries in my professional life?"
    },
    {
      title: "Self-Care Strategies",
      description: "Build personalized routines that nurture your physical and emotional health.",
      badge: "New",
      prompt: "What are some effective self-care strategies I can build into my daily routine for better physical and emotional health?"
    }
  ];

  const careerModules = [
    {
      title: "Confidence Building",
      description: "Develop authentic leadership presence and overcome imposter syndrome.",
      badge: "Popular",
      prompt: "How can I build my confidence as a leader and overcome imposter syndrome?"
    },
    {
      title: "Negotiation Skills",
      description: "Master techniques for salary negotiations and securing professional opportunities.",
      badge: null,
      prompt: "What techniques can I use for effective salary negotiations and securing better professional opportunities?"
    },
    {
      title: "Strategic Networking",
      description: "Build meaningful professional relationships that advance your career goals.",
      badge: null,
      prompt: "How can I build a strategic professional network that advances my career goals?"
    }
  ];

  const handleLearnMore = (prompt: string) => {
    if (user) {
      // User is logged in, navigate to chat with the prompt
      navigate('/chat', { state: { initialPrompt: prompt } });
    } else {
      // User is not logged in, navigate to login
      navigate('/login', { state: { redirectAfterLogin: '/chat', initialPrompt: prompt } });
    }
  };

  return (
    <section id="modules" className="py-16">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Personalized Coaching Modules</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our specialized coaching content designed to nurture both your personal wellbeing and professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wellness Modules */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-clara-lavender">Wellness Coaching</h3>
            <div className="space-y-6">
              {wellnessModules.map((module, index) => (
                <Card key={`wellness-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold">{module.title}</h4>
                      {module.badge && (
                        <Badge className="bg-clara-lavender hover:bg-clara-lavender/90">{module.badge}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full border-clara-lavender text-clara-lavender hover:bg-clara-lavender/10"
                      onClick={() => handleLearnMore(module.prompt)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Career Modules */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-clara-sage">Career Coaching</h3>
            <div className="space-y-6">
              {careerModules.map((module, index) => (
                <Card key={`career-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold">{module.title}</h4>
                      {module.badge && (
                        <Badge className="bg-clara-sage hover:bg-clara-sage/90">{module.badge}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full border-clara-sage text-clara-sage hover:bg-clara-sage/10"
                      onClick={() => handleLearnMore(module.prompt)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachingModules;
