
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
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
  
  console.error("No Supabase credentials found");
  return null;
};

export default getSupabaseClient;
