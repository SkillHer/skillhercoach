
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-anita-purple text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="font-serif text-2xl font-bold text-white">SkillHer<span className="text-anita-lavender">Coach</span></span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">Your AI-powered partner for holistic personal & professional development, focused on empowering women to achieve balance between wellness, career success, and business growth.</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/skillherorg/#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/company/skillher-org/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="mailto:skillherhq@gmail.com" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/chat" className="text-gray-300 hover:text-white transition-colors">Chat with Coach</Link></li>
              <li><a href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="/#modules" className="text-gray-300 hover:text-white transition-colors">Coaching Modules</a></li>
              <li><a href="/#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/chat" className="text-gray-300 hover:text-white transition-colors">Chat Dashboard</Link></li>
            </ul>
            <p className="text-gray-300 mt-4">
              SkillHer Coach is dedicated to empowering women through personalized career guidance, business mentorship, and wellness coaching, helping them achieve balance and success in all aspects of life.
            </p>
            <a href="https://chat.whatsapp.com/BpBvDDGp3TIKHPhNWMgL9M" target="_blank" rel="noopener noreferrer" className="text-anita-lavender hover:text-anita-lavender/80 transition-colors font-medium mt-2 inline-block">
              Join the Community →
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center md:text-left text-gray-400">
          <p>&copy; {currentYear} SkillHer Coach. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
