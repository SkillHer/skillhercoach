
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle2 } from 'lucide-react';
import getSupabaseClient from '@/services/supabaseClient';

const ProfileSetup = () => {
  const [age, setAge] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to complete profile setup.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Insert into profiles table
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        age: age ? parseInt(age) : null,
        nationality,
        occupation,
        updated_at: new Date().toISOString(),
      });
      
      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully set up.",
      });
      
      // Redirect to chat page
      navigate('/chat');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Profile Setup Failed",
        description: error.message || "An error occurred during profile setup.",
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
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-anita-purple/10 rounded-full flex items-center justify-center">
              <UserCircle2 className="h-6 w-6 text-anita-purple" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Tell us a bit about yourself to get personalized experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age"
                type="number" 
                placeholder="Enter your age" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
                className="border-anita-lavender/20 focus-visible:ring-anita-purple"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality"
                placeholder="Enter your nationality" 
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                disabled={loading}
                className="border-anita-lavender/20 focus-visible:ring-anita-purple"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input 
                id="occupation"
                placeholder="Enter your occupation" 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                disabled={loading}
                className="border-anita-lavender/20 focus-visible:ring-anita-purple"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-anita-purple hover:bg-anita-purple/90 text-white"
              disabled={loading}
            >
              {loading ? "Saving Profile..." : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-500 w-full">
            This information helps us tailor your experience. You can update it later in your profile settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
