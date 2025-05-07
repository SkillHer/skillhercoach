import React from 'react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Testimonials = () => {
  const isMobile = useIsMobile();
  const testimonials = [
    {
      quote: "SkillHer Coach helped me find balance between my demanding executive role and my personal wellbeing. The personalized coaching has been transformative.",
      name: "Sarah J.",
      title: "Marketing Director",
      image: "/lovable-uploads/b0b4206a-5fd0-40a8-adce-73d48f71f945.png"
    },
    {
      quote: "The career coaching modules gave me the confidence to negotiate a promotion I'd been hesitant to pursue. SkillHer Coach's guidance was exactly what I needed.",
      name: "Michelle L.",
      title: "Senior Software Engineer",
      image: "/lovable-uploads/89d9527e-b46b-4c6d-b55c-652064b895b0.png"
    },
    {
      quote: "As a startup founder, I was burning out fast. The wellness coaching helped me create sustainable practices that improved both my health and my company.",
      name: "Aisha T.",
      title: "Founder & CEO",
      image: "/lovable-uploads/95c52387-1454-41e2-9303-aa86c1d9c08c.png"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-clara-lavender/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Women Empowered by SkillHer Coach</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from women who have experienced remarkable transitions both personally & professionally with SkillHer Coach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <svg className="h-8 w-8 text-clara-lavender mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                  <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback for image loading errors
                        const target = e.target as HTMLImageElement;
                        console.error(`Failed to load image: ${target.src}`);
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
