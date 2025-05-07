
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '../services/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Database, Table } from 'lucide-react';

interface SetupProfilesTableProps {
  onSetupComplete?: () => void;
}

const SetupProfilesTable: React.FC<SetupProfilesTableProps> = ({ 
  onSetupComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const createProfilesTable = async () => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase client is not initialized",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // First check if the table already exists
      const { error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      // If no error or error isn't about missing table, the table might exist
      if (!checkError || !checkError.message.includes('does not exist')) {
        toast({
          title: "Already Set Up",
          description: "The profiles table already exists in your database.",
        });
        setSetupComplete(true);
        if (onSetupComplete) onSetupComplete();
        setLoading(false);
        return;
      }

      // Use raw SQL to create the profiles table
      const { error } = await supabase.rpc('create_profiles_table');

      if (error) {
        // If the RPC doesn't exist, we'll try to create with raw SQL
        if (error.message.includes('does not exist')) {
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
        } else {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "Profiles table has been created successfully!",
      });
      
      setSetupComplete(true);
      if (onSetupComplete) onSetupComplete();

    } catch (error: any) {
      console.error("Error creating profiles table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create the profiles table. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Database Setup</CardTitle>
        <CardDescription className="text-center">
          {setupComplete 
            ? "Your profiles table has been created successfully!"
            : "Create the profiles table in your Supabase database"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Table className="h-5 w-5" />
              Profiles Table Structure
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>User ID (linked to authentication)</li>
              <li>Age</li>
              <li>Nationality</li>
              <li>Occupation</li>
              <li>Creation & Update timestamps</li>
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        {!setupComplete ? (
          <Button 
            onClick={createProfilesTable} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Setting up..." : "Create Profiles Table"}
          </Button>
        ) : (
          <Button 
            onClick={onSetupComplete} 
            variant="outline"
            className="w-full"
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SetupProfilesTable;
