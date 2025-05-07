
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

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [creatingTable, setCreatingTable] = useState(false);
  
  // Form state
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [occupation, setOccupation] = useState('');
  
  // Check if profiles table exists when component mounts and create it if it doesn't
  useEffect(() => {
    const setupProfilesTable = async () => {
      if (!supabase) return;
      
      try {
        // First check if the table already exists
        const { error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        // If there's an error about the table not existing, create it
        if (checkError && checkError.message.includes('does not exist')) {
          setCreatingTable(true);
          
          // Use raw SQL to create the profiles table
          try {
            // Try using the RPC method first
            const { error: rpcError } = await supabase.rpc('create_profiles_table');
            
            // If RPC doesn't exist, use raw SQL
            if (rpcError && rpcError.message.includes('does not exist')) {
              const { error: sqlError } = await supabase.rpc('exec_sql', {
                sql_query: `
                  CREATE TABLE IF NOT EXISTS profiles (
                    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                    age INTEGER,
                    nationality TEXT,
                    occupation TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                  );
                  
                  -- Create a secure RLS policy for the profiles table
                  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
                  
                  -- Create policies
                  CREATE POLICY "Users can view their own profile" 
                    ON profiles FOR SELECT 
                    USING (auth.uid() = id);
                    
                  CREATE POLICY "Users can update their own profile" 
                    ON profiles FOR UPDATE 
                    USING (auth.uid() = id);
                    
                  CREATE POLICY "Users can insert their own profile" 
                    ON profiles FOR INSERT 
                    WITH CHECK (auth.uid() = id);
                `
              });
              
              if (sqlError) {
                throw sqlError;
              }
            } else if (rpcError) {
              throw rpcError;
            }
            
            toast({
              title: "Database Setup Complete",
              description: "Your profile database has been set up successfully.",
            });
            
          } catch (error: any) {
            console.error("Error creating profiles table:", error);
            toast({
              title: "Database Setup Issue",
              description: "There was a problem setting up the database. Your information will be saved locally.",
              variant: "destructive",
            });
          } finally {
            setCreatingTable(false);
          }
        }
      } catch (error) {
        console.error('Error checking profiles table:', error);
      }
    };
    
    setupProfilesTable();
  }, [supabase, toast]);
  
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
          // If table doesn't exist, at least store in local storage
          localStorage.setItem('userProfile', JSON.stringify({
            age: parseInt(age) || null,
            nationality,
            occupation,
          }));
          
          toast({
            title: "Profile Saved Locally",
            description: "Your profile information has been saved locally. It will be synced when database is available.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });
      }
      
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
                disabled={loading || creatingTable}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality"
                placeholder="Your nationality" 
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                disabled={loading || creatingTable}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input 
                id="occupation"
                placeholder="Your occupation" 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                disabled={loading || creatingTable}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || creatingTable}
            >
              {loading ? "Saving..." : creatingTable ? "Setting Up Database..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/chat')}
            disabled={loading || creatingTable}
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;

