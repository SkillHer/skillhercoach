
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

// This component checks if we can connect to the Supabase project
const SupabaseConnectionCheck = () => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // This is a simple check to see if we can access Supabase connection info
    // In a real implementation, we'd check for SUPABASE_URL and SUPABASE_ANON_KEY
    // or try to make a simple database query
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      console.log("Checking Supabase connection...");
      
      // Check if we have Supabase credentials in window._env_
      // This is specific to Lovable's Supabase integration
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
        throw new Error("Supabase configuration not found");
      }
    } catch (error) {
      console.error("Supabase connection check failed:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
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
      
      <div className="mt-4">
        <Button onClick={checkConnection} variant="outline" size="sm">
          Check Again
        </Button>
        <p className="text-xs mt-2 text-gray-500">
          If connection fails, try refreshing the page or reconnecting from the Supabase button.
        </p>
      </div>
    </div>
  );
};

export default SupabaseConnectionCheck;
