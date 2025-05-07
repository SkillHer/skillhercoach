
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const CoachingModules = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load progress from localStorage or initialize empty progress
  const [moduleProgress, setModuleProgress] = React.useState(() => {
    const savedProgress = localStorage.getItem('skillher_module_progress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const wellnessModules = [
    {
      id: "mindfulness",
      title: "Mindfulness Mastery",
      description: "Learn evidence-based techniques to reduce stress and increase present-moment awareness.",
      badge: "Popular",
      prompt: "Tell me about mindfulness techniques for stress reduction and increasing present-moment awareness."
    },
    {
      id: "work-life",
      title: "Work-Life Balance",
      description: "Create sustainable boundaries and integrate well-being into your busy professional life.",
      badge: null,
      prompt: "How can I create better work-life balance and set sustainable boundaries in my professional life?"
    },
    {
      id: "self-care",
      title: "Self-Care Strategies",
      description: "Build personalized routines that nurture your physical and emotional health.",
      badge: "New",
      prompt: "What are some effective self-care strategies I can build into my daily routine for better physical and emotional health?"
    }
  ];

  const careerModules = [
    {
      id: "confidence",
      title: "Confidence Building",
      description: "Develop authentic leadership presence and overcome imposter syndrome.",
      badge: "Popular",
      prompt: "How can I build my confidence as a leader and overcome imposter syndrome?"
    },
    {
      id: "negotiation",
      title: "Negotiation Skills",
      description: "Master techniques for salary negotiations and securing professional opportunities.",
      badge: null,
      prompt: "What techniques can I use for effective salary negotiations and securing better professional opportunities?"
    },
    {
      id: "networking",
      title: "Strategic Networking",
      description: "Build meaningful professional relationships that advance your career goals.",
      badge: null,
      prompt: "How can I build a strategic professional network that advances my career goals?"
    }
  ];

  const handleModuleClick = (module, category) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          redirectAfterLogin: '/chat', 
          initialPrompt: module.prompt, 
          selectedInterest: category === 'wellness' ? 'health' : 'career' 
        } 
      });
      return;
    }
    
    // Navigate to chat with the module prompt
    navigate('/chat', { 
      state: { 
        initialPrompt: module.prompt, 
        selectedInterest: category === 'wellness' ? 'health' : 'career' 
      } 
    });
    
    // Update progress for this module
    const updatedProgress = {
      ...moduleProgress,
      [module.id]: (moduleProgress[module.id] || 0) + 25 // Increment by 25% each time
    };
    
    // Cap at 100%
    if (updatedProgress[module.id] > 100) {
      updatedProgress[module.id] = 100;
      
      // Show achievement unlocked toast when reaching 100%
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `You've mastered "${module.title}"`,
      });
    }
    
    // Save updated progress
    setModuleProgress(updatedProgress);
    localStorage.setItem('skillher_module_progress', JSON.stringify(updatedProgress));
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
              {wellnessModules.map((module) => (
                <Card 
                  key={module.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModuleClick(module, 'wellness')}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold">{module.title}</h4>
                      {module.badge && (
                        <Badge className="bg-clara-lavender hover:bg-clara-lavender/90">{module.badge}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    {moduleProgress[module.id] > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{moduleProgress[module.id]}%</span>
                        </div>
                        <Progress value={moduleProgress[module.id]} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Career Modules */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-clara-sage">Career Coaching</h3>
            <div className="space-y-6">
              {careerModules.map((module) => (
                <Card 
                  key={module.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModuleClick(module, 'career')}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold">{module.title}</h4>
                      {module.badge && (
                        <Badge className="bg-clara-sage hover:bg-clara-sage/90">{module.badge}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    {moduleProgress[module.id] > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{moduleProgress[module.id]}%</span>
                        </div>
                        <Progress value={moduleProgress[module.id]} className="h-2" />
                      </div>
                    )}
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
