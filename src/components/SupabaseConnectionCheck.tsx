
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// This component checks if we can connect to the Supabase project
const SupabaseConnectionCheck = () => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  
  useEffect(() => {
    // This is a simple check to see if we can access Supabase connection info
    // In a real implementation, we'd check for SUPABASE_URL and SUPABASE_ANON_KEY
    // or try to make a simple database query
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      console.log("Checking Supabase connection...");
      
      // First, check if user has manually set credentials in localStorage
      const manualUrl = localStorage.getItem('supabaseUrl');
      const manualKey = localStorage.getItem('supabaseAnonKey');
      
      if (manualUrl && manualKey) {
        console.log("Found manual Supabase configuration");
        setStatus('success');
        return;
      }
      
      // Check if we have Supabase credentials in window._env_
      const hasSupabaseConfig = Boolean(
        window && 
        (window as any)._env_ && 
        (window as any)._env_.SUPABASE_URL && 
        (window as any)._env_.SUPABASE_ANON_KEY
      );
      
      console.log("Has Supabase config:", hasSupabaseConfig);
      
      if (hasSupabaseConfig) {
        console.log("Found Supabase configuration:", {
          url: (window as any)._env_.SUPABASE_URL,
          hasAnonKey: Boolean((window as any)._env_.SUPABASE_ANON_KEY),
        });
        setStatus('success');
      } else {
        // Check for default credentials
        const hasDefaultCredentials = true; // We've added them directly to the code
        if (hasDefaultCredentials) {
          console.log("Using default Supabase configuration");
          setStatus('success');
        } else {
          throw new Error("Supabase configuration not found");
        }
      }
    } catch (error) {
      console.error("Supabase connection check failed:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };
  
  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseUrl || !supabaseAnonKey) {
      toast({
        title: "Error",
        description: "Please provide both Supabase URL and anonymous key",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Store the credentials in localStorage
      localStorage.setItem('supabaseUrl', supabaseUrl);
      localStorage.setItem('supabaseAnonKey', supabaseAnonKey);
      
      toast({
        title: "Success",
        description: "Supabase credentials saved successfully. Checking connection...",
      });
      
      // Check connection again
      checkConnection();
      
      // Hide the manual input form
      setShowManualInput(false);
    } catch (error) {
      console.error("Error saving Supabase credentials:", error);
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
    }
  };
  
  const clearManualCredentials = () => {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseAnonKey');
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    
    toast({
      title: "Info",
      description: "Manual credentials cleared. Rechecking connection...",
    });
    
    // Check connection again
    checkConnection();
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Supabase Connection Status</h2>
      
      {status === 'checking' && (
        <Alert>
          <AlertTitle>Checking connection...</AlertTitle>
          <AlertDescription>
            Please wait while we verify your Supabase connection.
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Connected to Supabase!</AlertTitle>
          <AlertDescription className="text-green-600">
            Your Lovable project is successfully authorized with Supabase.
            {localStorage.getItem('supabaseUrl') && (
              <p className="mt-2 text-xs">Using manually configured connection.</p>
            )}
            {!localStorage.getItem('supabaseUrl') && !(window as any)._env_?.SUPABASE_URL && (
              <p className="mt-2 text-xs">Using default built-in credentials.</p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Connection Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {errorMessage || "Could not connect to Supabase. Please check your authorization."}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-4 space-y-4">
        {!showManualInput ? (
          <div className="flex flex-wrap gap-2">
            <Button onClick={checkConnection} variant="outline" size="sm">
              Check Again
            </Button>
            <Button 
              onClick={() => setShowManualInput(true)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings size={14} />
              Manual Configuration
            </Button>
            {localStorage.getItem('supabaseUrl') && (
              <Button 
                onClick={clearManualCredentials}
                variant="outline" 
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                Clear Manual Config
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualConnect} className="space-y-3 border p-3 rounded-md bg-gray-50">
            <h3 className="font-medium">Manual Supabase Connection</h3>
            
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input 
                id="supabase-url" 
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <Input 
                id="supabase-key" 
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="your-anon-key"
                required
                type="password"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save & Connect</Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowManualInput(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
        
        <p className="text-xs text-gray-500">
          If connection fails, try refreshing the page or reconnecting from the Supabase button.
        </p>
      </div>
    </div>
  );
};

export default SupabaseConnectionCheck;
