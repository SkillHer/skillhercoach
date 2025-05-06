
import { createClient } from '@supabase/supabase-js';

// Default Supabase credentials
const DEFAULT_SUPABASE_URL = "https://uwprijjrvitirmlzpedd.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cHJpampydml0aXJtbHpwZWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTgwNjgsImV4cCI6MjA2MjEzNDA2OH0.-G4mSLS7unA2yIEEEQujd8vgkI1jBv55Bny1RqwQcsU";

const getSupabaseClient = () => {
  try {
    // First check for manually stored credentials
    const manualUrl = localStorage.getItem('supabaseUrl');
    const manualKey = localStorage.getItem('supabaseAnonKey');
    
    if (manualUrl && manualKey) {
      console.log("Creating Supabase client with manual credentials");
      return createClient(manualUrl, manualKey);
    }
    
    // Then check for credentials in window._env_
    if (window && 
        (window as any)._env_ && 
        (window as any)._env_.SUPABASE_URL && 
        (window as any)._env_.SUPABASE_ANON_KEY) {
      console.log("Creating Supabase client with _env_ credentials");
      return createClient(
        (window as any)._env_.SUPABASE_URL,
        (window as any)._env_.SUPABASE_ANON_KEY
      );
    }
    
    // Use default credentials if no other credentials are available
    console.log("Creating Supabase client with default credentials");
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return null;
  }
};

export default getSupabaseClient;
