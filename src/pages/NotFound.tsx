
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-anita-cream pt-20">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-anita-purple mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            We couldn't find the page you were looking for. It might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button className="bg-anita-purple hover:bg-anita-purple/90 text-white">Return to Home</Button>
            </Link>
            {user ? (
              <Link to="/chat">
                <Button variant="outline" className="border-anita-purple text-anita-purple hover:bg-anita-purple/10">Go to Chat</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="border-anita-purple text-anita-purple hover:bg-anita-purple/10">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
