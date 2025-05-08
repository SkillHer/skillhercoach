
import React from 'react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const isMobile = useIsMobile();
  const testimonials = [{
    quote: "SkillHer Coach built my confidence, provided me with guidance in putting together my resume and prepared me to interview successfully to land my very first internship.",
    name: "Derinsola A.",
    title: "Undergraduate Student",
    image: "/lovable-uploads/834d91fb-488f-4fd9-b17b-10aec4974328.png"
  }, {
    quote: "SkillHer Coach helped me find balance between my demanding career, my fashion business and my personal wellbeing. The personalized coaching has been transformative.",
    name: "Monilola O.",
    title: "Marketer & Fashion Entrepreneur",
    image: "/lovable-uploads/bc7e2e26-eefa-42db-98d8-940766bd33ac.png"
  }, {
    quote: "As a student in a new country, I was struggling to settle in & balance school work. The coaching helped me with sustainable practices that improved both my confidence & performance.",
    name: "Oyindamola A.",
    title: "Accountant & Postgraduate Student",
    image: "/lovable-uploads/95c52387-1454-41e2-9303-aa86c1d9c08c.png"
  }];

  return (
    <section id="testimonials" className="py-16 bg-anita-lavender/10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-anita-purple">Women Empowered by SkillHer Coach</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear from women who have experienced remarkable transformations both personally & professionally with SkillHer Coach.</p>
        </div>

        {isMobile ? (
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static transform-none h-10 w-10 bg-anita-purple text-white hover:bg-anita-purple/80" />
              <CarouselNext className="static transform-none h-10 w-10 bg-anita-purple text-white hover:bg-anita-purple/80" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface TestimonialProps {
  testimonial: {
    quote: string;
    name: string;
    title: string;
    image: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialProps) => {
  return (
    <Card className="p-8 bg-white shadow-md hover:shadow-lg transition-shadow border-anita-lavender/20">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <svg className="h-8 w-8 text-anita-purple mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
        </div>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="h-full w-full object-cover" 
              onError={e => {
                // Fallback for image loading errors
                const target = e.target as HTMLImageElement;
                console.error(`Failed to load image: ${target.src}`);
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <p className="font-semibold text-anita-purple">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.title}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Testimonials;
