
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '../services/supabaseClient';
import { User } from 'lucide-react';
import SetupProfilesTable from '@/components/SetupProfilesTable';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [showTableSetup, setShowTableSetup] = useState(false);
  
  // Form state
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [occupation, setOccupation] = useState('');
  
  // Check if profiles table exists when component mounts
  useEffect(() => {
    const checkProfilesTable = async () => {
      if (!supabase) return;
      
      try {
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (error && error.message.includes('does not exist')) {
          setShowTableSetup(true);
        }
      } catch (error) {
        console.error('Error checking profiles table:', error);
        setShowTableSetup(true);
      }
    };
    
    checkProfilesTable();
  }, [supabase]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to complete your profile.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Try to save profile data to Supabase
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        age: parseInt(age) || null,
        nationality,
        occupation,
        updated_at: new Date(),
      });
      
      if (error) {
        if (error.message.includes('does not exist')) {
          // Show table setup if we get a table doesn't exist error
          setShowTableSetup(true);
          setLoading(false);
          return;
        }
        throw error;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      
      // Redirect to chat page
      navigate('/chat');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      toast({
        title: "Update Failed",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableSetupComplete = () => {
    setShowTableSetup(false);
    toast({
      title: "Table Created",
      description: "Profiles table created successfully. You can now complete your profile.",
    });
  };
  
  if (showTableSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <SetupProfilesTable onSetupComplete={handleTableSetupComplete} />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Help us personalize your coaching experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age"
                type="number"
                placeholder="Your age" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality"
                placeholder="Your nationality" 
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input 
                id="occupation"
                placeholder="Your occupation" 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/chat')}
            disabled={loading}
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
