
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Star, Trophy } from "lucide-react";

interface AchievementCategory {
  title: string;
  icon: React.ReactNode;
  modules: {
    id: string;
    title: string;
    description: string;
    maxValue: number;
  }[];
}

const AchievementTracker = () => {
  // Load progress from localStorage
  const [moduleProgress, setModuleProgress] = React.useState(() => {
    const savedProgress = localStorage.getItem('skillher_module_progress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const achievementCategories: AchievementCategory[] = [
    {
      title: "Wellness Journey",
      icon: <Medal className="w-6 h-6 text-clara-lavender" />,
      modules: [
        {
          id: "mindfulness",
          title: "Mindfulness Mastery",
          description: "Developing present-moment awareness",
          maxValue: 100,
        },
        {
          id: "work-life",
          title: "Work-Life Balance",
          description: "Creating sustainable boundaries",
          maxValue: 100,
        },
        {
          id: "self-care",
          title: "Self-Care Strategies",
          description: "Building nurturing routines",
          maxValue: 100,
        },
      ],
    },
    {
      title: "Career Development",
      icon: <Trophy className="w-6 h-6 text-clara-sage" />,
      modules: [
        {
          id: "confidence",
          title: "Confidence Building",
          description: "Overcoming imposter syndrome",
          maxValue: 100,
        },
        {
          id: "negotiation",
          title: "Negotiation Skills",
          description: "Mastering professional negotiations",
          maxValue: 100,
        },
        {
          id: "networking",
          title: "Strategic Networking",
          description: "Building meaningful relationships",
          maxValue: 100,
        },
      ],
    },
  ];

  // Calculate overall progress
  const calculateOverallProgress = (category: AchievementCategory) => {
    let total = 0;
    let possible = 0;
    
    category.modules.forEach(module => {
      total += moduleProgress[module.id] || 0;
      possible += module.maxValue;
    });
    
    return possible > 0 ? Math.round((total / possible) * 100) : 0;
  };

  // Count completed achievements
  const completedAchievements = () => {
    return Object.values(moduleProgress).filter(progress => progress === 100).length;
  };

  // Calculate total achievements
  const totalAchievements = achievementCategories.reduce(
    (sum, category) => sum + category.modules.length, 
    0
  );

  return (
    <section className="py-16 bg-clara-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Your Achievement Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress and celebrate milestones in your coaching journey.
          </p>
        </div>

        <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Star className="w-8 h-8 text-clara-gold mr-3" />
              <div>
                <h3 className="text-xl font-bold">Your Progress</h3>
                <p className="text-gray-600">
                  You've completed {completedAchievements()} of {totalAchievements} achievements
                </p>
              </div>
            </div>
            <div className="bg-clara-gold/10 px-4 py-2 rounded-lg">
              <p className="text-clara-gold font-semibold">
                {Math.round((completedAchievements() / totalAchievements) * 100) || 0}% Complete
              </p>
            </div>
          </div>
          <Progress 
            value={Math.round((completedAchievements() / totalAchievements) * 100) || 0} 
            className="h-3 bg-gray-100" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {achievementCategories.map((category, index) => (
            <Card key={index} className="bg-white shadow-md border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {category.icon}
                    <CardTitle className="ml-2">{category.title}</CardTitle>
                  </div>
                  <span className="text-sm font-medium">
                    {calculateOverallProgress(category)}% Complete
                  </span>
                </div>
                <Progress value={calculateOverallProgress(category)} className="h-2" />
              </CardHeader>
              <CardContent className="pt-4">
                {category.modules.map((module) => (
                  <div key={module.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          {moduleProgress[module.id] || 0}%
                        </span>
                        {moduleProgress[module.id] === 100 && (
                          <span className="ml-2" role="img" aria-label="trophy">
                            🏆
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={moduleProgress[module.id] || 0} 
                      className="h-1.5 mb-1"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementTracker;
