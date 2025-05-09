
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get redirect path and initialPrompt from location state
  const redirectPath = location.state?.redirectAfterLogin || '/chat';
  const initialPrompt = location.state?.initialPrompt || null;
  const selectedInterest = location.state?.selectedInterest || null;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Navigate to the redirect path with the initialPrompt if available
      if (initialPrompt) {
        navigate(redirectPath, { 
          state: { 
            initialPrompt,
            selectedInterest
          }
        });
      } else {
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-anita-cream p-4">
      <Card className="w-full max-w-md border-anita-lavender/20">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex items-center text-anita-purple hover:underline mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-anita-purple/10 rounded-full flex items-center justify-center">
              <LogIn className="h-6 w-6 text-anita-purple" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-anita-lavender/20 focus-visible:ring-anita-purple"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-anita-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="border-anita-lavender/20 focus-visible:ring-anita-purple"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-anita-purple hover:bg-anita-purple/90 text-white"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-anita-purple hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
