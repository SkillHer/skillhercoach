
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DailyInspiration = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const quotes = [
    { quote: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis" },
    { quote: "The most effective way to do it, is to do it.", author: "Amelia Earhart" },
    { quote: "Do not wait for the perfect time and place to enter, for you are already onstage.", author: "Unknown" },
    { quote: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
    { quote: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
    { quote: "If you're offered a seat on a rocket ship, don't ask what seat! Just get on.", author: "Sheryl Sandberg" },
    { quote: "Power is not given to you. You have to take it.", author: "Beyoncé" },
    { quote: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  ];

  useEffect(() => {
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex].quote);
    setAuthor(quotes[randomIndex].author);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Daily Inspiration</h2>
          <p className="text-gray-600">
            Start your day with empowering wisdom to nurture your mind and spirit.
          </p>
        </div>

        <Card className="border border-clara-lavender/20 overflow-hidden">
          <div className="clara-gradient h-3" />
          <CardContent className="p-8 text-center">
            <p className="font-serif text-xl md:text-2xl italic text-gray-800 mb-4">
              "{quote}"
            </p>
            <p className="text-gray-600 mb-6">— {author}</p>
            <Button 
              onClick={getRandomQuote}
              variant="outline" 
              className="border-clara-lavender text-clara-lavender hover:bg-clara-lavender/10"
            >
              New Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DailyInspiration;
